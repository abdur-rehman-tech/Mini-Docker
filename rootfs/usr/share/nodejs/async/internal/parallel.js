"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _isArrayLike = _interopRequireDefault(require("./isArrayLike.js"));
var _wrapAsync = _interopRequireDefault(require("./wrapAsync.js"));
var _awaitify = _interopRequireDefault(require("./awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = (0, _awaitify.default)((eachfn, tasks, callback) => {
  var results = (0, _isArrayLike.default)(tasks) ? [] : {};
  eachfn(tasks, (task, key, taskCb) => {
    (0, _wrapAsync.default)(task)((err, ...result) => {
      if (result.length < 2) {
        [result] = result;
      }
      results[key] = result;
      taskCb(err);
    });
  }, err => callback(err, results));
}, 3);
exports.default = _default;
module.exports = exports.default;