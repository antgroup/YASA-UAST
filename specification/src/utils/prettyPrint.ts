function prepareList(args, isArgs, need2Cr?){
    const crs = need2Cr?'\n\n': '\n';
    const split = isArgs? ',': crs;
    let argContent = '';
    for(let i = 0; i < args.length; i++){
        argContent += prettyPrint(args[i]);
        if (args.length !== 1 && i !== args.length - 1) {
            argContent += split;
        }
    }
    return argContent;
}

function prepareBody(body){
    if (body.type === 'ScopedStatement'){
        const bodyContent = prettyPrint(prepareList(body.body, false, false),2);
        return ['{\n', bodyContent + '\n','}\n'];
    }else{
        const bodyContent = prettyPrint(body, 2);
        return ['{\n', bodyContent, '}\n'];
    }
}

function _prettyPrint(indent, nodes, opts?){
    if (!nodes) return '';
    let indentStr = '';
    for(let i = 0; i < indent; i++){
        indentStr += ' ';
    }
    let content = '';
    let needIndent = true;
    if (Array.isArray(nodes)){
        nodes.forEach(n=>{
            content += _prettyPrint(needIndent?indent:0, n);
            needIndent = content.endsWith('\n')? true: false;
        })
        return content;
    }
    const node = nodes;
    if (typeof node === 'string'){
        content += indentStr + node.replace(/(\n){2,}/g, '\n').replaceAll('\n', '\n' + indentStr);
        return content.replace(/\n\s+$/, '\n');
        
    }
    if (typeof node !== 'object'){
        return node;
    }
    const annotations = node._meta.annotations;
    if (annotations){
        annotations.forEach(a=>{
            content += _prettyPrint(indent, ['@', a]);
        })
    }
    switch(node.type){
        case 'AssignmentExpression':
            content +=  _prettyPrint(indent, [node.left, node.operator, node.right]);
            break;
        case 'BinaryExpression':
            content +=   _prettyPrint(indent, [node.left, node.operator,  node.right]);
            break;
        case 'BreakStatement':
            content +=  _prettyPrint(indent, ['break ', node.label]);
            break;
        case 'CallExpression':{
            const argsContent = prepareList(node.arguments,true);
            content +=  _prettyPrint(indent, [node.callee, '(', argsContent, ')']);
            break;
        }
        case 'CaseClause':
            content +=  _prettyPrint(indent, ['case ', node.test, ':\n', prettyPrint(node.body, 2)]);
            break;
        case 'CatchClause':
            content +=  _prettyPrint(indent, [`catch (`, prettyPrint(node.parameter), ') \n', ...prepareBody(node.body)]);
            break;
        case 'ClassDefinition':
            content +=  _prettyPrint(indent, [`class `, node.id, '{\n', prettyPrint(prepareList(node.body,false, true),2)+'\n', '}\n']);
            break;
        case 'CompileUnit':
            content +=  prepareList(node.body, false);
            break;
        case 'ConditionalExpression':
            content +=  _prettyPrint(indent,[node.test, '?', node.consequent, ':', node.alternative]);
            break;
        case 'ContinueStatement':
            content +=  _prettyPrint(indent,['continue ', node.label]);
            break;
        //  | DereferenceExpression
        //   | DynamicType
        case 'ExportStatement':
            content +=  _prettyPrint(indent,  [`export `, node.argument]);
            break;
        case 'ExpressionStatement':
            content +=  _prettyPrint(indent,  node.expression);
            break;
        case 'ForStatement':
            content +=  _prettyPrint(indent, [`for (`, node.init, ';', node.test, ';',  node.update, ')',  ...prepareBody(node.body)]);
            break;
        case 'FunctionDefinition': {
            content +=  _prettyPrint(indent, [`function ${prettyPrint(node.id)} ( ${prepareList(node.parameters,true)} )\n`, ...prepareBody(node.body)]);
            break;
        }
        case 'Identifier':
            content +=   _prettyPrint(indent, node.name);
            break;
        case 'IfStatement': {
            content += _prettyPrint(indent, [`if (`, node.test, ')\n', ...prepareBody(node.consequent)]);
            if (node.alternative) {
                content += _prettyPrint(indent,[`else\n`, ...prepareBody(node.alternative)]);
            }
            break;
        }
        case 'ImportExpression':
            content +=  _prettyPrint(indent,[`import `, node.imported, ' from ', node.from]);
            break;
        case 'LabeledStatement':
            content +=  _prettyPrint(indent, [node.label,': \n', ...prepareBody(node.body)]);
            break;
        case 'Literal':
            content +=  _prettyPrint(indent,node.value);
            break;
        case 'MemberAccess':
            content +=  _prettyPrint(indent, [node.object, '.', node.property]);
            break;
        case 'NewExpression':
            content +=  _prettyPrint(indent, ['new ', node.callee, '(', prepareList(node.arguments,true), ')']);
            break;
        case 'Noop':
            content +=  _prettyPrint(indent,'Noop');
            break;
        case 'ObjectExpression':
            content +=  _prettyPrint(indent, [node.id, ' {\n', prettyPrint(prepareList(node.properties, false),2)+'\n' , '}\n']);
            break;
        case 'ObjectProperty':
            content +=  _prettyPrint(indent,[node.key, ':', node.value]);
            break;
        case 'RangeStatement':
            content +=   _prettyPrint(indent, ['for (', node.key, ' : ', node.value ,' = ', node.right, ') \n', ...prepareBody(node.body)]);
            break;
        //ReferenceExpression
        case 'ReturnStatement':
            content +=  _prettyPrint(indent, ['return ', node.argument]);
            break;
        case 'ScopedStatement':
            content +=   _prettyPrint(indent, ['{\n', prettyPrint(prepareList(node.body, false),2)+'\n', '}\n']);
            break;
        case 'Sequence':
            content +=  _prettyPrint(indent, ['(', prepareList(node.expressions, true),')']);
            break;
        case 'SliceExpression':
            content +=  _prettyPrint(indent,[node.element, '[', node.start, ':', node.end,  node.step ? ':' + prettyPrint(node.step) : '']);
            break;
        case 'SpreadElement':
            content +=  _prettyPrint(indent,  ['with(', node.argument, ')']);
            break;
        case 'SuperExpression':
            content +=  _prettyPrint(indent,'super');
            break;
        case 'SwitchStatement': {
            let caseContent = '';
            const cases = node.cases;
            cases.forEach(c => {
                caseContent += prettyPrint(c, 2) + '\n';
            });
            content +=  _prettyPrint(indent, ['switch (', node.discriminant, ') {\n', caseContent, '}\n']);
            break;
        }
        case 'ThisExpression':
            content +=  _prettyPrint(indent,'this');
            break;
        case 'ThrowStatement':
            content +=  _prettyPrint(indent, `throw ${prettyPrint(node.argument)}}`);
            break;
        case `TryStatement`: {
            let res = _prettyPrint(indent, ['try \n', ...prepareBody(node.body)]);
            if (node.handlers){
                node.handlers.forEach(h=>{
                    res += prettyPrint(h) + '\n';
                })
            }
            if (node.finalizer) {
                res += _prettyPrint(indent, [`finally \n`, ...prepareBody(node.finalizer)]);
            }
            content +=  res;
            break;
        }
        case 'TupleExpression':
            content +=  _prettyPrint(indent,  ['(',prepareList(node.elements,true),')']);
            break;
        case 'UnaryExpression': {
            if (node.operator === 'typeof'){
                content +=  _prettyPrint(indent, `typeof ${prettyPrint(node.argument)}`);
                break;
            }
            if (!node.isSuffix) {
                content +=   _prettyPrint(indent,node.operator + prettyPrint(node.argument));
                break;
            } else {
                content +=   _prettyPrint(indent, prettyPrint(node.argument) + node.operator);
                break;
            }
        }
        case 'VariableDeclaration':
            content +=  _prettyPrint(indent, ['var ', node.id, node.init?` = ${prettyPrint(node.init)}`: '']);
            break;
        case 'WhileStatement': {
            if (node.isPostTest) {
                content +=  _prettyPrint(indent, ['do\n', ...prepareBody(node.body), 'while(', node.test, ')\n']);
                break;
            } else {
                content +=  _prettyPrint(indent, ['while(', node.test, ')\n', ...prepareBody(node.body)]);
                break;
            }
        }
        case 'YieldExpression': {
            content +=  _prettyPrint(indent, `yield ${prettyPrint(node.argument)}`);
            break;
        }
        case 'ScopedStatement:begin':
        case 'ScopedStatement:end': {
            content +=  _prettyPrint(indent, '');
            break;
        }
    }
    return content;
}

export default  function prettyPrint(node, indent?){
    return _prettyPrint(indent||0, node, {}).replace(/(\n){2,}/g, '\n');
}
