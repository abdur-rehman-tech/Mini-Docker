"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _wrapAsync = _interopRequireDefault(require("./wrapAsync.js"));
var _awaitify = _interopRequireDefault(require("./awaitify.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default(eachfn) {
  return function applyEach(fns, ...callArgs) {
    const go = (0, _awaitify.default)(function (callback) {
      var that = this;
      return eachfn(fns, (fn, cb) => {
        (0, _wrapAsync.default)(fn).apply(that, callArgs.concat(cb));
      }, callback);
    });
    return go;
  };
}
module.exports = exports.default;