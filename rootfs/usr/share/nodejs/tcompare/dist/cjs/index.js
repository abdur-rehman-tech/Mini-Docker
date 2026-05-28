"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styles = exports.Strict = exports.Same = exports.MatchStrict = exports.MatchOnly = exports.Match = exports.HasStrict = exports.Has = exports.Format = exports.matchStrict = exports.matchOnly = exports.match = exports.hasStrict = exports.has = exports.strict = exports.same = exports.format = void 0;
const format_1 = require("./format");
const has_1 = require("./has");
const has_strict_1 = require("./has-strict");
const match_1 = require("./match");
const match_only_1 = require("./match-only");
const match_strict_1 = require("./match-strict");
const same_1 = require("./same");
const strict_1 = require("./strict");
const simple = (o) => ({
    diff: o.print(),
    match: o.match,
});
const fn = (Cls) => (obj, pattern, options = {}) => simple(new Cls(obj, {
    ...options,
    expect: pattern,
    parent: undefined,
}));
const format = (obj, options = {}) => new format_1.Format(obj, options).print();
exports.format = format;
exports.same = fn(same_1.Same);
exports.strict = fn(strict_1.Strict);
exports.has = fn(has_1.Has);
exports.hasStrict = fn(has_strict_1.HasStrict);
exports.match = fn(match_1.Match);
exports.matchOnly = fn(match_only_1.MatchOnly);
exports.matchStrict = fn(match_strict_1.MatchStrict);
var format_2 = require("./format");
Object.defineProperty(exports, "Format", { enumerable: true, get: function () { return format_2.Format; } });
var has_2 = require("./has");
Object.defineProperty(exports, "Has", { enumerable: true, get: function () { return has_2.Has; } });
var has_strict_2 = require("./has-strict");
Object.defineProperty(exports, "HasStrict", { enumerable: true, get: function () { return has_strict_2.HasStrict; } });
var match_2 = require("./match");
Object.defineProperty(exports, "Match", { enumerable: true, get: function () { return match_2.Match; } });
var match_only_2 = require("./match-only");
Object.defineProperty(exports, "MatchOnly", { enumerable: true, get: function () { return match_only_2.MatchOnly; } });
var match_strict_2 = require("./match-strict");
Object.defineProperty(exports, "MatchStrict", { enumerable: true, get: function () { return match_strict_2.MatchStrict; } });
var same_2 = require("./same");
Object.defineProperty(exports, "Same", { enumerable: true, get: function () { return same_2.Same; } });
var strict_2 = require("./strict");
Object.defineProperty(exports, "Strict", { enumerable: true, get: function () { return strict_2.Strict; } });
var styles_1 = require("./styles");
Object.defineProperty(exports, "styles", { enumerable: true, get: function () { return styles_1.styles; } });
//# sourceMappingURL=index.js.map