"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _once = _interopRequireDefault(require("./internal/once.js"));
var _onlyOnce = _interopRequireDefault(require("./internal/onlyOnce.js"));
var _wrapAsync = _interopRequireDefault(require("./internal/wrapAsync.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Runs the `tasks` array of functions in series, each passing their results to
 * the next in the array. However, if any of the `tasks` pass an error to their
 * own callback, the next function is not executed, and the main `callback` is
 * immediately called with the error.
 *
 * @name waterfall
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
 * to run.
 * Each function should complete with any number of `result` values.
 * The `result` values will be passed as arguments, in order, to the next task.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This will be passed the results of the last task's
 * callback. Invoked with (err, [results]).
 * @returns {Promise} a promise, if a callback is omitted
 * @example
 *
 * async.waterfall([
 *     function(callback) {
 *         callback(null, 'one', 'two');
 *     },
 *     function(arg1, arg2, callback) {
 *         // arg1 now equals 'one' and arg2 now equals 'two'
 *         callback(null, 'three');
 *     },
 *     function(arg1, callback) {
 *         // arg1 now equals 'three'
 *         callback(null, 'done');
 *     }
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 *
 * // Or, with named functions:
 * async.waterfall([
 *     myFirstFunction,
 *     mySecondFunction,
 *     myLastFunction,
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 * function myFirstFunction(callback) {
 *     callback(null, 'one', 'two');
 * }
 * function mySecondFunction(arg1, arg2, callback) {
 *     // arg1 now equals 'one' and arg2 now equals 'two'
 *     callback(null, 'three');
 * }
 * function myLastFunction(arg1, callback) {
 *     // arg1 now equals 'three'
 *     callback(null, 'done');
 * }
 */
function waterfall(tasks, callback) {
  callback = (0, _once.default)(callback);
  if (!Array.isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
  if (!tasks.length) return callback();
  var taskIndex = 0;
  function nextTask(args) {
    var task = (0, _wrapAsync.default)(tasks[taskIndex++]);
    task(...args, (0, _onlyOnce.default)(next));
  }
  function next(err, ...args) {
    if (err === false) return;
    if (err || taskIndex === tasks.length) {
      return callback(err, ...args);
    }
    nextTask(args);
  }
  nextTask([]);
}
var _default = (0, _awaitify.default)(waterfall);
exports.default = _default;
module.exports = exports.default;