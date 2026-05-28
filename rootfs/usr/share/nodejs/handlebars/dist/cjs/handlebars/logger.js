/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var
/*istanbul ignore next*/
_utils = require("./utils");

var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',
  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function
  /*istanbul ignore next*/
  lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap =
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _utils.
      /*istanbul ignore next*/
      indexOf)(logger.methodMap, level.toLowerCase());

      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },
  // Can be overridden in the host environment
  log: function
  /*istanbul ignore next*/
  log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      /*istanbul ignore next*/
      var _console;

      var method = logger.methodMap[level]; // eslint-disable-next-line no-console

      if (!console[method]) {
        method = 'log';
      }

      /*istanbul ignore next*/
      for (var _len = arguments.length, message = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      /*istanbul ignore next*/

      /*istanbul ignore next*/
      (_console = console)[method].apply(
      /*istanbul ignore next*/
      _console, message); // eslint-disable-line no-console

    }
  }
};

/*istanbul ignore next*/
var _default = logger;

/*istanbul ignore next*/
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2xvZ2dlci5qcyJdLCJuYW1lcyI6WyJsb2dnZXIiLCJtZXRob2RNYXAiLCJsZXZlbCIsImxvb2t1cExldmVsIiwibGV2ZWxNYXAiLCJpbmRleE9mIiwidG9Mb3dlckNhc2UiLCJwYXJzZUludCIsImxvZyIsImNvbnNvbGUiLCJtZXRob2QiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQUE7QUFBQTs7QUFFQSxJQUFJQSxNQUFNLEdBQUc7QUFDWEMsRUFBQUEsU0FBUyxFQUFFLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsTUFBbEIsRUFBMEIsT0FBMUIsQ0FEQTtBQUVYQyxFQUFBQSxLQUFLLEVBQUUsTUFGSTtBQUlYO0FBQ0FDLEVBQUFBLFdBQVcsRUFBRTtBQUFBO0FBQUEsY0FBU0QsS0FBVCxFQUFnQjtBQUMzQixRQUFJLE9BQU9BLEtBQVAsS0FBaUIsUUFBckIsRUFBK0I7QUFDN0IsVUFBSUUsUUFBUTtBQUFHO0FBQUE7QUFBQUM7QUFBQUE7QUFBQUE7QUFBQUEsZUFBUUwsTUFBTSxDQUFDQyxTQUFmLEVBQTBCQyxLQUFLLENBQUNJLFdBQU4sRUFBMUIsQ0FBZjs7QUFDQSxVQUFJRixRQUFRLElBQUksQ0FBaEIsRUFBbUI7QUFDakJGLFFBQUFBLEtBQUssR0FBR0UsUUFBUjtBQUNELE9BRkQsTUFFTztBQUNMRixRQUFBQSxLQUFLLEdBQUdLLFFBQVEsQ0FBQ0wsS0FBRCxFQUFRLEVBQVIsQ0FBaEI7QUFDRDtBQUNGOztBQUVELFdBQU9BLEtBQVA7QUFDRCxHQWhCVTtBQWtCWDtBQUNBTSxFQUFBQSxHQUFHLEVBQUU7QUFBQTtBQUFBLE1BQVNOLEtBQVQsRUFBNEI7QUFDL0JBLElBQUFBLEtBQUssR0FBR0YsTUFBTSxDQUFDRyxXQUFQLENBQW1CRCxLQUFuQixDQUFSOztBQUVBLFFBQ0UsT0FBT08sT0FBUCxLQUFtQixXQUFuQixJQUNBVCxNQUFNLENBQUNHLFdBQVAsQ0FBbUJILE1BQU0sQ0FBQ0UsS0FBMUIsS0FBb0NBLEtBRnRDLEVBR0U7QUFBQTtBQUFBOztBQUNBLFVBQUlRLE1BQU0sR0FBR1YsTUFBTSxDQUFDQyxTQUFQLENBQWlCQyxLQUFqQixDQUFiLENBREEsQ0FFQTs7QUFDQSxVQUFJLENBQUNPLE9BQU8sQ0FBQ0MsTUFBRCxDQUFaLEVBQXNCO0FBQ3BCQSxRQUFBQSxNQUFNLEdBQUcsS0FBVDtBQUNEOztBQUxEO0FBQUEsd0NBTm9CQyxPQU1wQjtBQU5vQkEsUUFBQUEsT0FNcEI7QUFBQTs7QUFNQTs7QUFBQTtBQUFBLGtCQUFBRixPQUFPLEVBQUNDLE1BQUQsQ0FBUDtBQUFBO0FBQUEsZ0JBQW1CQyxPQUFuQixFQU5BLENBTTZCOztBQUM5QjtBQUNGO0FBakNVLENBQWI7OztlQW9DZVgsTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluZGV4T2YgfSBmcm9tICcuL3V0aWxzJztcblxubGV0IGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiBbJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddLFxuICBsZXZlbDogJ2luZm8nLFxuXG4gIC8vIE1hcHMgYSBnaXZlbiBsZXZlbCB2YWx1ZSB0byB0aGUgYG1ldGhvZE1hcGAgaW5kZXhlcyBhYm92ZS5cbiAgbG9va3VwTGV2ZWw6IGZ1bmN0aW9uKGxldmVsKSB7XG4gICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGxldCBsZXZlbE1hcCA9IGluZGV4T2YobG9nZ2VyLm1ldGhvZE1hcCwgbGV2ZWwudG9Mb3dlckNhc2UoKSk7XG4gICAgICBpZiAobGV2ZWxNYXAgPj0gMCkge1xuICAgICAgICBsZXZlbCA9IGxldmVsTWFwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV2ZWwgPSBwYXJzZUludChsZXZlbCwgMTApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsZXZlbDtcbiAgfSxcblxuICAvLyBDYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgaG9zdCBlbnZpcm9ubWVudFxuICBsb2c6IGZ1bmN0aW9uKGxldmVsLCAuLi5tZXNzYWdlKSB7XG4gICAgbGV2ZWwgPSBsb2dnZXIubG9va3VwTGV2ZWwobGV2ZWwpO1xuXG4gICAgaWYgKFxuICAgICAgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICBsb2dnZXIubG9va3VwTGV2ZWwobG9nZ2VyLmxldmVsKSA8PSBsZXZlbFxuICAgICkge1xuICAgICAgbGV0IG1ldGhvZCA9IGxvZ2dlci5tZXRob2RNYXBbbGV2ZWxdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGlmICghY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIG1ldGhvZCA9ICdsb2cnO1xuICAgICAgfVxuICAgICAgY29uc29sZVttZXRob2RdKC4uLm1lc3NhZ2UpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlcjtcbiJdfQ==
