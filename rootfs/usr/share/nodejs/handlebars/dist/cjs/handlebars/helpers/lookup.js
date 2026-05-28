/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function
/*istanbul ignore next*/
_default(instance) {
  instance.registerHelper('lookup', function (obj, field, options) {
    if (!obj) {
      // Note for 5.0: Change to "obj == null" in 5.0
      return obj;
    }

    return options.lookupProperty(obj, field);
  });
}

/*istanbul ignore next*/
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvbG9va3VwLmpzIl0sIm5hbWVzIjpbImluc3RhbmNlIiwicmVnaXN0ZXJIZWxwZXIiLCJvYmoiLCJmaWVsZCIsIm9wdGlvbnMiLCJsb29rdXBQcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBZTtBQUFBO0FBQUEsU0FBU0EsUUFBVCxFQUFtQjtBQUNoQ0EsRUFBQUEsUUFBUSxDQUFDQyxjQUFULENBQXdCLFFBQXhCLEVBQWtDLFVBQVNDLEdBQVQsRUFBY0MsS0FBZCxFQUFxQkMsT0FBckIsRUFBOEI7QUFDOUQsUUFBSSxDQUFDRixHQUFMLEVBQVU7QUFDUjtBQUNBLGFBQU9BLEdBQVA7QUFDRDs7QUFDRCxXQUFPRSxPQUFPLENBQUNDLGNBQVIsQ0FBdUJILEdBQXZCLEVBQTRCQyxLQUE1QixDQUFQO0FBQ0QsR0FORDtBQU9EIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvb2t1cCcsIGZ1bmN0aW9uKG9iaiwgZmllbGQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9iaikge1xuICAgICAgLy8gTm90ZSBmb3IgNS4wOiBDaGFuZ2UgdG8gXCJvYmogPT0gbnVsbFwiIGluIDUuMFxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnMubG9va3VwUHJvcGVydHkob2JqLCBmaWVsZCk7XG4gIH0pO1xufVxuIl19
