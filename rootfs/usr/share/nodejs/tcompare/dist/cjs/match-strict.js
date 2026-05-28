"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchStrict = void 0;
// this is a weird one.  Basically, it is identical to Match,
// EXCEPT in the case of two simple types.  If the object == expect,
// but the object does not === expect, then it returns false.
const match_1 = require("./match");
class MatchStrict extends match_1.Match {
    test() {
        // equal on type coercion, but not equal strictly.
        if (this.expect == this.object &&
            this.expect !== this.object) {
            return false;
        }
        return super.test();
    }
}
exports.MatchStrict = MatchStrict;
//# sourceMappingURL=match-strict.js.map