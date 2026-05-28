/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cssDiff = void 0;
exports.diffCss = diffCss;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*istanbul ignore end*/
var cssDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();
/*istanbul ignore start*/
exports.cssDiff = cssDiff;
/*istanbul ignore end*/
cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/);
};
function diffCss(oldStr, newStr, callback) {
  return cssDiff.diff(oldStr, newStr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjc3NEaWZmIiwiRGlmZiIsInRva2VuaXplIiwidmFsdWUiLCJzcGxpdCIsImRpZmZDc3MiLCJvbGRTdHIiLCJuZXdTdHIiLCJjYWxsYmFjayIsImRpZmYiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvZGlmZi9jc3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGNvbnN0IGNzc0RpZmYgPSBuZXcgRGlmZigpO1xuY3NzRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5zcGxpdCgvKFt7fTo7LF18XFxzKykvKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmQ3NzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykgeyByZXR1cm4gY3NzRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7IH1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUEwQjtBQUFBO0FBRW5CLElBQU1BLE9BQU8sR0FBRztBQUFJQztBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQSxDQUFJLEVBQUU7QUFBQztBQUFBO0FBQUE7QUFDbENELE9BQU8sQ0FBQ0UsUUFBUSxHQUFHLFVBQVNDLEtBQUssRUFBRTtFQUNqQyxPQUFPQSxLQUFLLENBQUNDLEtBQUssQ0FBQyxlQUFlLENBQUM7QUFDckMsQ0FBQztBQUVNLFNBQVNDLE9BQU8sQ0FBQ0MsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFFBQVEsRUFBRTtFQUFFLE9BQU9SLE9BQU8sQ0FBQ1MsSUFBSSxDQUFDSCxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxDQUFDO0FBQUUifQ==