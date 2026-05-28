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
 * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
 *
 * @name everyLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allLimit
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collection in parallel.
 * The iteratee must complete with a boolean result value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 * @returns {Promise} a promise, if no callback provided
 */
function everyLimit(coll, limit, iteratee, callback) {
  return (0, _createTester.default)(bool => !bool, res => !res)((0, _eachOfLimit.default)(limit), coll, iteratee, callback);
}
var _default = (0, _awaitify.default)(everyLimit, 4);
exports.default = _default;
module.exports = exports.default;