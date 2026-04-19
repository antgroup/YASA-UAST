mod model;

pub use model::{CompileUnit, NodeInfo, Output, PackagePathInfo, LANGUAGE};
use serde_json::{json, Value};
use std::collections::BTreeMap;
use std::env;
use std::ffi::OsStr;
use std::fmt;
use std::fs;
use std::path::{Path, PathBuf};
use syn::{
    Arm, BinOp, Block, Expr, ExprAssign, ExprBinary, ExprBlock, ExprBreak, ExprCall, ExprContinue,
    ExprField, ExprForLoop, ExprIf, ExprLit, ExprLoop, ExprMatch, ExprMethodCall, ExprPath,
    ExprRange, ExprReference, ExprReturn, ExprTuple, ExprUnary, ExprWhile, Field, Fields, FnArg,
    Item, ItemFn, ItemStruct, Lit, Local, Pat, PatTuple, RangeLimits, ReturnType, Stmt, Type, UnOp,
    Visibility,
};

const SINGLE_FILE_PACKAGE_NAME: &str = "__single__";
const SINGLE_FILE_MODULE_NAME: &str = "__single_module__";
const UNKNOWN_MODULE_NAME: &str = "__unknown_module__";
const CARGO_TOML_FILE_NAME: &str = "Cargo.toml";

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CliArgs {
    pub root_dir: PathBuf,
    pub output: PathBuf,
    pub single: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ParseArgsError {
    HelpRequested,
    Message(String),
}

impl fmt::Display for ParseArgsError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::HelpRequested => write!(f, "{}", usage()),
            Self::Message(msg) => write!(f, "{msg}"),
        }
    }
}

#[derive(Debug)]
pub enum RunError {
    InvalidInputPath {
        mode: &'static str,
        path: PathBuf,
    },
    OutputWouldOverwriteSource {
        source: PathBuf,
        output: PathBuf,
    },
    Io {
        context: String,
        source: std::io::Error,
    },
    Serialize {
        source: serde_json::Error,
    },
    ParseSource {
        path: PathBuf,
        source: syn::Error,
    },
}

impl fmt::Display for RunError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidInputPath { mode, path } => {
                write!(f, "{} mode expects a valid path: {}", mode, path.display())
            }
            Self::OutputWouldOverwriteSource { source, output } => write!(
                f,
                "refusing to overwrite source file in single mode: source={} output={}",
                source.display(),
                output.display()
            ),
            Self::Io { context, source } => write!(f, "{context}: {source}"),
            Self::Serialize { source } => write!(f, "failed to serialize output json: {source}"),
            Self::ParseSource { path, source } => {
                write!(
                    f,
                    "failed to parse rust source {}: {}",
                    path.display(),
                    source
                )
            }
        }
    }
}

impl std::error::Error for RunError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            Self::InvalidInputPath { .. } => None,
            Self::OutputWouldOverwriteSource { .. } => None,
            Self::Io { source, .. } => Some(source),
            Self::Serialize { source } => Some(source),
            Self::ParseSource { source, .. } => Some(source),
        }
    }
}

pub fn usage() -> &'static str {
    "Usage: uast4rust -rootDir <path> -output <path> [-single]"
}

pub fn parse_args_from<I, S>(args: I) -> Result<CliArgs, ParseArgsError>
where
    I: IntoIterator<Item = S>,
    S: Into<String>,
{
    let mut root_dir: Option<PathBuf> = None;
    let mut output: Option<PathBuf> = None;
    let mut single = false;
    let mut iter = args.into_iter().map(Into::into);

    while let Some(arg) = iter.next() {
        match arg.as_str() {
            "-rootDir" | "--rootDir" => {
                let value = next_arg_value(&mut iter, &arg)?;
                root_dir = Some(PathBuf::from(value));
            }
            "-output" | "--output" => {
                let value = next_arg_value(&mut iter, &arg)?;
                output = Some(PathBuf::from(value));
            }
            "-single" | "--single" => {
                single = true;
            }
            "-h" | "--help" => {
                return Err(ParseArgsError::HelpRequested);
            }
            unknown => {
                return Err(ParseArgsError::Message(format!(
                    "Unknown argument: {unknown}"
                )));
            }
        }
    }

    let root_dir = root_dir.ok_or_else(|| {
        ParseArgsError::Message(format!("Missing required argument: -rootDir\n{}", usage()))
    })?;
    let output = output.ok_or_else(|| {
        ParseArgsError::Message(format!("Missing required argument: -output\n{}", usage()))
    })?;

    Ok(CliArgs {
        root_dir,
        output,
        single,
    })
}

fn next_arg_value<I>(iter: &mut I, flag: &str) -> Result<String, ParseArgsError>
where
    I: Iterator<Item = String>,
{
    let value = iter
        .next()
        .ok_or_else(|| ParseArgsError::Message(format!("Missing value for '{}'", flag)))?;
    if is_known_flag(&value) {
        return Err(ParseArgsError::Message(format!(
            "Missing value for '{}'",
            flag
        )));
    }
    Ok(value)
}

fn is_known_flag(value: &str) -> bool {
    matches!(
        value,
        "-rootDir"
            | "--rootDir"
            | "-output"
            | "--output"
            | "-single"
            | "--single"
            | "-h"
            | "--help"
    )
}

pub fn parse_args() -> Result<CliArgs, ParseArgsError> {
    parse_args_from(env::args().skip(1))
}

