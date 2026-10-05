# uast4rust

`uast4rust` is the Rust parser binary for YASA-UAST.

## Build

```bash
cargo build --release
```

## Usage

Single-file mode:

```bash
./target/release/uast4rust -rootDir /path/to/file.rs -output /path/to/output.json -single
```

Project mode:

```bash
./target/release/uast4rust -rootDir /path/to/project -output /path/to/output.json
```

## Output Contract

Top-level JSON fields:

- `packageInfo`
- `moduleName`
- `cargoTomlPath`
- `numOfCargoToml`

`CompileUnit.language` is always `"rust"` for this parser.

## Coverage (Current)

Single-file lowering includes:

- function and struct definitions
- variable declarations and assignments (including compound assignments)
- call/member expressions
- control flow: `if`, `match`, `for`, `while`, `loop`, `break`, `continue`, `return`

Project mode includes:

- recursive Cargo manifest discovery
- stable package tree output (`packageInfo.subs`)
- hidden directory skipping during discovery

## Limitations

This parser currently focuses on parser-first coverage. Some Rust constructs are intentionally not lowered yet (for example macro-heavy forms and advanced type/trait semantics).

## Validate

```bash
cargo fmt -- --check
cargo test
```
