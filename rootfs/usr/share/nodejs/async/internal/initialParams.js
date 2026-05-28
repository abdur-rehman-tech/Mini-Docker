"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function _default(fn) {
  return function (...args /*, callback*/) {
    var callback = args.pop();
    return fn.call(this, args, callback);
  };
}
module.exports = exports.default;