pub fn run(cli: &CliArgs) -> Result<(), RunError> {
    if cli.single {
        parse_single_file(&cli.root_dir, &cli.output)
    } else {
        parse_project(&cli.root_dir, &cli.output)
    }
}

fn parse_single_file(file: &Path, output: &Path) -> Result<(), RunError> {
    if !file.is_file() {
        return Err(RunError::InvalidInputPath {
            mode: "single",
            path: file.to_path_buf(),
        });
    }

    let source = fs::read_to_string(file).map_err(|source| RunError::Io {
        context: format!("failed to read file {}", file.display()),
        source,
    })?;

    let source_canonical = fs::canonicalize(file).map_err(|source| RunError::Io {
        context: format!("failed to canonicalize source file {}", file.display()),
        source,
    })?;
    let output_canonical = fs::canonicalize(output).unwrap_or_else(|_| output.to_path_buf());
    if source_canonical == output_canonical {
        return Err(RunError::OutputWouldOverwriteSource {
            source: source_canonical,
            output: output.to_path_buf(),
        });
    }

    let file_key = file.to_string_lossy().to_string();
    let parsed_file = syn::parse_file(&source).map_err(|source| RunError::ParseSource {
        path: file.to_path_buf(),
        source,
    })?;
    let compile_unit = lower_single_file_uast(&parsed_file, file_key.clone());
    let mut files = BTreeMap::new();
    files.insert(
        file_key.clone(),
        NodeInfo {
            node: compile_unit,
            package_name: SINGLE_FILE_PACKAGE_NAME.to_string(),
        },
    );

    let output_model = Output {
        package_info: PackagePathInfo {
            path_name: "/".to_string(),
            files,
            subs: BTreeMap::new(),
        },
        module_name: SINGLE_FILE_MODULE_NAME.to_string(),
        cargo_toml_path: String::new(),
        num_of_cargo_toml: 0,
    };

    write_output(output, &output_model)
}

fn parse_project(root_dir: &Path, output: &Path) -> Result<(), RunError> {
    if !root_dir.is_dir() {
        return Err(RunError::InvalidInputPath {
            mode: "project",
            path: root_dir.to_path_buf(),
        });
    }

    let mut manifests = discover_cargo_toml(root_dir)?;
    manifests.sort_by(|a, b| a.rel_path.cmp(&b.rel_path));

    let module_name = manifests
        .iter()
        .find_map(|m| m.package_name.clone())
        .unwrap_or_else(|| UNKNOWN_MODULE_NAME.to_string());
    let cargo_toml_path = manifests
        .first()
        .map(|m| m.rel_path.clone())
        .unwrap_or_default();
    let num_of_cargo_toml = manifests.len();
    let package_info = build_package_info(&manifests);

    let output_model = Output {
        package_info,
        module_name,
        cargo_toml_path,
        num_of_cargo_toml,
    };

    write_output(output, &output_model)
}

fn lower_single_file_uast(file: &syn::File, uri: String) -> CompileUnit {
    let mut unit = CompileUnit::empty(uri);
    unit.body = file.items.iter().filter_map(lower_item).collect();
    unit
}

fn lower_item(item: &Item) -> Option<Value> {
    match item {
        Item::Fn(item_fn) => Some(lower_function(item_fn)),
        Item::Struct(item_struct) => Some(lower_struct(item_struct)),
        _ => None,
    }
}

fn lower_function(item_fn: &ItemFn) -> Value {
    let parameters = item_fn
        .sig
        .inputs
        .iter()
        .filter_map(lower_fn_arg)
        .collect::<Vec<_>>();
    let return_type = lower_return_type(&item_fn.sig.output);
    let body = lower_block(&item_fn.block);

    json!({
        "type": "FunctionDefinition",
        "id": identifier(item_fn.sig.ident.to_string()),
        "parameters": parameters,
        "returnType": return_type,
        "body": body,
        "modifiers": function_modifiers(item_fn),
    })
}

fn function_modifiers(item_fn: &ItemFn) -> Vec<String> {
    let mut modifiers = Vec::new();
    if matches!(item_fn.vis, Visibility::Public(_)) {
        modifiers.push("pub".to_string());
    }
    if item_fn.sig.constness.is_some() {
        modifiers.push("const".to_string());
    }
    if item_fn.sig.asyncness.is_some() {
        modifiers.push("async".to_string());
    }
    if item_fn.sig.unsafety.is_some() {
        modifiers.push("unsafe".to_string());
    }
    modifiers
}

fn lower_struct(item_struct: &ItemStruct) -> Value {
    let body = match &item_struct.fields {
        Fields::Named(named) => named
            .named
            .iter()
            .map(lower_struct_field)
            .collect::<Vec<_>>(),
        Fields::Unnamed(unnamed) => unnamed
            .unnamed
            .iter()
            .enumerate()
            .map(|(idx, field)| lower_unnamed_struct_field(idx, field))
            .collect::<Vec<_>>(),
        Fields::Unit => Vec::new(),
    };

    json!({
        "type": "ClassDefinition",
        "id": identifier(item_struct.ident.to_string()),
        "body": body,
        "supers": [],
    })
}

fn lower_struct_field(field: &Field) -> Value {
    let name = field
        .ident
        .as_ref()
        .expect("fields in a named struct should have an identifier")
        .to_string();
    variable_declaration(identifier(name), None, lower_type(&field.ty), false, false)
}

