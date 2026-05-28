"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eachOfLimit = _interopRequireDefault(require("./internal/eachOfLimit.js"));
var _withoutIndex = _interopRequireDefault(require("./internal/withoutIndex.js"));
var _wrapAsync = _interopRequireDefault(require("./internal/wrapAsync.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
 *
 * @name eachLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachLimit
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The array index is not passed to the iteratee.
 * If you need the index, use `eachOfLimit`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @returns {Promise} a promise, if a callback is omitted
 */
function eachLimit(coll, limit, iteratee, callback) {
  return (0, _eachOfLimit.default)(limit)(coll, (0, _withoutIndex.default)((0, _wrapAsync.default)(iteratee)), callback);
}
var _default = (0, _awaitify.default)(eachLimit, 4);
exports.default = _default;
module.exports = exports.default;