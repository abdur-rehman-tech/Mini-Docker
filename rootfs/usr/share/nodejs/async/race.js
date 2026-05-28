"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _once = _interopRequireDefault(require("./internal/once.js"));
var _wrapAsync = _interopRequireDefault(require("./internal/wrapAsync.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Runs the `tasks` array of functions in parallel, without waiting until the
 * previous function has completed. Once any of the `tasks` complete or pass an
 * error to its callback, the main `callback` is immediately called. It's
 * equivalent to `Promise.race()`.
 *
 * @name race
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array containing [async functions]{@link AsyncFunction}
 * to run. Each function can complete with an optional `result` value.
 * @param {Function} callback - A callback to run once any of the functions have
 * completed. This function gets an error or result from the first function that
 * completed. Invoked with (err, result).
 * @returns {Promise} a promise, if a callback is omitted
 * @example
 *
 * async.race([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // main callback
 * function(err, result) {
 *     // the result will be equal to 'two' as it finishes earlier
 * });
 */
function race(tasks, callback) {
  callback = (0, _once.default)(callback);
  if (!Array.isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
  if (!tasks.length) return callback();
  for (var i = 0, l = tasks.length; i < l; i++) {
    (0, _wrapAsync.default)(tasks[i])(callback);
  }
}
var _default = (0, _awaitify.default)(race, 2);
exports.default = _default;
module.exports = exports.default;