fn lower_unnamed_struct_field(index: usize, field: &Field) -> Value {
    variable_declaration(
        identifier(format!("_{index}")),
        None,
        lower_type(&field.ty),
        false,
        false,
    )
}

fn lower_fn_arg(arg: &FnArg) -> Option<Value> {
    match arg {
        FnArg::Typed(pat_ty) => {
            let name = extract_binding_name(&pat_ty.pat)?;
            Some(variable_declaration(
                identifier(name),
                None,
                lower_type(&pat_ty.ty),
                false,
                false,
            ))
        }
        FnArg::Receiver(_) => None,
    }
}

fn lower_stmt(stmt: &Stmt) -> Option<Value> {
    match stmt {
        Stmt::Local(local) => lower_local(local),
        Stmt::Item(item) => lower_item(item),
        Stmt::Expr(expr, _) => lower_expr(expr),
        Stmt::Macro(_) => None,
    }
}

fn lower_local(local: &Local) -> Option<Value> {
    match &local.pat {
        Pat::Tuple(tuple_pat) => lower_tuple_pattern_local(local, tuple_pat),
        _ => lower_single_pattern_local(local),
    }
}

fn lower_single_pattern_local(local: &Local) -> Option<Value> {
    let (name, explicit_type) = extract_binding_name_and_type(&local.pat)?;
    let init = local
        .init
        .as_ref()
        .and_then(|local_init| lower_expr(&local_init.expr));
    if name == "_" {
        return init;
    }
    let var_type = explicit_type.map(lower_type).unwrap_or_else(dynamic_type);
    let cloned = init.is_some();
    Some(variable_declaration(
        identifier(name),
        init,
        var_type,
        cloned,
        false,
    ))
}

fn lower_tuple_pattern_local(local: &Local, tuple_pat: &PatTuple) -> Option<Value> {
    let tuple_init_elements =
        local
            .init
            .as_ref()
            .and_then(|local_init| match local_init.expr.as_ref() {
                Expr::Tuple(expr_tuple) => Some(&expr_tuple.elems),
                _ => None,
            });
    let tuple_init_expr = local
        .init
        .as_ref()
        .and_then(|local_init| lower_expr(&local_init.expr));

    let mut declarations = Vec::new();
    for (idx, pat) in tuple_pat.elems.iter().enumerate() {
        let Some((name, explicit_type)) = extract_binding_name_and_type(pat) else {
            continue;
        };
        if name == "_" {
            continue;
        }
        let init = tuple_init_elements
            .as_ref()
            .and_then(|elems| elems.iter().nth(idx))
            .and_then(lower_expr)
            .or_else(|| {
                tuple_init_expr
                    .as_ref()
                    .map(|expr| member_access(expr.clone(), literal_number(idx as i64), true))
            });
        let var_type = explicit_type.map(lower_type).unwrap_or_else(dynamic_type);
        let cloned = init.is_some();
        declarations.push(variable_declaration(
            identifier(name),
            init,
            var_type,
            cloned,
            false,
        ));
    }

    if declarations.is_empty() {
        return local
            .init
            .as_ref()
            .and_then(|local_init| lower_expr(&local_init.expr));
    }
    if declarations.len() == 1 {
        return declarations.into_iter().next();
    }
    Some(sequence(declarations))
}

fn lower_expr(expr: &Expr) -> Option<Value> {
    match expr {
        Expr::Path(expr_path) => Some(lower_path(expr_path)),
        Expr::Call(expr_call) => lower_call(expr_call),
        Expr::MethodCall(expr_method_call) => lower_method_call(expr_method_call),
        Expr::Field(expr_field) => lower_field_access(expr_field),
        Expr::Assign(expr_assign) => lower_assignment(expr_assign),
        Expr::Binary(expr_binary) => lower_binary(expr_binary),
        Expr::Unary(expr_unary) => lower_unary(expr_unary),
        Expr::Reference(expr_reference) => lower_reference(expr_reference),
        Expr::Tuple(expr_tuple) => Some(lower_tuple(expr_tuple)),
        Expr::Range(expr_range) => lower_range_expr(expr_range),
        Expr::If(expr_if) => lower_if(expr_if),
        Expr::Match(expr_match) => lower_match(expr_match),
        Expr::ForLoop(expr_for_loop) => lower_for_loop(expr_for_loop),
        Expr::While(expr_while) => lower_while(expr_while),
        Expr::Loop(expr_loop) => lower_loop(expr_loop),
        Expr::Break(expr_break) => Some(lower_break(expr_break)),
        Expr::Continue(expr_continue) => Some(lower_continue(expr_continue)),
        Expr::Block(expr_block) => Some(lower_block(&expr_block.block)),
        Expr::Return(expr_return) => Some(lower_return(expr_return)),
        Expr::Lit(expr_lit) => Some(lower_literal(expr_lit)),
        Expr::Paren(expr_paren) => lower_expr(&expr_paren.expr),
        Expr::Group(expr_group) => lower_expr(&expr_group.expr),
        _ => None,
    }
}

fn lower_path(expr_path: &ExprPath) -> Value {
    lower_syn_path(&expr_path.path)
}

