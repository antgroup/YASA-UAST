import * as phpParser from './parser';
import * as UAST from '@ant-yasa/uast-spec';

export { version } from '../package.json';

export class Parser {
    private opts: Record<string, any>;

    constructor(opts: Record<string, any> | null = null) {
        this.opts = opts || {};
    }

    parse(content: string, opts: Record<string, any> = {}): UAST.Node {
        return phpParser.parse(content, { ...this.opts, ...opts });
    }
}

export { phpParser };
