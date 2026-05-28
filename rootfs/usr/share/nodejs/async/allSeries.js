"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _createTester = _interopRequireDefault(require("./internal/createTester.js"));
var _eachOfSeries = _interopRequireDefault(require("./eachOfSeries.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
 *
 * @name everySeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allSeries
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collection in series.
 * The iteratee must complete with a boolean result value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 * @returns {Promise} a promise, if no callback provided
 */
function everySeries(coll, iteratee, callback) {
  return (0, _createTester.default)(bool => !bool, res => !res)(_eachOfSeries.default, coll, iteratee, callback);
}
var _default = (0, _awaitify.default)(everySeries, 3);
exports.default = _default;
module.exports = exports.default;