fn lower_syn_path(path: &syn::Path) -> Value {
    let mut segments = path.segments.iter();
    let first = segments
        .next()
        .expect("path should have at least one segment");

    let mut value = identifier(first.ident.to_string());
    for segment in segments {
        value = member_access(value, identifier(segment.ident.to_string()), false);
    }
    value
}

fn lower_call(expr_call: &ExprCall) -> Option<Value> {
    let callee = lower_expr(&expr_call.func)?;
    let arguments = expr_call
        .args
        .iter()
        .map(|arg| lower_expr(arg).unwrap_or(Value::Null))
        .collect::<Vec<_>>();
    Some(json!({
        "type": "CallExpression",
        "callee": callee,
        "arguments": arguments,
    }))
}

fn lower_method_call(expr_method_call: &ExprMethodCall) -> Option<Value> {
    let object = lower_expr(&expr_method_call.receiver)?;
    let callee = member_access(
        object,
        identifier(expr_method_call.method.to_string()),
        false,
    );
    let arguments = expr_method_call
        .args
        .iter()
        .map(|arg| lower_expr(arg).unwrap_or(Value::Null))
        .collect::<Vec<_>>();
    Some(json!({
        "type": "CallExpression",
        "callee": callee,
        "arguments": arguments,
    }))
}

fn lower_field_access(expr_field: &ExprField) -> Option<Value> {
    let object = lower_expr(&expr_field.base)?;
    Some(match &expr_field.member {
        syn::Member::Named(ident) => member_access(object, identifier(ident.to_string()), false),
        syn::Member::Unnamed(index) => {
            member_access(object, literal_number(index.index as i64), true)
        }
    })
}

fn lower_assignment(expr_assign: &ExprAssign) -> Option<Value> {
    let left = lower_expr(&expr_assign.left)?;
    let right = lower_expr(&expr_assign.right)?;
    Some(json!({
        "type": "AssignmentExpression",
        "left": left,
        "right": right,
        "operator": "=",
        "cloned": true,
    }))
}

fn lower_binary(expr_binary: &ExprBinary) -> Option<Value> {
    let left = lower_expr(&expr_binary.left)?;
    let right = lower_expr(&expr_binary.right)?;
    match &expr_binary.op {
        BinOp::Add(_) => Some(binary_expression("+", left, right)),
        BinOp::Sub(_) => Some(binary_expression("-", left, right)),
        BinOp::Mul(_) => Some(binary_expression("*", left, right)),
        BinOp::Div(_) => Some(binary_expression("/", left, right)),
        BinOp::Rem(_) => Some(binary_expression("%", left, right)),
        BinOp::And(_) => Some(binary_expression("&&", left, right)),
        BinOp::Or(_) => Some(binary_expression("||", left, right)),
        BinOp::BitXor(_) => Some(binary_expression("^", left, right)),
        BinOp::BitAnd(_) => Some(binary_expression("&", left, right)),
        BinOp::BitOr(_) => Some(binary_expression("|", left, right)),
        BinOp::Shl(_) => Some(binary_expression("<<", left, right)),
        BinOp::Shr(_) => Some(binary_expression(">>", left, right)),
        BinOp::Eq(_) => Some(binary_expression("==", left, right)),
        BinOp::Lt(_) => Some(binary_expression("<", left, right)),
        BinOp::Le(_) => Some(binary_expression("<=", left, right)),
        BinOp::Ne(_) => Some(binary_expression("!=", left, right)),
        BinOp::Ge(_) => Some(binary_expression(">=", left, right)),
        BinOp::Gt(_) => Some(binary_expression(">", left, right)),
        BinOp::AddAssign(_) => Some(assignment_expression("+=", left, right)),
        BinOp::SubAssign(_) => Some(assignment_expression("-=", left, right)),
        BinOp::MulAssign(_) => Some(assignment_expression("*=", left, right)),
        BinOp::DivAssign(_) => Some(assignment_expression("/=", left, right)),
        BinOp::RemAssign(_) => Some(assignment_expression("%=", left, right)),
        BinOp::BitXorAssign(_) => Some(assignment_expression("^=", left, right)),
        BinOp::BitAndAssign(_) => Some(assignment_expression("&=", left, right)),
        BinOp::BitOrAssign(_) => Some(assignment_expression("|=", left, right)),
        BinOp::ShlAssign(_) => Some(assignment_expression("<<=", left, right)),
        BinOp::ShrAssign(_) => Some(assignment_expression(">>=", left, right)),
        _ => None,
    }
}

fn lower_unary(expr_unary: &ExprUnary) -> Option<Value> {
    let argument = lower_expr(&expr_unary.expr)?;
    match &expr_unary.op {
        UnOp::Neg(_) => Some(unary_expression("-", argument)),
        UnOp::Not(_) => Some(unary_expression("!", argument)),
        UnOp::Deref(_) => Some(json!({
            "type": "DereferenceExpression",
            "argument": argument,
        })),
        _ => None,
    }
}

fn lower_reference(expr_reference: &ExprReference) -> Option<Value> {
    let argument = lower_expr(&expr_reference.expr)?;
    Some(json!({
        "type": "ReferenceExpression",
        "argument": argument,
    }))
}

fn lower_tuple(expr_tuple: &ExprTuple) -> Value {
    let elements = expr_tuple
        .elems
        .iter()
        .filter_map(lower_expr)
        .collect::<Vec<_>>();
    json!({
        "type": "TupleExpression",
        "elements": elements,
        "modifiable": false,
    })
}

