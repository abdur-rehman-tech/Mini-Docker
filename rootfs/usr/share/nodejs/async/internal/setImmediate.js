"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.fallback = fallback;
exports.hasSetImmediate = exports.hasQueueMicrotask = exports.hasNextTick = void 0;
exports.wrap = wrap;
/* istanbul ignore file */

var hasQueueMicrotask = typeof queueMicrotask === 'function' && queueMicrotask;
exports.hasQueueMicrotask = hasQueueMicrotask;
var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
exports.hasSetImmediate = hasSetImmediate;
var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';
exports.hasNextTick = hasNextTick;
function fallback(fn) {
  setTimeout(fn, 0);
}
function wrap(defer) {
  return (fn, ...args) => defer(() => fn(...args));
}
var _defer;
if (hasQueueMicrotask) {
  _defer = queueMicrotask;
} else if (hasSetImmediate) {
  _defer = setImmediate;
} else if (hasNextTick) {
  _defer = process.nextTick;
} else {
  _defer = fallback;
}
var _default = wrap(_defer);
exports.default = _default;