"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reject2 = _interopRequireDefault(require("./internal/reject.js"));
var _eachOfSeries = _interopRequireDefault(require("./eachOfSeries.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
 *
 * @name rejectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - An async truth test to apply to each item in
 * `coll`.
 * The should complete with a boolean value as its `result`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback is passed
 */
function rejectSeries(coll, iteratee, callback) {
  return (0, _reject2.default)(_eachOfSeries.default, coll, iteratee, callback);
}
var _default = (0, _awaitify.default)(rejectSeries, 3);
exports.default = _default;
module.exports = exports.default;