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
 * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
 *
 * @name someSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anySeries
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collections in series.
 * The iteratee should complete with a boolean `result` value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 * @returns {Promise} a promise, if no callback provided
 */
function someSeries(coll, iteratee, callback) {
  return (0, _createTester.default)(Boolean, res => res)(_eachOfSeries.default, coll, iteratee, callback);
}
var _default = (0, _awaitify.default)(someSeries, 3);
exports.default = _default;
module.exports = exports.default;