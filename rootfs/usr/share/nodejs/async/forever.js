"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _onlyOnce = _interopRequireDefault(require("./internal/onlyOnce.js"));
var _ensureAsync = _interopRequireDefault(require("./ensureAsync.js"));
var _wrapAsync = _interopRequireDefault(require("./internal/wrapAsync.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Calls the asynchronous function `fn` with a callback parameter that allows it
 * to call itself again, in series, indefinitely.

 * If an error is passed to the callback then `errback` is called with the
 * error, and execution stops, otherwise it will never be called.
 *
 * @name forever
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {AsyncFunction} fn - an async function to call repeatedly.
 * Invoked with (next).
 * @param {Function} [errback] - when `fn` passes an error to it's callback,
 * this function will be called, and execution stops. Invoked with (err).
 * @returns {Promise} a promise that rejects if an error occurs and an errback
 * is not passed
 * @example
 *
 * async.forever(
 *     function(next) {
 *         // next is suitable for passing to things that need a callback(err [, whatever]);
 *         // it will result in this function being called again.
 *     },
 *     function(err) {
 *         // if next is called with a value in its first parameter, it will appear
 *         // in here as 'err', and execution will stop.
 *     }
 * );
 */
function forever(fn, errback) {
  var done = (0, _onlyOnce.default)(errback);
  var task = (0, _wrapAsync.default)((0, _ensureAsync.default)(fn));
  function next(err) {
    if (err) return done(err);
    if (err === false) return;
    task(next);
  }
  return next();
}
var _default = (0, _awaitify.default)(forever, 2);
exports.default = _default;
module.exports = exports.default;