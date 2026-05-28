"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = doUntil;
var _doWhilst = _interopRequireDefault(require("./doWhilst.js"));
var _wrapAsync = _interopRequireDefault(require("./internal/wrapAsync.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
 * argument ordering differs from `until`.
 *
 * @name doUntil
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
 * @category Control Flow
 * @param {AsyncFunction} iteratee - An async function which is called each time
 * `test` fails. Invoked with (callback).
 * @param {AsyncFunction} test - asynchronous truth test to perform after each
 * execution of `iteratee`. Invoked with (...args, callback), where `...args` are the
 * non-error args from the previous callback of `iteratee`
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 * @returns {Promise} a promise, if no callback is passed
 */
function doUntil(iteratee, test, callback) {
  const _test = (0, _wrapAsync.default)(test);
  return (0, _doWhilst.default)(iteratee, (...args) => {
    const cb = args.pop();
    _test(...args, (err, truth) => cb(err, !truth));
  }, callback);
}
module.exports = exports.default;