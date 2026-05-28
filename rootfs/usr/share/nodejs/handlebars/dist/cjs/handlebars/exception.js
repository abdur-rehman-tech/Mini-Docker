/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var errorProps = ['description', 'fileName', 'lineNumber', 'endLineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line,
      endLineNumber,
      column,
      endColumn;

  if (loc) {
    line = loc.start.line;
    endLineNumber = loc.end.line;
    column = loc.start.column;
    endColumn = loc.end.column;
    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message); // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.

  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
  /* istanbul ignore else */


  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  try {
    if (loc) {
      this.lineNumber = line;
      this.endLineNumber = endLineNumber; // Work around issue under safari where we can't directly set the column value

      /* istanbul ignore next */

      if (Object.defineProperty) {
        Object.defineProperty(this, 'column', {
          value: column,
          enumerable: true
        });
        Object.defineProperty(this, 'endColumn', {
          value: endColumn,
          enumerable: true
        });
      } else {
        this.column = column;
        this.endColumn = endColumn;
      }
    }
  } catch (nop) {
    /* Ignore if the browser is very particular */
  }
}

Exception.prototype = new Error();

/*istanbul ignore next*/
var _default = Exception;

/*istanbul ignore next*/
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6WyJlcnJvclByb3BzIiwiRXhjZXB0aW9uIiwibWVzc2FnZSIsIm5vZGUiLCJsb2MiLCJsaW5lIiwiZW5kTGluZU51bWJlciIsImNvbHVtbiIsImVuZENvbHVtbiIsInN0YXJ0IiwiZW5kIiwidG1wIiwiRXJyb3IiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsImNhbGwiLCJpZHgiLCJsZW5ndGgiLCJjYXB0dXJlU3RhY2tUcmFjZSIsImxpbmVOdW1iZXIiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiZW51bWVyYWJsZSIsIm5vcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLElBQU1BLFVBQVUsR0FBRyxDQUNqQixhQURpQixFQUVqQixVQUZpQixFQUdqQixZQUhpQixFQUlqQixlQUppQixFQUtqQixTQUxpQixFQU1qQixNQU5pQixFQU9qQixRQVBpQixFQVFqQixPQVJpQixDQUFuQjs7QUFXQSxTQUFTQyxTQUFULENBQW1CQyxPQUFuQixFQUE0QkMsSUFBNUIsRUFBa0M7QUFDaEMsTUFBSUMsR0FBRyxHQUFHRCxJQUFJLElBQUlBLElBQUksQ0FBQ0MsR0FBdkI7QUFBQSxNQUNFQyxJQURGO0FBQUEsTUFFRUMsYUFGRjtBQUFBLE1BR0VDLE1BSEY7QUFBQSxNQUlFQyxTQUpGOztBQU1BLE1BQUlKLEdBQUosRUFBUztBQUNQQyxJQUFBQSxJQUFJLEdBQUdELEdBQUcsQ0FBQ0ssS0FBSixDQUFVSixJQUFqQjtBQUNBQyxJQUFBQSxhQUFhLEdBQUdGLEdBQUcsQ0FBQ00sR0FBSixDQUFRTCxJQUF4QjtBQUNBRSxJQUFBQSxNQUFNLEdBQUdILEdBQUcsQ0FBQ0ssS0FBSixDQUFVRixNQUFuQjtBQUNBQyxJQUFBQSxTQUFTLEdBQUdKLEdBQUcsQ0FBQ00sR0FBSixDQUFRSCxNQUFwQjtBQUVBTCxJQUFBQSxPQUFPLElBQUksUUFBUUcsSUFBUixHQUFlLEdBQWYsR0FBcUJFLE1BQWhDO0FBQ0Q7O0FBRUQsTUFBSUksR0FBRyxHQUFHQyxLQUFLLENBQUNDLFNBQU4sQ0FBZ0JDLFdBQWhCLENBQTRCQyxJQUE1QixDQUFpQyxJQUFqQyxFQUF1Q2IsT0FBdkMsQ0FBVixDQWhCZ0MsQ0FrQmhDOztBQUNBLE9BQUssSUFBSWMsR0FBRyxHQUFHLENBQWYsRUFBa0JBLEdBQUcsR0FBR2hCLFVBQVUsQ0FBQ2lCLE1BQW5DLEVBQTJDRCxHQUFHLEVBQTlDLEVBQWtEO0FBQ2hELFNBQUtoQixVQUFVLENBQUNnQixHQUFELENBQWYsSUFBd0JMLEdBQUcsQ0FBQ1gsVUFBVSxDQUFDZ0IsR0FBRCxDQUFYLENBQTNCO0FBQ0Q7QUFFRDs7O0FBQ0EsTUFBSUosS0FBSyxDQUFDTSxpQkFBVixFQUE2QjtBQUMzQk4sSUFBQUEsS0FBSyxDQUFDTSxpQkFBTixDQUF3QixJQUF4QixFQUE4QmpCLFNBQTlCO0FBQ0Q7O0FBRUQsTUFBSTtBQUNGLFFBQUlHLEdBQUosRUFBUztBQUNQLFdBQUtlLFVBQUwsR0FBa0JkLElBQWxCO0FBQ0EsV0FBS0MsYUFBTCxHQUFxQkEsYUFBckIsQ0FGTyxDQUlQOztBQUNBOztBQUNBLFVBQUljLE1BQU0sQ0FBQ0MsY0FBWCxFQUEyQjtBQUN6QkQsUUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFFBQTVCLEVBQXNDO0FBQ3BDQyxVQUFBQSxLQUFLLEVBQUVmLE1BRDZCO0FBRXBDZ0IsVUFBQUEsVUFBVSxFQUFFO0FBRndCLFNBQXRDO0FBSUFILFFBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQixJQUF0QixFQUE0QixXQUE1QixFQUF5QztBQUN2Q0MsVUFBQUEsS0FBSyxFQUFFZCxTQURnQztBQUV2Q2UsVUFBQUEsVUFBVSxFQUFFO0FBRjJCLFNBQXpDO0FBSUQsT0FURCxNQVNPO0FBQ0wsYUFBS2hCLE1BQUwsR0FBY0EsTUFBZDtBQUNBLGFBQUtDLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0Q7QUFDRjtBQUNGLEdBckJELENBcUJFLE9BQU9nQixHQUFQLEVBQVk7QUFDWjtBQUNEO0FBQ0Y7O0FBRUR2QixTQUFTLENBQUNZLFNBQVYsR0FBc0IsSUFBSUQsS0FBSixFQUF0Qjs7O2VBRWVYLFMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBlcnJvclByb3BzID0gW1xuICAnZGVzY3JpcHRpb24nLFxuICAnZmlsZU5hbWUnLFxuICAnbGluZU51bWJlcicsXG4gICdlbmRMaW5lTnVtYmVyJyxcbiAgJ21lc3NhZ2UnLFxuICAnbmFtZScsXG4gICdudW1iZXInLFxuICAnc3RhY2snXG5dO1xuXG5mdW5jdGlvbiBFeGNlcHRpb24obWVzc2FnZSwgbm9kZSkge1xuICBsZXQgbG9jID0gbm9kZSAmJiBub2RlLmxvYyxcbiAgICBsaW5lLFxuICAgIGVuZExpbmVOdW1iZXIsXG4gICAgY29sdW1uLFxuICAgIGVuZENvbHVtbjtcblxuICBpZiAobG9jKSB7XG4gICAgbGluZSA9IGxvYy5zdGFydC5saW5lO1xuICAgIGVuZExpbmVOdW1iZXIgPSBsb2MuZW5kLmxpbmU7XG4gICAgY29sdW1uID0gbG9jLnN0YXJ0LmNvbHVtbjtcbiAgICBlbmRDb2x1bW4gPSBsb2MuZW5kLmNvbHVtbjtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgY29sdW1uO1xuICB9XG5cbiAgbGV0IHRtcCA9IEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG4gIC8vIFVuZm9ydHVuYXRlbHkgZXJyb3JzIGFyZSBub3QgZW51bWVyYWJsZSBpbiBDaHJvbWUgKGF0IGxlYXN0KSwgc28gYGZvciBwcm9wIGluIHRtcGAgZG9lc24ndCB3b3JrLlxuICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBlcnJvclByb3BzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzW2Vycm9yUHJvcHNbaWR4XV0gPSB0bXBbZXJyb3JQcm9wc1tpZHhdXTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEV4Y2VwdGlvbik7XG4gIH1cblxuICB0cnkge1xuICAgIGlmIChsb2MpIHtcbiAgICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgICB0aGlzLmVuZExpbmVOdW1iZXIgPSBlbmRMaW5lTnVtYmVyO1xuXG4gICAgICAvLyBXb3JrIGFyb3VuZCBpc3N1ZSB1bmRlciBzYWZhcmkgd2hlcmUgd2UgY2FuJ3QgZGlyZWN0bHkgc2V0IHRoZSBjb2x1bW4gdmFsdWVcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY29sdW1uJywge1xuICAgICAgICAgIHZhbHVlOiBjb2x1bW4sXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdlbmRDb2x1bW4nLCB7XG4gICAgICAgICAgdmFsdWU6IGVuZENvbHVtbixcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gICAgICAgIHRoaXMuZW5kQ29sdW1uID0gZW5kQ29sdW1uO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAobm9wKSB7XG4gICAgLyogSWdub3JlIGlmIHRoZSBicm93c2VyIGlzIHZlcnkgcGFydGljdWxhciAqL1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0IGRlZmF1bHQgRXhjZXB0aW9uO1xuIl19
