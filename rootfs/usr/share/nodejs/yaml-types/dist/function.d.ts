import { Scalar, ScalarTag } from 'yaml';
declare const options: {
    defaultType: Scalar.Type;
};
/**
 * `!function` A YAML representation of JavaScript functions
 *
 * Stringified as a block literal string, prefixed with the function name.
 *
 * When parsing, a no-op function with matching name and toString() is
 * returned. It is not possible to construct an actual JavaScript function by
 * evaluating YAML, and it is unsafe to attempt.
 */
export declare const functionTag: ScalarTag & {
    options: typeof options;
};
export {};
