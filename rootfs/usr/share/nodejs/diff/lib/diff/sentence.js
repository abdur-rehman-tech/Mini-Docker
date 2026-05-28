/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffSentences = diffSentences;
exports.sentenceDiff = void 0;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*istanbul ignore end*/
var sentenceDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();
/*istanbul ignore start*/
exports.sentenceDiff = sentenceDiff;
/*istanbul ignore end*/
sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};
function diffSentences(oldStr, newStr, callback) {
  return sentenceDiff.diff(oldStr, newStr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzZW50ZW5jZURpZmYiLCJEaWZmIiwidG9rZW5pemUiLCJ2YWx1ZSIsInNwbGl0IiwiZGlmZlNlbnRlbmNlcyIsIm9sZFN0ciIsIm5ld1N0ciIsImNhbGxiYWNrIiwiZGlmZiJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL3NlbnRlbmNlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEaWZmIGZyb20gJy4vYmFzZSc7XG5cblxuZXhwb3J0IGNvbnN0IHNlbnRlbmNlRGlmZiA9IG5ldyBEaWZmKCk7XG5zZW50ZW5jZURpZmYudG9rZW5pemUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuc3BsaXQoLyhcXFMuKz9bLiE/XSkoPz1cXHMrfCQpLyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZlNlbnRlbmNlcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHsgcmV0dXJuIHNlbnRlbmNlRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7IH1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUEwQjtBQUFBO0FBR25CLElBQU1BLFlBQVksR0FBRztBQUFJQztBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQSxDQUFJLEVBQUU7QUFBQztBQUFBO0FBQUE7QUFDdkNELFlBQVksQ0FBQ0UsUUFBUSxHQUFHLFVBQVNDLEtBQUssRUFBRTtFQUN0QyxPQUFPQSxLQUFLLENBQUNDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQztBQUM3QyxDQUFDO0FBRU0sU0FBU0MsYUFBYSxDQUFDQyxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFO0VBQUUsT0FBT1IsWUFBWSxDQUFDUyxJQUFJLENBQUNILE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxRQUFRLENBQUM7QUFBRSJ9