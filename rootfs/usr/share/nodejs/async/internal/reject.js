"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reject;
var _filter = _interopRequireDefault(require("./filter.js"));
var _wrapAsync = _interopRequireDefault(require("./wrapAsync.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function reject(eachfn, arr, _iteratee, callback) {
  const iteratee = (0, _wrapAsync.default)(_iteratee);
  return (0, _filter.default)(eachfn, arr, (value, cb) => {
    iteratee(value, (err, v) => {
      cb(err, !v);
    });
  }, callback);
}
module.exports = exports.default;