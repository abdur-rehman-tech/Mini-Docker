/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayDiff = void 0;
exports.diffArrays = diffArrays;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*istanbul ignore end*/
var arrayDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();
/*istanbul ignore start*/
exports.arrayDiff = arrayDiff;
/*istanbul ignore end*/
arrayDiff.tokenize = function (value) {
  return value.slice();
};
arrayDiff.join = arrayDiff.removeEmpty = function (value) {
  return value;
};
function diffArrays(oldArr, newArr, callback) {
  return arrayDiff.diff(oldArr, newArr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhcnJheURpZmYiLCJEaWZmIiwidG9rZW5pemUiLCJ2YWx1ZSIsInNsaWNlIiwiam9pbiIsInJlbW92ZUVtcHR5IiwiZGlmZkFycmF5cyIsIm9sZEFyciIsIm5ld0FyciIsImNhbGxiYWNrIiwiZGlmZiJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2FycmF5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEaWZmIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBjb25zdCBhcnJheURpZmYgPSBuZXcgRGlmZigpO1xuYXJyYXlEaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnNsaWNlKCk7XG59O1xuYXJyYXlEaWZmLmpvaW4gPSBhcnJheURpZmYucmVtb3ZlRW1wdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZkFycmF5cyhvbGRBcnIsIG5ld0FyciwgY2FsbGJhY2spIHsgcmV0dXJuIGFycmF5RGlmZi5kaWZmKG9sZEFyciwgbmV3QXJyLCBjYWxsYmFjayk7IH1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUEwQjtBQUFBO0FBRW5CLElBQU1BLFNBQVMsR0FBRztBQUFJQztBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQSxDQUFJLEVBQUU7QUFBQztBQUFBO0FBQUE7QUFDcENELFNBQVMsQ0FBQ0UsUUFBUSxHQUFHLFVBQVNDLEtBQUssRUFBRTtFQUNuQyxPQUFPQSxLQUFLLENBQUNDLEtBQUssRUFBRTtBQUN0QixDQUFDO0FBQ0RKLFNBQVMsQ0FBQ0ssSUFBSSxHQUFHTCxTQUFTLENBQUNNLFdBQVcsR0FBRyxVQUFTSCxLQUFLLEVBQUU7RUFDdkQsT0FBT0EsS0FBSztBQUNkLENBQUM7QUFFTSxTQUFTSSxVQUFVLENBQUNDLE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxRQUFRLEVBQUU7RUFBRSxPQUFPVixTQUFTLENBQUNXLElBQUksQ0FBQ0gsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFFBQVEsQ0FBQztBQUFFIn0=