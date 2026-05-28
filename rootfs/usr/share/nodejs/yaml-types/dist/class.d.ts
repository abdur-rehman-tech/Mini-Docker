import { Scalar, ScalarTag } from 'yaml';
declare const options: {
    defaultType: Scalar.Type;
};
/**
 * `!class` A YAML representation of JavaScript classes
 *
 * Stringified as a block literal string, prefixed with the class name.
 *
 * When parsing, a no-op class with matching name and toString() is
 * returned. It is not possible to construct an actual JavaScript class by
 * evaluating YAML, and it is unsafe to attempt.
 */
export declare const classTag: ScalarTag & {
    options: typeof options;
};
export {};
