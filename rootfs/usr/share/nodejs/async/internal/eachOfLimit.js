"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _once = _interopRequireDefault(require("./once.js"));
var _iterator = _interopRequireDefault(require("./iterator.js"));
var _onlyOnce = _interopRequireDefault(require("./onlyOnce.js"));
var _wrapAsync = require("./wrapAsync.js");
var _asyncEachOfLimit = _interopRequireDefault(require("./asyncEachOfLimit.js"));
var _breakLoop = _interopRequireDefault(require("./breakLoop.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = limit => {
  return (obj, iteratee, callback) => {
    callback = (0, _once.default)(callback);
    if (limit <= 0) {
      throw new RangeError('concurrency limit cannot be less than 1');
    }
    if (!obj) {
      return callback(null);
    }
    if ((0, _wrapAsync.isAsyncGenerator)(obj)) {
      return (0, _asyncEachOfLimit.default)(obj, limit, iteratee, callback);
    }
    if ((0, _wrapAsync.isAsyncIterable)(obj)) {
      return (0, _asyncEachOfLimit.default)(obj[Symbol.asyncIterator](), limit, iteratee, callback);
    }
    var nextElem = (0, _iterator.default)(obj);
    var done = false;
    var canceled = false;
    var running = 0;
    var looping = false;
    function iterateeCallback(err, value) {
      if (canceled) return;
      running -= 1;
      if (err) {
        done = true;
        callback(err);
      } else if (err === false) {
        done = true;
        canceled = true;
      } else if (value === _breakLoop.default || done && running <= 0) {
        done = true;
        return callback(null);
      } else if (!looping) {
        replenish();
      }
    }
    function replenish() {
      looping = true;
      while (running < limit && !done) {
        var elem = nextElem();
        if (elem === null) {
          done = true;
          if (running <= 0) {
            callback(null);
          }
          return;
        }
        running += 1;
        iteratee(elem.value, elem.key, (0, _onlyOnce.default)(iterateeCallback));
      }
      looping = false;
    }
    replenish();
  };
};
exports.default = _default;
module.exports = exports.default;