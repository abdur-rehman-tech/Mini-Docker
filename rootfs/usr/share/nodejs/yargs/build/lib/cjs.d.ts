/// <reference types="node" />
import { applyExtends } from './utils/apply-extends';
import { argsert } from './argsert.js';
import { isPromise } from './utils/is-promise.js';
import { objFilter } from './utils/obj-filter.js';
import { globalMiddlewareFactory } from './middleware.js';
import { parseCommand } from './parse-command.js';
import * as processArgv from './utils/process-argv.js';
import { YError } from './yerror.js';
declare const _default: {
    applyExtends: typeof applyExtends;
    cjsPlatformShim: {
        assert: {
            notStrictEqual: typeof import("assert").notStrictEqual;
            strictEqual: typeof import("assert").strictEqual;
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
    Yargs: (processArgs?: string | string[], cwd?: string, parentRequire?: import("./typings/common-types").RequireType | undefined) => import("./yargs-factory.js").YargsInstance;
    argsert: typeof argsert;
    globalMiddlewareFactory: typeof globalMiddlewareFactory;
    isPromise: typeof isPromise;
    objFilter: typeof objFilter;
    parseCommand: typeof parseCommand;
    Parser: any;
    processArgv: typeof processArgv;
    rebase: import("./yargs-factory.js").RebaseFunction;
    YError: typeof YError;
};
export default _default;
