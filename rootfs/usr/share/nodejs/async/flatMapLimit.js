"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _wrapAsync = _interopRequireDefault(require("./internal/wrapAsync.js"));
var _mapLimit = _interopRequireDefault(require("./mapLimit.js"));
var _awaitify = _interopRequireDefault(require("./internal/awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The same as [`concat`]{@link module:Collections.concat} but runs a maximum of `limit` async operations at a time.
 *
 * @name concatLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.concat]{@link module:Collections.concat}
 * @category Collection
 * @alias flatMapLimit
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
 * which should use an array as its result. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 * @returns A Promise, if no callback is passed
 */
function concatLimit(coll, limit, iteratee, callback) {
  var _iteratee = (0, _wrapAsync.default)(iteratee);
  return (0, _mapLimit.default)(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, ...args) => {
      if (err) return iterCb(err);
      return iterCb(err, args);
    });
  }, (err, mapResults) => {
    var result = [];
    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        result = result.concat(...mapResults[i]);
      }
    }
    return callback(err, result);
  });
}
var _default = (0, _awaitify.default)(concatLimit, 4);
exports.default = _default;
module.exports = exports.default;