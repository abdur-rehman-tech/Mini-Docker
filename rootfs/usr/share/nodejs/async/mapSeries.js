"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _map2 = _interopRequireDefault(require("./internal/map.js"));
var _eachOfSeries = _interopRequireDefault(require("./eachOfSeries.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
 *
 * @name mapSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with the transformed item.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback is passed
 */
function mapSeries(coll, iteratee, callback) {
  return (0, _map2.default)(_eachOfSeries.default, coll, iteratee, callback);
}
var _default = (0, _awaitify.default)(mapSeries, 3);
exports.default = _default;
module.exports = exports.default;