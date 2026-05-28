import * as frontend from 'llparse-frontend';
import { Compilation } from '../compilation';
export interface INodeEdge {
    readonly node: frontend.IWrap<frontend.node.Node>;
    readonly noAdvance: boolean;
    readonly value?: number;
}
export declare abstract class Node<T extends frontend.node.Node> {
    readonly ref: T;
    cachedDecl: string | undefined;
    privCompilation: Compilation | undefined;
    constructor(ref: T);
    build(compilation: Compilation): string;
    get compilation(): Compilation;
    prologue(out: string[]): void;
    pause(out: string[]): void;
    tailTo(out: string[], edge: INodeEdge): void;
    protected abstract doBuild(out: string[]): void;
}
