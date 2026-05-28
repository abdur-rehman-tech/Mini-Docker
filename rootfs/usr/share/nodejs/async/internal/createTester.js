"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _createTester;
var _breakLoop = _interopRequireDefault(require("./breakLoop.js"));
var _wrapAsync = _interopRequireDefault(require("./wrapAsync.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _createTester(check, getResult) {
  return (eachfn, arr, _iteratee, cb) => {
    var testPassed = false;
    var testResult;
    const iteratee = (0, _wrapAsync.default)(_iteratee);
    eachfn(arr, (value, _, callback) => {
      iteratee(value, (err, result) => {
        if (err || err === false) return callback(err);
        if (check(result) && !testResult) {
          testPassed = true;
          testResult = getResult(true, value);
          return callback(null, _breakLoop.default);
        }
        callback();
      });
    }, err => {
      if (err) return cb(err);
      cb(null, testPassed ? testResult : getResult(false));
    });
  };
}
module.exports = exports.default;