/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var
/*istanbul ignore next*/
_utils = require("../utils");

function
/*istanbul ignore next*/
_default(instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    isArray)(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data =
        /*istanbul ignore next*/
        (0,
        /*istanbul ignore next*/
        _utils.
        /*istanbul ignore next*/
        createFrame)(options.data);
        data.contextPath =
        /*istanbul ignore next*/
        (0,
        /*istanbul ignore next*/
        _utils.
        /*istanbul ignore next*/
        appendContextPath)(options.data.contextPath, options.name);
        options = {
          data: data
        };
      }

      return fn(context, options);
    }
  });
}

/*istanbul ignore next*/
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvYmxvY2staGVscGVyLW1pc3NpbmcuanMiXSwibmFtZXMiOlsiaW5zdGFuY2UiLCJyZWdpc3RlckhlbHBlciIsImNvbnRleHQiLCJvcHRpb25zIiwiaW52ZXJzZSIsImZuIiwiaXNBcnJheSIsImxlbmd0aCIsImlkcyIsIm5hbWUiLCJoZWxwZXJzIiwiZWFjaCIsImRhdGEiLCJjcmVhdGVGcmFtZSIsImNvbnRleHRQYXRoIiwiYXBwZW5kQ29udGV4dFBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOztBQUVlO0FBQUE7QUFBQSxTQUFTQSxRQUFULEVBQW1CO0FBQ2hDQSxFQUFBQSxRQUFRLENBQUNDLGNBQVQsQ0FBd0Isb0JBQXhCLEVBQThDLFVBQVNDLE9BQVQsRUFBa0JDLE9BQWxCLEVBQTJCO0FBQ3ZFLFFBQUlDLE9BQU8sR0FBR0QsT0FBTyxDQUFDQyxPQUF0QjtBQUFBLFFBQ0VDLEVBQUUsR0FBR0YsT0FBTyxDQUFDRSxFQURmOztBQUdBLFFBQUlILE9BQU8sS0FBSyxJQUFoQixFQUFzQjtBQUNwQixhQUFPRyxFQUFFLENBQUMsSUFBRCxDQUFUO0FBQ0QsS0FGRCxNQUVPLElBQUlILE9BQU8sS0FBSyxLQUFaLElBQXFCQSxPQUFPLElBQUksSUFBcEMsRUFBMEM7QUFDL0MsYUFBT0UsT0FBTyxDQUFDLElBQUQsQ0FBZDtBQUNELEtBRk0sTUFFQTtBQUFJO0FBQUE7QUFBQUU7QUFBQUE7QUFBQUE7QUFBQUEsYUFBUUosT0FBUixDQUFKLEVBQXNCO0FBQzNCLFVBQUlBLE9BQU8sQ0FBQ0ssTUFBUixHQUFpQixDQUFyQixFQUF3QjtBQUN0QixZQUFJSixPQUFPLENBQUNLLEdBQVosRUFBaUI7QUFDZkwsVUFBQUEsT0FBTyxDQUFDSyxHQUFSLEdBQWMsQ0FBQ0wsT0FBTyxDQUFDTSxJQUFULENBQWQ7QUFDRDs7QUFFRCxlQUFPVCxRQUFRLENBQUNVLE9BQVQsQ0FBaUJDLElBQWpCLENBQXNCVCxPQUF0QixFQUErQkMsT0FBL0IsQ0FBUDtBQUNELE9BTkQsTUFNTztBQUNMLGVBQU9DLE9BQU8sQ0FBQyxJQUFELENBQWQ7QUFDRDtBQUNGLEtBVk0sTUFVQTtBQUNMLFVBQUlELE9BQU8sQ0FBQ1MsSUFBUixJQUFnQlQsT0FBTyxDQUFDSyxHQUE1QixFQUFpQztBQUMvQixZQUFJSSxJQUFJO0FBQUc7QUFBQTtBQUFBQztBQUFBQTtBQUFBQTtBQUFBQSxxQkFBWVYsT0FBTyxDQUFDUyxJQUFwQixDQUFYO0FBQ0FBLFFBQUFBLElBQUksQ0FBQ0UsV0FBTDtBQUFtQjtBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLDJCQUNqQlosT0FBTyxDQUFDUyxJQUFSLENBQWFFLFdBREksRUFFakJYLE9BQU8sQ0FBQ00sSUFGUyxDQUFuQjtBQUlBTixRQUFBQSxPQUFPLEdBQUc7QUFBRVMsVUFBQUEsSUFBSSxFQUFFQTtBQUFSLFNBQVY7QUFDRDs7QUFFRCxhQUFPUCxFQUFFLENBQUNILE9BQUQsRUFBVUMsT0FBVixDQUFUO0FBQ0Q7QUFDRixHQTlCRDtBQStCRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFwcGVuZENvbnRleHRQYXRoLCBjcmVhdGVGcmFtZSwgaXNBcnJheSB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2Jsb2NrSGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBsZXQgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSxcbiAgICAgIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmIChjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYgKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5pZHMpIHtcbiAgICAgICAgICBvcHRpb25zLmlkcyA9IFtvcHRpb25zLm5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIGxldCBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCxcbiAgICAgICAgICBvcHRpb25zLm5hbWVcbiAgICAgICAgKTtcbiAgICAgICAgb3B0aW9ucyA9IHsgZGF0YTogZGF0YSB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
