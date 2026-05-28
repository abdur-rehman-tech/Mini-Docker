"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.isAsync = isAsync;
exports.isAsyncGenerator = isAsyncGenerator;
exports.isAsyncIterable = isAsyncIterable;
var _asyncify = _interopRequireDefault(require("../asyncify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isAsync(fn) {
  return fn[Symbol.toStringTag] === 'AsyncFunction';
}
function isAsyncGenerator(fn) {
  return fn[Symbol.toStringTag] === 'AsyncGenerator';
}
function isAsyncIterable(obj) {
  return typeof obj[Symbol.asyncIterator] === 'function';
}
function wrapAsync(asyncFn) {
  if (typeof asyncFn !== 'function') throw new Error('expected a function');
  return isAsync(asyncFn) ? (0, _asyncify.default)(asyncFn) : asyncFn;
}
var _default = wrapAsync;
exports.default = _default;