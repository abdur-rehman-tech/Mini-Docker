"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _filter2 = _interopRequireDefault(require("./internal/filter.js"));
var _eachOfSeries = _interopRequireDefault(require("./eachOfSeries.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
 *
 * @name filterSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectSeries
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results)
 * @returns {Promise} a promise, if no callback provided
 */
function filterSeries(coll, iteratee, callback) {
  return (0, _filter2.default)(_eachOfSeries.default, coll, iteratee, callback);
}
var _default = (0, _awaitify.default)(filterSeries, 3);
exports.default = _default;
module.exports = exports.default;