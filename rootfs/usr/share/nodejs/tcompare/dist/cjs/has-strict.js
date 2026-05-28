"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasStrict = void 0;
const has_1 = require("./has");
const strict_1 = require("./strict");
class HasStrict extends has_1.Has {
    test() {
        const a = this.object;
        const b = this.expect;
        // constructor match is relevant to Strict, but HasStrict should
        // not do that, it's inconvenient, since it means you can't do
        // hasStrict(new URL('https://x.com/y'), { pathname: '/y' })
        // So, for objects, we call Same.  Everything else, call Strict.
        if (a &&
            b &&
            typeof a === 'object' &&
            typeof b === 'object' &&
            Array.isArray(a) === Array.isArray(b)) {
            return super.test();
        }
        else {
            return strict_1.Strict.prototype.test.call(this);
        }
    }
}
exports.HasStrict = HasStrict;
//# sourceMappingURL=has-strict.js.map