fn lower_range_expr(expr_range: &ExprRange) -> Option<Value> {
    let start = expr_range
        .start
        .as_ref()
        .and_then(|expr| lower_expr(expr))
        .unwrap_or_else(noop);
    let end = expr_range
        .end
        .as_ref()
        .and_then(|expr| lower_expr(expr))
        .unwrap_or_else(noop);
    let inclusive = matches!(expr_range.limits, RangeLimits::Closed(_));

    Some(json!({
        "type": "TupleExpression",
        "elements": [start, end, literal_boolean(inclusive)],
        "modifiable": false,
    }))
}

fn lower_if(expr_if: &ExprIf) -> Option<Value> {
    let test = lower_expr(&expr_if.cond)?;
    let consequent = lower_block(&expr_if.then_branch);
    let alternative = expr_if
        .else_branch
        .as_ref()
        .and_then(|(_, else_expr)| lower_if_alternative(else_expr))
        .unwrap_or(Value::Null);
    Some(json!({
        "type": "IfStatement",
        "test": test,
        "consequent": consequent,
        "alternative": alternative,
    }))
}

fn lower_if_alternative(else_expr: &Expr) -> Option<Value> {
    match else_expr {
        Expr::If(expr_if) => lower_if(expr_if),
        Expr::Block(ExprBlock { block, .. }) => Some(lower_block(block)),
        _ => lower_expr(else_expr),
    }
}

fn lower_match(expr_match: &ExprMatch) -> Option<Value> {
    let discriminant = lower_expr(&expr_match.expr)?;
    if expr_match.arms.iter().any(|arm| arm.guard.is_some()) {
        return lower_match_with_guards(&discriminant, &expr_match.arms);
    }

    let mut cases = Vec::new();
    for arm in &expr_match.arms {
        let body = lower_expr(arm.body.as_ref()).unwrap_or_else(empty_scoped_statement);
        let tests = lower_match_arm_tests(&arm.pat);
        for test in tests {
            cases.push(case_clause(test, body.clone()));
        }
    }
    Some(json!({
        "type": "SwitchStatement",
        "discriminant": discriminant,
        "cases": cases,
    }))
}

fn lower_match_with_guards(discriminant: &Value, arms: &[Arm]) -> Option<Value> {
    let mut alternative = Value::Null;
    for arm in arms.iter().rev() {
        let consequent = lower_expr(arm.body.as_ref())
            .map(ensure_scoped_statement)
            .unwrap_or_else(empty_scoped_statement);
        let condition = lower_match_arm_condition(
            discriminant,
            &arm.pat,
            arm.guard.as_ref().map(|(_, guard)| guard.as_ref()),
        )?;
        alternative = match condition {
            Some(test) => json!({
                "type": "IfStatement",
                "test": test,
                "consequent": consequent,
                "alternative": alternative,
            }),
            None => consequent,
        };
    }
    if alternative.is_null() {
        return Some(empty_scoped_statement());
    }
    Some(alternative)
}

fn lower_match_arm_condition(
    discriminant: &Value,
    pat: &Pat,
    guard: Option<&Expr>,
) -> Option<Option<Value>> {
    let pattern_test = lower_match_pattern_condition(discriminant, pat);
    let guard_test = match guard {
        Some(guard_expr) => Some(lower_expr(guard_expr)?),
        None => None,
    };
    let condition = match (pattern_test, guard_test) {
        (Some(pattern), Some(guard)) => Some(binary_expression("&&", pattern, guard)),
        (Some(pattern), None) => Some(pattern),
        (None, Some(guard)) => Some(guard),
        (None, None) => None,
    };
    Some(condition)
}

fn lower_match_pattern_condition(discriminant: &Value, pat: &Pat) -> Option<Value> {
    let tests = lower_match_arm_tests(pat);
    if tests.iter().any(Option::is_none) {
        return None;
    }

    let mut checks = tests
        .into_iter()
        .flatten()
        .map(|test| binary_expression("==", discriminant.clone(), test))
        .collect::<Vec<_>>();

    let mut condition = checks.pop()?;
    while let Some(next) = checks.pop() {
        condition = binary_expression("||", next, condition);
    }
    Some(condition)
}

fn lower_match_arm_tests(pat: &Pat) -> Vec<Option<Value>> {
    match pat {
        Pat::Or(pat_or) => pat_or
            .cases
            .iter()
            .map(lower_match_pattern_test)
            .collect::<Vec<_>>(),
        _ => vec![lower_match_pattern_test(pat)],
    }
}

fn lower_match_pattern_test(pat: &Pat) -> Option<Value> {
    match pat {
        Pat::Lit(pat_lit) => Some(lower_lit(&pat_lit.lit)),
        Pat::Path(pat_path) => Some(lower_syn_path(&pat_path.path)),
        Pat::TupleStruct(pat_tuple_struct) => Some(lower_syn_path(&pat_tuple_struct.path)),
        Pat::Struct(pat_struct) => Some(lower_syn_path(&pat_struct.path)),
        Pat::Ident(pat_ident) => pat_ident
            .subpat
            .as_ref()
            .and_then(|(_, subpat)| lower_match_pattern_test(subpat)),
        Pat::Reference(pat_reference) => lower_match_pattern_test(&pat_reference.pat),
        Pat::Wild(_) => None,
        _ => None,
    }
}

