"use strict";
// this uses the test method from match, but requires that *only*
// the specified fields in the pattern are present in the object.
//
// Note: it does still allow a field to be present in the object
// and not the pattern if the value is set to null or undefined.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchOnly = void 0;
const match_1 = require("./match");
const same_1 = require("./same");
class MatchOnly extends same_1.Same {
    test() {
        return match_1.Match.prototype.test.call(this);
    }
}
exports.MatchOnly = MatchOnly;
//# sourceMappingURL=match-only.js.map