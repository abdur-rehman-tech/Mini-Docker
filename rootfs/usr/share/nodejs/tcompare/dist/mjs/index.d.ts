import { FormatOptions } from './format';
export interface Result {
    diff: string;
    match: boolean;
}
export declare const format: (obj: any, options?: FormatOptions) => string;
export declare const same: (obj: any, pattern: any, options?: FormatOptions) => Result;
export declare const strict: (obj: any, pattern: any, options?: FormatOptions) => Result;
export declare const has: (obj: any, pattern: any, options?: FormatOptions) => Result;
export declare const hasStrict: (obj: any, pattern: any, options?: FormatOptions) => Result;
export declare const match: (obj: any, pattern: any, options?: FormatOptions) => Result;
export declare const matchOnly: (obj: any, pattern: any, options?: FormatOptions) => Result;
export declare const matchStrict: (obj: any, pattern: any, options?: FormatOptions) => Result;
export { Format } from './format';
export type { FormatOptions } from './format';
export { Has } from './has';
export { HasStrict } from './has-strict';
export { Match } from './match';
export { MatchOnly } from './match-only';
export { MatchStrict } from './match-strict';
export { Same } from './same';
export type { SameOptions } from './same';
export { Strict } from './strict';
export { styles } from './styles';
export type { Style } from './styles';
