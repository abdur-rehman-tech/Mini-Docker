import { stringifyString } from 'yaml/util';
const identify = (value) => {
    return typeof value === 'bigint' || value instanceof BigInt;
};
/**
 * `!bigint` BigInt
 *
 * [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) values,
 * using their conventional `123n` representation.
 */
export const bigint = {
    identify,
    tag: '!bigint',
    resolve(str) {
        const match = str.match(/^([1-9][0-9]*|0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+)n?$/);
        if (!match)
            throw new Error('Invalid BigInt value');
        return BigInt(match[1]);
    },
    stringify(item, ctx, onComment, onChompKeep) {
        /* c8 ignore start */
        if (!identify(item.value)) {
            throw new TypeError(`${item.value} is not a bigint`);
        }
        /* c8 ignore stop */
        const value = item.value.toString() + 'n';
        return stringifyString({ value }, ctx, onComment, onChompKeep);
    }
};
//# sourceMappingURL=bigint.js.map