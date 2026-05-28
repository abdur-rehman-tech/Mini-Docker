"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eachOfLimit = _interopRequireDefault(require("./internal/eachOfLimit.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
var _once = _interopRequireDefault(require("./internal/once.js"));
var _wrapAsync = _interopRequireDefault(require("./internal/wrapAsync.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name mapValuesLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - A function to apply to each value and key
 * in `coll`.
 * The iteratee should complete with the transformed value as its result.
 * Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 * @returns {Promise} a promise, if no callback is passed
 */
function mapValuesLimit(obj, limit, iteratee, callback) {
  callback = (0, _once.default)(callback);
  var newObj = {};
  var _iteratee = (0, _wrapAsync.default)(iteratee);
  return (0, _eachOfLimit.default)(limit)(obj, (val, key, next) => {
    _iteratee(val, key, (err, result) => {
      if (err) return next(err);
      newObj[key] = result;
      next(err);
    });
  }, err => callback(err, newObj));
}
var _default = (0, _awaitify.default)(mapValuesLimit, 4);
exports.default = _default;
module.exports = exports.default;