fn lower_for_loop(expr_for_loop: &ExprForLoop) -> Option<Value> {
    let right = lower_expr(&expr_for_loop.expr)?;
    let (key, value) = lower_range_binding(&expr_for_loop.pat);
    Some(json!({
        "type": "RangeStatement",
        "key": key.unwrap_or(Value::Null),
        "value": value.unwrap_or(Value::Null),
        "right": right,
        "body": lower_block(&expr_for_loop.body),
    }))
}

fn lower_range_binding(pat: &Pat) -> (Option<Value>, Option<Value>) {
    match pat {
        Pat::Ident(pat_ident) => (None, Some(identifier(pat_ident.ident.to_string()))),
        Pat::Tuple(tuple) => {
            let mut names = tuple
                .elems
                .iter()
                .filter_map(extract_range_binding_name)
                .map(identifier)
                .collect::<Vec<_>>();
            match names.len() {
                0 => (None, None),
                1 => (None, names.pop()),
                _ => (Some(names.remove(0)), Some(names.remove(0))),
            }
        }
        Pat::Reference(pat_reference) => lower_range_binding(&pat_reference.pat),
        _ => {
            let value = extract_range_binding_name(pat).map(identifier);
            (None, value)
        }
    }
}

fn extract_range_binding_name(pat: &Pat) -> Option<String> {
    match pat {
        Pat::Wild(_) => None,
        Pat::Ident(pat_ident) => Some(pat_ident.ident.to_string()),
        Pat::Reference(pat_reference) => extract_range_binding_name(&pat_reference.pat),
        Pat::Type(pat_type) => extract_range_binding_name(&pat_type.pat),
        _ => extract_binding_name(pat).and_then(|name| if name == "_" { None } else { Some(name) }),
    }
}

fn lower_while(expr_while: &ExprWhile) -> Option<Value> {
    let test = lower_expr(&expr_while.cond)?;
    Some(json!({
        "type": "WhileStatement",
        "test": test,
        "body": lower_block(&expr_while.body),
        "isPostTest": Value::Null,
    }))
}

fn lower_loop(expr_loop: &ExprLoop) -> Option<Value> {
    Some(json!({
        "type": "WhileStatement",
        "test": literal_boolean(true),
        "body": lower_block(&expr_loop.body),
        "isPostTest": Value::Null,
    }))
}

fn lower_break(expr_break: &ExprBreak) -> Value {
    let label = expr_break
        .label
        .as_ref()
        .map(|lifetime| identifier(lifetime.ident.to_string()))
        .unwrap_or(Value::Null);
    json!({
        "type": "BreakStatement",
        "label": label,
    })
}

fn lower_continue(expr_continue: &ExprContinue) -> Value {
    let label = expr_continue
        .label
        .as_ref()
        .map(|lifetime| identifier(lifetime.ident.to_string()))
        .unwrap_or(Value::Null);
    json!({
        "type": "ContinueStatement",
        "label": label,
    })
}

fn lower_block(block: &Block) -> Value {
    scoped_statement(block.stmts.iter().filter_map(lower_stmt).collect())
}

fn lower_return(expr_return: &ExprReturn) -> Value {
    let argument = expr_return
        .expr
        .as_ref()
        .and_then(|expr| lower_expr(expr))
        .unwrap_or(Value::Null);
    json!({
        "type": "ReturnStatement",
        "argument": argument,
        "isYield": false,
    })
}

fn lower_literal(expr_lit: &ExprLit) -> Value {
    lower_lit(&expr_lit.lit)
}

fn lower_lit(lit: &Lit) -> Value {
    match lit {
        Lit::Int(value) => match value.base10_parse::<i64>() {
            Ok(number) => literal_number(number),
            Err(_) => json!({
                "type": "Literal",
                "value": value.base10_digits(),
                "literalType": "number",
            }),
        },
        Lit::Float(value) => match value.base10_parse::<f64>() {
            Ok(number) => json!({
                "type": "Literal",
                "value": number,
                "literalType": "number",
            }),
            Err(_) => json!({
                "type": "Literal",
                "value": value.base10_digits(),
                "literalType": "number",
            }),
        },
        Lit::Bool(value) => json!({
            "type": "Literal",
            "value": value.value,
            "literalType": "boolean",
        }),
        Lit::Str(value) => json!({
            "type": "Literal",
            "value": value.value(),
            "literalType": "string",
        }),
        Lit::Char(value) => json!({
            "type": "Literal",
            "value": value.value().to_string(),
            "literalType": "string",
        }),
        _ => null_literal(),
    }
}

fn lower_return_type(return_type: &ReturnType) -> Value {
    match return_type {
        ReturnType::Default => void_type(),
        ReturnType::Type(_, ty) => {
            if let Type::Tuple(tuple) = ty.as_ref() {
                if tuple.elems.is_empty() {
                    return void_type();
                }
            }
            lower_type(ty)
        }
    }
}

fn lower_type(ty: &Type) -> Value {
    match ty {
        Type::Path(path) => dynamic_type_with_id(
            path.path
                .segments
                .last()
                .map(|segment| segment.ident.to_string()),
        ),
        Type::Reference(reference) => lower_type(&reference.elem),
        Type::Tuple(tuple) if tuple.elems.is_empty() => void_type(),
        _ => dynamic_type(),
    }
}

