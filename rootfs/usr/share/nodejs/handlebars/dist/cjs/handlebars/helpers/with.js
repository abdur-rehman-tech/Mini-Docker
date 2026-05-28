/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var
/*istanbul ignore next*/
_utils = require("../utils");

var
/*istanbul ignore next*/
_exception = _interopRequireDefault(require("../exception"));

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function
/*istanbul ignore next*/
_default(instance) {
  instance.registerHelper('with', function (context, options) {
    if (arguments.length != 2) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('#with requires exactly one argument');
    }

    if (
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    isFunction)(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    isEmpty)(context)) {
      var data = options.data;

      if (options.data && options.ids) {
        data =
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
        appendContextPath)(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams:
        /*istanbul ignore next*/
        (0,
        /*istanbul ignore next*/
        _utils.
        /*istanbul ignore next*/
        blockParams)([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
}

/*istanbul ignore next*/
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvd2l0aC5qcyJdLCJuYW1lcyI6WyJpbnN0YW5jZSIsInJlZ2lzdGVySGVscGVyIiwiY29udGV4dCIsIm9wdGlvbnMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJFeGNlcHRpb24iLCJpc0Z1bmN0aW9uIiwiY2FsbCIsImZuIiwiaXNFbXB0eSIsImRhdGEiLCJpZHMiLCJjcmVhdGVGcmFtZSIsImNvbnRleHRQYXRoIiwiYXBwZW5kQ29udGV4dFBhdGgiLCJibG9ja1BhcmFtcyIsImludmVyc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOztBQU9BO0FBQUE7QUFBQTs7OztBQUVlO0FBQUE7QUFBQSxTQUFTQSxRQUFULEVBQW1CO0FBQ2hDQSxFQUFBQSxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0MsVUFBU0MsT0FBVCxFQUFrQkMsT0FBbEIsRUFBMkI7QUFDekQsUUFBSUMsU0FBUyxDQUFDQyxNQUFWLElBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLFlBQU07QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUEsZ0JBQUosQ0FBYyxxQ0FBZCxDQUFOO0FBQ0Q7O0FBQ0Q7QUFBSTtBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLGdCQUFXTCxPQUFYLENBQUosRUFBeUI7QUFDdkJBLE1BQUFBLE9BQU8sR0FBR0EsT0FBTyxDQUFDTSxJQUFSLENBQWEsSUFBYixDQUFWO0FBQ0Q7O0FBRUQsUUFBSUMsRUFBRSxHQUFHTixPQUFPLENBQUNNLEVBQWpCOztBQUVBLFFBQUk7QUFBQztBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLGFBQVFSLE9BQVIsQ0FBTCxFQUF1QjtBQUNyQixVQUFJUyxJQUFJLEdBQUdSLE9BQU8sQ0FBQ1EsSUFBbkI7O0FBQ0EsVUFBSVIsT0FBTyxDQUFDUSxJQUFSLElBQWdCUixPQUFPLENBQUNTLEdBQTVCLEVBQWlDO0FBQy9CRCxRQUFBQSxJQUFJO0FBQUc7QUFBQTtBQUFBRTtBQUFBQTtBQUFBQTtBQUFBQSxxQkFBWVYsT0FBTyxDQUFDUSxJQUFwQixDQUFQO0FBQ0FBLFFBQUFBLElBQUksQ0FBQ0csV0FBTDtBQUFtQjtBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLDJCQUNqQlosT0FBTyxDQUFDUSxJQUFSLENBQWFHLFdBREksRUFFakJYLE9BQU8sQ0FBQ1MsR0FBUixDQUFZLENBQVosQ0FGaUIsQ0FBbkI7QUFJRDs7QUFFRCxhQUFPSCxFQUFFLENBQUNQLE9BQUQsRUFBVTtBQUNqQlMsUUFBQUEsSUFBSSxFQUFFQSxJQURXO0FBRWpCSyxRQUFBQSxXQUFXO0FBQUU7QUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQSxxQkFBWSxDQUFDZCxPQUFELENBQVosRUFBdUIsQ0FBQ1MsSUFBSSxJQUFJQSxJQUFJLENBQUNHLFdBQWQsQ0FBdkI7QUFGSSxPQUFWLENBQVQ7QUFJRCxLQWRELE1BY087QUFDTCxhQUFPWCxPQUFPLENBQUNjLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBQ0YsR0EzQkQ7QUE0QkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBhcHBlbmRDb250ZXh0UGF0aCxcbiAgYmxvY2tQYXJhbXMsXG4gIGNyZWF0ZUZyYW1lLFxuICBpc0VtcHR5LFxuICBpc0Z1bmN0aW9uXG59IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi4vZXhjZXB0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignI3dpdGggcmVxdWlyZXMgZXhhY3RseSBvbmUgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHtcbiAgICAgIGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgbGV0IGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmICghaXNFbXB0eShjb250ZXh0KSkge1xuICAgICAgbGV0IGRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gYXBwZW5kQ29udGV4dFBhdGgoXG4gICAgICAgICAgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLFxuICAgICAgICAgIG9wdGlvbnMuaWRzWzBdXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmbihjb250ZXh0LCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhbY29udGV4dF0sIFtkYXRhICYmIGRhdGEuY29udGV4dFBhdGhdKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
