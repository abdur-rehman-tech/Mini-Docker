"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _createTester = _interopRequireDefault(require("./internal/createTester.js"));
var _eachOfLimit = _interopRequireDefault(require("./internal/eachOfLimit.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
 *
 * @name detectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findSeries
 * @category Collections
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee must complete with a boolean value as its result.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 * @returns {Promise} a promise, if a callback is omitted
 */
function detectSeries(coll, iteratee, callback) {
  return (0, _createTester.default)(bool => bool, (res, item) => item)((0, _eachOfLimit.default)(1), coll, iteratee, callback);
}
var _default = (0, _awaitify.default)(detectSeries, 3);
exports.default = _default;
module.exports = exports.default;