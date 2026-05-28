"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createIterator;
var _isArrayLike = _interopRequireDefault(require("./isArrayLike.js"));
var _getIterator = _interopRequireDefault(require("./getIterator.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function createArrayIterator(coll) {
  var i = -1;
  var len = coll.length;
  return function next() {
    return ++i < len ? {
      value: coll[i],
      key: i
    } : null;
  };
}
function createES2015Iterator(iterator) {
  var i = -1;
  return function next() {
    var item = iterator.next();
    if (item.done) return null;
    i++;
    return {
      value: item.value,
      key: i
    };
  };
}
function createObjectIterator(obj) {
  var okeys = obj ? Object.keys(obj) : [];
  var i = -1;
  var len = okeys.length;
  return function next() {
    var key = okeys[++i];
    if (key === '__proto__') {
      return next();
    }
    return i < len ? {
      value: obj[key],
      key
    } : null;
  };
}
function createIterator(coll) {
  if ((0, _isArrayLike.default)(coll)) {
    return createArrayIterator(coll);
  }
  var iterator = (0, _getIterator.default)(coll);
  return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
module.exports = exports.default;