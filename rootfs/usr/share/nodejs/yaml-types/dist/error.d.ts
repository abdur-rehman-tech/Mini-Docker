import { CollectionTag } from 'yaml';
/**
 * `!error` Error object values
 *
 * An object collection of all enumerable properties on the Error object,
 * along with stack, message, and name (which are typically non-enumerable).
 *
 * If the Error has a `Symbol.for('util.inspect.custom')` or `toJSON` method,
 * then this will be called to get the object properties.
 *
 * When parsing, though the `stack` string is maintained, the internal call
 * site information will of course not be preserved faithfully.
 */
export declare const error: CollectionTag;
