"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function _default(coll) {
  return coll[Symbol.iterator] && coll[Symbol.iterator]();
}
module.exports = exports.default;