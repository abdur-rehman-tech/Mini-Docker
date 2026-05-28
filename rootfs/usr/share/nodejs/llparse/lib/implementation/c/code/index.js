"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const and_1 = require("./and");
const external_1 = require("./external");
const is_equal_1 = require("./is-equal");
const load_1 = require("./load");
const mul_add_1 = require("./mul-add");
const or_1 = require("./or");
const store_1 = require("./store");
const test_1 = require("./test");
const update_1 = require("./update");
__exportStar(require("./base"), exports);
class Match extends external_1.External {
}
class Span extends external_1.External {
}
class Value extends external_1.External {
}
exports.default = {
    And: and_1.And,
    IsEqual: is_equal_1.IsEqual,
    Load: load_1.Load,
    Match,
    MulAdd: mul_add_1.MulAdd,
    Or: or_1.Or,
    Span,
    Store: store_1.Store,
    Test: test_1.Test,
    Update: update_1.Update,
    Value,
};
//# sourceMappingURL=index.js.map