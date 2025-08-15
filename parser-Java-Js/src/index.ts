import * as jsParser from './frontend/javascript/parser';
import * as javaParser from './frontend/java/parser';
import * as path from 'path';
// import * as UAST from '../uast-types/src/index';
import * as UAST from '@ant-yasa/uast-spec';

export { version } from '../package.json';

export enum LanguageType {
    LANG_JAVASCRIPT,
    LANG_JAVA,
    OTHER
}

export class Parser {
    private opts: Record<string, any>;
    private cachedParser: any;

    constructor(opts: Record<string, any> | null) {
        this.opts = opts || { language: LanguageType.LANG_JAVASCRIPT };
    }

    parse(content: string, opts: any): UAST.Node {
        const parser = this.prepareParser(content, opts);
        //TODO sanitize check return value
        return parser.parse(content, opts);
    }

    private prepareParser(content: string, opts: Record<string, any>) {
        let langType: LanguageType = opts?.language || this.opts?.language;
        const filename = opts?.filename || this.opts?.filename;
        if (!langType && filename) {
            // find through extname of file
            const ext = path.extname(filename);
            if (['js', 'ts', 'mjs', 'cjs'].indexOf(ext) !== -1) {
                langType = LanguageType.LANG_JAVASCRIPT;
            } else if ('java'.indexOf(ext) !== -1) {
                langType = LanguageType.LANG_JAVA;
            } else {// default
                langType = LanguageType.LANG_JAVASCRIPT;
            }
        }

        switch (langType) {
            case LanguageType.LANG_JAVASCRIPT:
                return jsParser;
            case LanguageType.LANG_JAVA:
                return javaParser;
            default:
                throw new Error(`Language type: ${langType} not supported`)
        }
    }
}
