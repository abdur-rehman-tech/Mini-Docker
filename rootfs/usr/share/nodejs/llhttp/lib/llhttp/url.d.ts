import { type LLParse, source } from 'llparse';
import Node = source.node.Node;
export interface IURLResult {
    readonly entry: {
        readonly normal: Node;
        readonly connect: Node;
    };
    readonly exit: {
        readonly toHTTP: Node;
        readonly toHTTP09: Node;
    };
}
export declare class URL {
    private readonly llparse;
    private readonly spanTable;
    private readonly errorInvalid;
    private readonly URL_CHAR;
    constructor(llparse: LLParse, separateSpans?: boolean);
    build(): IURLResult;
    private spanStart;
    private spanEnd;
    private node;
}