fn extract_binding_name_and_type<'a>(pat: &'a Pat) -> Option<(String, Option<&'a Type>)> {
    match pat {
        Pat::Type(pat_type) => {
            let (name, _) = extract_binding_name_and_type(&pat_type.pat)?;
            Some((name, Some(pat_type.ty.as_ref())))
        }
        Pat::Ident(pat_ident) => Some((pat_ident.ident.to_string(), None)),
        Pat::Wild(_) => Some(("_".to_string(), None)),
        Pat::Reference(pat_ref) => extract_binding_name_and_type(&pat_ref.pat),
        _ => None,
    }
}

fn extract_binding_name(pat: &Pat) -> Option<String> {
    extract_binding_name_and_type(pat).map(|(name, _)| name)
}

fn variable_declaration(
    id: Value,
    init: Option<Value>,
    var_type: Value,
    cloned: bool,
    variable_param: bool,
) -> Value {
    json!({
        "type": "VariableDeclaration",
        "id": id,
        "init": init.unwrap_or(Value::Null),
        "cloned": cloned,
        "varType": var_type,
        "variableParam": variable_param,
    })
}

fn sequence(expressions: Vec<Value>) -> Value {
    json!({
        "type": "Sequence",
        "expressions": expressions,
    })
}

fn assignment_expression(operator: &str, left: Value, right: Value) -> Value {
    json!({
        "type": "AssignmentExpression",
        "left": left,
        "right": right,
        "operator": operator,
        "cloned": true,
    })
}

fn binary_expression(operator: &str, left: Value, right: Value) -> Value {
    json!({
        "type": "BinaryExpression",
        "operator": operator,
        "left": left,
        "right": right,
    })
}

fn unary_expression(operator: &str, argument: Value) -> Value {
    json!({
        "type": "UnaryExpression",
        "operator": operator,
        "argument": argument,
        "isSuffix": false,
    })
}

fn identifier(name: impl Into<String>) -> Value {
    json!({
        "type": "Identifier",
        "name": name.into(),
    })
}

fn literal_number(value: i64) -> Value {
    json!({
        "type": "Literal",
        "value": value,
        "literalType": "number",
    })
}

fn literal_boolean(value: bool) -> Value {
    json!({
        "type": "Literal",
        "value": value,
        "literalType": "boolean",
    })
}

fn null_literal() -> Value {
    json!({
        "type": "Literal",
        "value": Value::Null,
        "literalType": "null",
    })
}

fn noop() -> Value {
    json!({
        "type": "Noop",
    })
}

fn member_access(object: Value, property: Value, computed: bool) -> Value {
    json!({
        "type": "MemberAccess",
        "object": object,
        "property": property,
        "computed": computed,
    })
}

fn scoped_statement(body: Vec<Value>) -> Value {
    json!({
        "type": "ScopedStatement",
        "body": body,
        "id": Value::Null,
    })
}

fn ensure_scoped_statement(instruction: Value) -> Value {
    match instruction.get("type").and_then(Value::as_str) {
        Some("ScopedStatement") => instruction,
        _ => scoped_statement(vec![instruction]),
    }
}

fn empty_scoped_statement() -> Value {
    scoped_statement(Vec::new())
}

fn case_clause(test: Option<Value>, body: Value) -> Value {
    json!({
        "type": "CaseClause",
        "test": test.unwrap_or(Value::Null),
        "body": body,
    })
}

fn dynamic_type() -> Value {
    dynamic_type_with_id(None)
}

fn dynamic_type_with_id(id: Option<String>) -> Value {
    json!({
        "type": "DynamicType",
        "id": id.map(identifier).unwrap_or(Value::Null),
        "typeArguments": Value::Null,
    })
}

fn void_type() -> Value {
    json!({
        "type": "VoidType",
        "id": Value::Null,
        "typeArguments": Value::Null,
    })
}

#[derive(Debug)]
struct CargoManifestInfo {
    rel_path: String,
    package_name: Option<String>,
}

fn discover_cargo_toml(root_dir: &Path) -> Result<Vec<CargoManifestInfo>, RunError> {
    let mut found_paths = Vec::new();
    walk_for_cargo_toml(root_dir, &mut found_paths)?;
    let mut manifests = Vec::with_capacity(found_paths.len());
    for manifest_path in found_paths {
        let rel_path = manifest_rel_path(root_dir, &manifest_path);
        let package_name = parse_package_name_from_manifest(&manifest_path)?;
        manifests.push(CargoManifestInfo {
            rel_path,
            package_name,
        });
    }
    Ok(manifests)
}

fn walk_for_cargo_toml(dir: &Path, found_paths: &mut Vec<PathBuf>) -> Result<(), RunError> {
    let entries = fs::read_dir(dir).map_err(|source| RunError::Io {
        context: format!("failed to read directory {}", dir.display()),
        source,
    })?;

    for entry in entries {
        let entry = entry.map_err(|source| RunError::Io {
            context: format!("failed to read directory entry in {}", dir.display()),
            source,
        })?;
        let path = entry.path();
        let file_type = entry.file_type().map_err(|source| RunError::Io {
            context: format!("failed to inspect file type {}", path.display()),
            source,
        })?;

        if file_type.is_dir() {
            if should_skip_dir(path.file_name()) {
                continue;
            }
            walk_for_cargo_toml(&path, found_paths)?;
            continue;
        }

        if file_type.is_file() && path.file_name() == Some(OsStr::new(CARGO_TOML_FILE_NAME)) {
            found_paths.push(path);
        }
    }

    Ok(())
}

