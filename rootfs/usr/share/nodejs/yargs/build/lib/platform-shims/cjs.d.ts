/// <reference types="node" />
import { notStrictEqual, strictEqual } from 'assert';
import * as processArgv from '../utils/process-argv.js';
declare const _default: {
    assert: {
        notStrictEqual: typeof notStrictEqual;
        strictEqual: typeof strictEqual;
    };
    cliui: any;
    findUp: any;
    getEnv: (key: string) => string | undefined;
    getCallerFile: any;
    getProcessArgvBin: typeof processArgv.getProcessArgvBin;
    inspect: any;
    mainFilename: string;
    Parser: any;
    path: any;
    process: {
        argv: () => string[];
        cwd: () => string;
        execPath: () => string;
        exit: (code: number) => never;
        nextTick: (callback: Function, ...args: any[]) => void;
        stdColumns: number | null;
    };
    readFileSync: any;
    require: any;
    requireDirectory: any;
    stringWidth: any;
    y18n: any;
};
export default _default;
