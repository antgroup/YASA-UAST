# Requests parser regression fixture

The 19 Python files in `src/requests` are the unchanged production package from
[psf/requests](https://github.com/psf/requests), commit
`611c6162cbc4ac2020a2f91c7cfa4f3abf9bbb60`. The original `LICENSE` and `NOTICE`
accompany the source. The source archive SHA-256 is
`83a67e83356762c4dfac7e75387826178fbf1041e2d2cd57259f4a5593474aa3`.

The gzip-compressed JSON files under `expected/tree-sitter` capture the
Tree-sitter parser's UAST, using the filename as the `sourcefile`. The test
compares each complete UAST with its snapshot to detect changes; the snapshots
do not establish semantic correctness or parity with the legacy parser. Review
any change before updating them. The fixture's `.gitattributes` preserves LF
line endings, so the source bytes and locations are stable on Windows.

Run `npm test` in `parser-Python`; this builds the package and runs the project
regression. The Python section of the repository's `test.sh` also runs it.
