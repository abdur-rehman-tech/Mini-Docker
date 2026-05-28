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
 * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name detectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findLimit
 * @category Collections
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
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
function detectLimit(coll, limit, iteratee, callback) {
  return (0, _createTester.default)(bool => bool, (res, item) => item)((0, _eachOfLimit.default)(limit), coll, iteratee, callback);
}
var _default = (0, _awaitify.default)(detectLimit, 4);
exports.default = _default;
module.exports = exports.default;