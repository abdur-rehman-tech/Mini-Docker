/// <reference types="node" />
/// <reference types="node" />
import type { Format } from './format';
export interface Style {
    fn: (fn: Function, cls: string) => string;
    setEmpty: (cls: string) => string;
    setHead: (cls: string) => string;
    setTail: (indent: string) => string;
    setEntrySep: () => string;
    mapEmpty: (cls: string) => string;
    mapHead: (cls: string) => string;
    mapTail: (indent: string) => string;
    mapKeyStart: () => string;
    mapKeyValSep: () => string;
    mapEntrySep: () => string;
    circular: (node: Format) => string;
    nodeId: (id: number) => string;
    errorEmpty: (er: Error, cls: string) => string;
    errorHead: (er: (Error | {
        name?: string;
        message?: string;
    }) & {
        generatedMessage?: string;
    }, cls: string) => string;
    errorTail: (indent: string) => string;
    pojoEmpty: (cls: string) => string;
    pojoHead: (cls: string) => string;
    pojoTail: (indent: string) => string;
    pojoKeyValSep: () => string;
    pojoEntrySep: () => string;
    arrayEmpty: (cls: string) => string;
    arrayHead: (cls: string) => string;
    arrayTail: (indent: string) => string;
    arrayEntrySep: () => string;
    bufferChunkSize: number;
    bufferEmpty: () => string;
    bufferStart: () => string;
    bufferBody: (buf: Buffer) => string;
    bufferEnd: (buf: Buffer) => string;
    bufferHead: () => string;
    bufferKey: (i: number) => string;
    bufferLine: (buf: Buffer, chunkSize: number) => string;
    bufferLineSep: () => string;
    bufferTail: (indent: string) => string;
    bufferKeySep: () => string;
    stringEmpty: () => string;
    stringOneLine: (str: string) => string;
    stringHead: () => string;
    stringLineSep: () => string;
    stringLine: (str: string) => string;
    stringTail: (indent: string) => string;
    diffable: boolean;
    start: (indent: string, key: string, sep: string) => string;
}
export declare const styles: {
    [style: string]: Style;
};
