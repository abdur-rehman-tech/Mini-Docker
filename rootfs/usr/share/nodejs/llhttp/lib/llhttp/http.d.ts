import { type LLParse, source } from 'llparse';
import Node = source.node.Node;
export interface IHTTPResult {
    readonly entry: Node;
}
export declare class HTTP {
    private readonly llparse;
    private readonly url;
    private readonly TOKEN;
    private readonly span;
    private readonly callback;
    private readonly nodes;
    constructor(llparse: LLParse);
    build(): IHTTPResult;
    private buildLine;
    private buildHeaders;
    private buildHeaderField;
    private buildHeaderValue;
    private headersCompleted;
    private node;
    private load;
    private store;
    private update;
    private resetHeaderState;
    private emptySpan;
    private unsetFlag;
    private setFlag;
    private testFlags;
    private testLenientFlags;
    private setHeaderFlags;
    private mulAdd;
    private isEqual;
    private pause;
    private invokePausable;
}