fn should_skip_dir(name: Option<&OsStr>) -> bool {
    let Some(name) = name.and_then(OsStr::to_str) else {
        return false;
    };
    if name.starts_with('.') {
        return true;
    }
    matches!(name, "target" | "node_modules" | "vendor" | ".venv")
}

fn manifest_rel_path(root_dir: &Path, manifest_path: &Path) -> String {
    let rel = manifest_path
        .strip_prefix(root_dir)
        .expect("discovered manifest should be inside root_dir");
    let rel_str = rel.to_string_lossy().replace('\\', "/");
    format!("/{rel_str}")
}

fn parse_package_name_from_manifest(manifest_path: &Path) -> Result<Option<String>, RunError> {
    let content = fs::read_to_string(manifest_path).map_err(|source| RunError::Io {
        context: format!("failed to read manifest {}", manifest_path.display()),
        source,
    })?;

    let value = match toml::from_str::<toml::Value>(&content) {
        Ok(v) => v,
        Err(_) => return Ok(None),
    };

    let name = value
        .get("package")
        .and_then(|v| v.get("name"))
        .and_then(toml::Value::as_str)
        .map(str::trim)
        .filter(|name| !name.is_empty())
        .map(str::to_string);
    Ok(name)
}

fn build_package_info(manifests: &[CargoManifestInfo]) -> PackagePathInfo {
    let mut root = PackagePathInfo::empty_root();
    for manifest in manifests {
        insert_manifest_into_tree(&mut root, manifest);
    }
    root
}

fn insert_manifest_into_tree(root: &mut PackagePathInfo, manifest: &CargoManifestInfo) {
    let mut node = root;
    let parts: Vec<&str> = manifest
        .rel_path
        .split('/')
        .filter(|s| !s.is_empty())
        .collect();
    if parts.is_empty() {
        return;
    }
    for part in &parts[..parts.len().saturating_sub(1)] {
        node = node
            .subs
            .entry((*part).to_string())
            .or_insert_with(|| PackagePathInfo {
                path_name: (*part).to_string(),
                files: BTreeMap::new(),
                subs: BTreeMap::new(),
            });
    }

    let package_name = manifest
        .package_name
        .clone()
        .unwrap_or_else(|| UNKNOWN_MODULE_NAME.to_string());
    node.files.insert(
        manifest.rel_path.clone(),
        NodeInfo {
            node: CompileUnit::empty(manifest.rel_path.clone()),
            package_name,
        },
    );
}

fn write_output(output_path: &Path, output: &Output) -> Result<(), RunError> {
    if let Some(parent) = output_path.parent() {
        if !parent.as_os_str().is_empty() {
            fs::create_dir_all(parent).map_err(|source| RunError::Io {
                context: format!("failed to create output directory {}", parent.display()),
                source,
            })?;
        }
    }

    let json = serde_json::to_vec(output).map_err(|source| RunError::Serialize { source })?;
    fs::write(output_path, json).map_err(|source| RunError::Io {
        context: format!("failed to write output {}", output_path.display()),
        source,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_args_accepts_expected_flags() {
        let args = vec![
            "-rootDir",
            "/tmp/example.rs",
            "-output",
            "/tmp/output.json",
            "-single",
        ];
        let cli = parse_args_from(args).expect("parse args");
        assert_eq!(cli.root_dir, PathBuf::from("/tmp/example.rs"));
        assert_eq!(cli.output, PathBuf::from("/tmp/output.json"));
        assert!(cli.single);
    }

    #[test]
    fn parse_args_rejects_missing_required_flags() {
        let args = vec!["-rootDir", "/tmp/example.rs"];
        let err = parse_args_from(args).expect_err("missing output should fail");
        assert!(matches!(err, ParseArgsError::Message(_)));
        assert!(err.to_string().contains("-output"));
    }

    #[test]
    fn parse_args_rejects_flag_as_value() {
        let args = vec!["-rootDir", "-output", "-output", "/tmp/out.json"];
        let err = parse_args_from(args).expect_err("flag used as value should fail");
        assert!(matches!(err, ParseArgsError::Message(_)));
        assert!(err.to_string().contains("Missing value for '-rootDir'"));
    }

    #[test]
    fn parse_package_name_reads_package_section_name() {
        let temp = tempfile::tempdir().expect("tempdir");
        let manifest = temp.path().join("Cargo.toml");
        fs::write(
            &manifest,
            "[workspace]\nmembers=[\"a\"]\n\n[package]\nname = \"demo_name\"\nversion = \"0.1.0\"\n",
        )
        .expect("write manifest");

        let name = parse_package_name_from_manifest(&manifest)
            .expect("parse manifest")
            .expect("package name");
        assert_eq!(name, "demo_name");
    }

    #[test]
    fn parse_package_name_keeps_hash_inside_quoted_name() {
        let temp = tempfile::tempdir().expect("tempdir");
        let manifest = temp.path().join("Cargo.toml");
        fs::write(
            &manifest,
            "[package]\nname = \"foo#bar\" # trailing comment\nversion = \"0.1.0\"\n",
        )
        .expect("write manifest");

        let name = parse_package_name_from_manifest(&manifest)
            .expect("parse manifest")
            .expect("package name");
        assert_eq!(name, "foo#bar");
    }
}
