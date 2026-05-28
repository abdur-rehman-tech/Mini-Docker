import * as frontend from 'llparse-frontend';
import { Node } from './base';
export declare class TableLookup extends Node<frontend.node.TableLookup> {
    doBuild(out: string[]): void;
    private canVectorize;
    private buildRanges;
    private buildSSE;
    private buildNeon;
    private buildWASM;
    private buildTable;
}
