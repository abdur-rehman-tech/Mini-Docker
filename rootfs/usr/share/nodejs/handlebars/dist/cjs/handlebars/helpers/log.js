/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function
/*istanbul ignore next*/
_default(instance) {
  instance.registerHelper('log', function ()
  /* message, options */
  {
    var args = [undefined],
        options = arguments[arguments.length - 1];

    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;

    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }

    args[0] = level;

    /*istanbul ignore next*/
    instance.log.apply(instance, args);
  });
}

/*istanbul ignore next*/
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvbG9nLmpzIl0sIm5hbWVzIjpbImluc3RhbmNlIiwicmVnaXN0ZXJIZWxwZXIiLCJhcmdzIiwidW5kZWZpbmVkIiwib3B0aW9ucyIsImFyZ3VtZW50cyIsImxlbmd0aCIsImkiLCJwdXNoIiwibGV2ZWwiLCJoYXNoIiwiZGF0YSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBZTtBQUFBO0FBQUEsU0FBU0EsUUFBVCxFQUFtQjtBQUNoQ0EsRUFBQUEsUUFBUSxDQUFDQyxjQUFULENBQXdCLEtBQXhCLEVBQStCO0FBQVM7QUFBd0I7QUFDOUQsUUFBSUMsSUFBSSxHQUFHLENBQUNDLFNBQUQsQ0FBWDtBQUFBLFFBQ0VDLE9BQU8sR0FBR0MsU0FBUyxDQUFDQSxTQUFTLENBQUNDLE1BQVYsR0FBbUIsQ0FBcEIsQ0FEckI7O0FBRUEsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixTQUFTLENBQUNDLE1BQVYsR0FBbUIsQ0FBdkMsRUFBMENDLENBQUMsRUFBM0MsRUFBK0M7QUFDN0NMLE1BQUFBLElBQUksQ0FBQ00sSUFBTCxDQUFVSCxTQUFTLENBQUNFLENBQUQsQ0FBbkI7QUFDRDs7QUFFRCxRQUFJRSxLQUFLLEdBQUcsQ0FBWjs7QUFDQSxRQUFJTCxPQUFPLENBQUNNLElBQVIsQ0FBYUQsS0FBYixJQUFzQixJQUExQixFQUFnQztBQUM5QkEsTUFBQUEsS0FBSyxHQUFHTCxPQUFPLENBQUNNLElBQVIsQ0FBYUQsS0FBckI7QUFDRCxLQUZELE1BRU8sSUFBSUwsT0FBTyxDQUFDTyxJQUFSLElBQWdCUCxPQUFPLENBQUNPLElBQVIsQ0FBYUYsS0FBYixJQUFzQixJQUExQyxFQUFnRDtBQUNyREEsTUFBQUEsS0FBSyxHQUFHTCxPQUFPLENBQUNPLElBQVIsQ0FBYUYsS0FBckI7QUFDRDs7QUFDRFAsSUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVTyxLQUFWOztBQUVBO0FBQUFULElBQUFBLFFBQVEsQ0FBQ1ksR0FBVCxPQUFBWixRQUFRLEVBQVFFLElBQVIsQ0FBUjtBQUNELEdBaEJEO0FBaUJEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKC8qIG1lc3NhZ2UsIG9wdGlvbnMgKi8pIHtcbiAgICBsZXQgYXJncyA9IFt1bmRlZmluZWRdLFxuICAgICAgb3B0aW9ucyA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICB9XG5cbiAgICBsZXQgbGV2ZWwgPSAxO1xuICAgIGlmIChvcHRpb25zLmhhc2gubGV2ZWwgIT0gbnVsbCkge1xuICAgICAgbGV2ZWwgPSBvcHRpb25zLmhhc2gubGV2ZWw7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhLmxldmVsICE9IG51bGwpIHtcbiAgICAgIGxldmVsID0gb3B0aW9ucy5kYXRhLmxldmVsO1xuICAgIH1cbiAgICBhcmdzWzBdID0gbGV2ZWw7XG5cbiAgICBpbnN0YW5jZS5sb2coLi4uYXJncyk7XG4gIH0pO1xufVxuIl19
