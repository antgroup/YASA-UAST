import * as pythonParser from './parser';
import type * as UAST from '@ant-yasa/uast-spec';

export const version: string = require('../package.json').version;
export { pythonParser };
export type { ParseOptions } from './parser';

/** Same lifecycle as the PHP parser: await init(), then synchronous parse(). */
export class Parser {
    constructor(private readonly opts: pythonParser.ParseOptions = {}) {}

    async init(): Promise<void> {
        await pythonParser.init();
    }

    parse(content: string, opts: pythonParser.ParseOptions = {}): UAST.Node {
        return pythonParser.parse(content, { ...this.opts, ...opts });
    }
}
