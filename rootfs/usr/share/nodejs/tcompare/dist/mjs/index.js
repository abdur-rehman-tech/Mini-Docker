import { Format } from './format';
import { Has } from './has';
import { HasStrict } from './has-strict';
import { Match } from './match';
import { MatchOnly } from './match-only';
import { MatchStrict } from './match-strict';
import { Same } from './same';
import { Strict } from './strict';
const simple = (o) => ({
    diff: o.print(),
    match: o.match,
});
const fn = (Cls) => (obj, pattern, options = {}) => simple(new Cls(obj, {
    ...options,
    expect: pattern,
    parent: undefined,
}));
export const format = (obj, options = {}) => new Format(obj, options).print();
export const same = fn(Same);
export const strict = fn(Strict);
export const has = fn(Has);
export const hasStrict = fn(HasStrict);
export const match = fn(Match);
export const matchOnly = fn(MatchOnly);
export const matchStrict = fn(MatchStrict);
export { Format } from './format';
export { Has } from './has';
export { HasStrict } from './has-strict';
export { Match } from './match';
export { MatchOnly } from './match-only';
export { MatchStrict } from './match-strict';
export { Same } from './same';
export { Strict } from './strict';
export { styles } from './styles';
//# sourceMappingURL=index.js.map