/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffLines = diffLines;
exports.diffTrimmedLines = diffTrimmedLines;
exports.lineDiff = void 0;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_params = require("../util/params")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*istanbul ignore end*/
var lineDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();
/*istanbul ignore start*/
exports.lineDiff = lineDiff;
/*istanbul ignore end*/
lineDiff.tokenize = function (value) {
  var retLines = [],
    linesAndNewlines = value.split(/(\n|\r\n)/);

  // Ignore the final empty token that occurs if the string ends with a new line
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  }

  // Merge the content and line separators into single tokens
  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];
    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }
      retLines.push(line);
    }
  }
  return retLines;
};
function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}
function diffTrimmedLines(oldStr, newStr, callback) {
  var options =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/
  /*istanbul ignore start*/
  _params
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  generateOptions)
  /*istanbul ignore end*/
  (callback, {
    ignoreWhitespace: true
  });
  return lineDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJsaW5lRGlmZiIsIkRpZmYiLCJ0b2tlbml6ZSIsInZhbHVlIiwicmV0TGluZXMiLCJsaW5lc0FuZE5ld2xpbmVzIiwic3BsaXQiLCJsZW5ndGgiLCJwb3AiLCJpIiwibGluZSIsIm9wdGlvbnMiLCJuZXdsaW5lSXNUb2tlbiIsImlnbm9yZVdoaXRlc3BhY2UiLCJ0cmltIiwicHVzaCIsImRpZmZMaW5lcyIsIm9sZFN0ciIsIm5ld1N0ciIsImNhbGxiYWNrIiwiZGlmZiIsImRpZmZUcmltbWVkTGluZXMiLCJnZW5lcmF0ZU9wdGlvbnMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvZGlmZi9saW5lLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEaWZmIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge2dlbmVyYXRlT3B0aW9uc30gZnJvbSAnLi4vdXRpbC9wYXJhbXMnO1xuXG5leHBvcnQgY29uc3QgbGluZURpZmYgPSBuZXcgRGlmZigpO1xubGluZURpZmYudG9rZW5pemUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICBsZXQgcmV0TGluZXMgPSBbXSxcbiAgICAgIGxpbmVzQW5kTmV3bGluZXMgPSB2YWx1ZS5zcGxpdCgvKFxcbnxcXHJcXG4pLyk7XG5cbiAgLy8gSWdub3JlIHRoZSBmaW5hbCBlbXB0eSB0b2tlbiB0aGF0IG9jY3VycyBpZiB0aGUgc3RyaW5nIGVuZHMgd2l0aCBhIG5ldyBsaW5lXG4gIGlmICghbGluZXNBbmROZXdsaW5lc1tsaW5lc0FuZE5ld2xpbmVzLmxlbmd0aCAtIDFdKSB7XG4gICAgbGluZXNBbmROZXdsaW5lcy5wb3AoKTtcbiAgfVxuXG4gIC8vIE1lcmdlIHRoZSBjb250ZW50IGFuZCBsaW5lIHNlcGFyYXRvcnMgaW50byBzaW5nbGUgdG9rZW5zXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXNBbmROZXdsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBsaW5lID0gbGluZXNBbmROZXdsaW5lc1tpXTtcblxuICAgIGlmIChpICUgMiAmJiAhdGhpcy5vcHRpb25zLm5ld2xpbmVJc1Rva2VuKSB7XG4gICAgICByZXRMaW5lc1tyZXRMaW5lcy5sZW5ndGggLSAxXSArPSBsaW5lO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UpIHtcbiAgICAgICAgbGluZSA9IGxpbmUudHJpbSgpO1xuICAgICAgfVxuICAgICAgcmV0TGluZXMucHVzaChsaW5lKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0TGluZXM7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZkxpbmVzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykgeyByZXR1cm4gbGluZURpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spOyB9XG5leHBvcnQgZnVuY3Rpb24gZGlmZlRyaW1tZWRMaW5lcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHtcbiAgbGV0IG9wdGlvbnMgPSBnZW5lcmF0ZU9wdGlvbnMoY2FsbGJhY2ssIHtpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gIHJldHVybiBsaW5lRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQStDO0FBQUE7QUFFeEMsSUFBTUEsUUFBUSxHQUFHO0FBQUlDO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBLENBQUksRUFBRTtBQUFDO0FBQUE7QUFBQTtBQUNuQ0QsUUFBUSxDQUFDRSxRQUFRLEdBQUcsVUFBU0MsS0FBSyxFQUFFO0VBQ2xDLElBQUlDLFFBQVEsR0FBRyxFQUFFO0lBQ2JDLGdCQUFnQixHQUFHRixLQUFLLENBQUNHLEtBQUssQ0FBQyxXQUFXLENBQUM7O0VBRS9DO0VBQ0EsSUFBSSxDQUFDRCxnQkFBZ0IsQ0FBQ0EsZ0JBQWdCLENBQUNFLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRTtJQUNsREYsZ0JBQWdCLENBQUNHLEdBQUcsRUFBRTtFQUN4Qjs7RUFFQTtFQUNBLEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHSixnQkFBZ0IsQ0FBQ0UsTUFBTSxFQUFFRSxDQUFDLEVBQUUsRUFBRTtJQUNoRCxJQUFJQyxJQUFJLEdBQUdMLGdCQUFnQixDQUFDSSxDQUFDLENBQUM7SUFFOUIsSUFBSUEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQ0UsT0FBTyxDQUFDQyxjQUFjLEVBQUU7TUFDekNSLFFBQVEsQ0FBQ0EsUUFBUSxDQUFDRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUlHLElBQUk7SUFDdkMsQ0FBQyxNQUFNO01BQ0wsSUFBSSxJQUFJLENBQUNDLE9BQU8sQ0FBQ0UsZ0JBQWdCLEVBQUU7UUFDakNILElBQUksR0FBR0EsSUFBSSxDQUFDSSxJQUFJLEVBQUU7TUFDcEI7TUFDQVYsUUFBUSxDQUFDVyxJQUFJLENBQUNMLElBQUksQ0FBQztJQUNyQjtFQUNGO0VBRUEsT0FBT04sUUFBUTtBQUNqQixDQUFDO0FBRU0sU0FBU1ksU0FBUyxDQUFDQyxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFO0VBQUUsT0FBT25CLFFBQVEsQ0FBQ29CLElBQUksQ0FBQ0gsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFFBQVEsQ0FBQztBQUFFO0FBQy9GLFNBQVNFLGdCQUFnQixDQUFDSixNQUFNLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFO0VBQ3pELElBQUlSLE9BQU87RUFBRztFQUFBO0VBQUE7RUFBQVc7RUFBQUE7RUFBQUE7RUFBQUE7RUFBQUE7RUFBQUEsZUFBZTtFQUFBO0VBQUEsQ0FBQ0gsUUFBUSxFQUFFO0lBQUNOLGdCQUFnQixFQUFFO0VBQUksQ0FBQyxDQUFDO0VBQ2pFLE9BQU9iLFFBQVEsQ0FBQ29CLElBQUksQ0FBQ0gsTUFBTSxFQUFFQyxNQUFNLEVBQUVQLE9BQU8sQ0FBQztBQUMvQyJ9