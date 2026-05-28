/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function
/*istanbul ignore next*/
_default(Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */

  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }

    return Handlebars;
  };
}

/*istanbul ignore next*/
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL25vLWNvbmZsaWN0LmpzIl0sIm5hbWVzIjpbIkhhbmRsZWJhcnMiLCJyb290IiwiZ2xvYmFsIiwid2luZG93IiwiJEhhbmRsZWJhcnMiLCJub0NvbmZsaWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFlO0FBQUE7QUFBQSxTQUFTQSxVQUFULEVBQXFCO0FBQ2xDO0FBQ0EsTUFBSUMsSUFBSSxHQUFHLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0NBLE1BQWhDLEdBQXlDQyxNQUFwRDtBQUFBLE1BQ0VDLFdBQVcsR0FBR0gsSUFBSSxDQUFDRCxVQURyQjtBQUVBOztBQUNBQSxFQUFBQSxVQUFVLENBQUNLLFVBQVgsR0FBd0IsWUFBVztBQUNqQyxRQUFJSixJQUFJLENBQUNELFVBQUwsS0FBb0JBLFVBQXhCLEVBQW9DO0FBQ2xDQyxNQUFBQSxJQUFJLENBQUNELFVBQUwsR0FBa0JJLFdBQWxCO0FBQ0Q7O0FBQ0QsV0FBT0osVUFBUDtBQUNELEdBTEQ7QUFNRCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKEhhbmRsZWJhcnMpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgbGV0IHJvb3QgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdyxcbiAgICAkSGFuZGxlYmFycyA9IHJvb3QuSGFuZGxlYmFycztcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgSGFuZGxlYmFycy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHJvb3QuSGFuZGxlYmFycyA9PT0gSGFuZGxlYmFycykge1xuICAgICAgcm9vdC5IYW5kbGViYXJzID0gJEhhbmRsZWJhcnM7XG4gICAgfVxuICAgIHJldHVybiBIYW5kbGViYXJzO1xuICB9O1xufVxuIl19
