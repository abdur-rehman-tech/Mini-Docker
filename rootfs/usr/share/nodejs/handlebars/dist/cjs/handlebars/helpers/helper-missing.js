/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var
/*istanbul ignore next*/
_exception = _interopRequireDefault(require("../exception"));

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function
/*istanbul ignore next*/
_default(instance) {
  instance.registerHelper('helperMissing', function ()
  /* [args, ]options */
  {
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
}

/*istanbul ignore next*/
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaGVscGVyLW1pc3NpbmcuanMiXSwibmFtZXMiOlsiaW5zdGFuY2UiLCJyZWdpc3RlckhlbHBlciIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIkV4Y2VwdGlvbiIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOzs7O0FBRWU7QUFBQTtBQUFBLFNBQVNBLFFBQVQsRUFBbUI7QUFDaENBLEVBQUFBLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixFQUF5QztBQUFTO0FBQXVCO0FBQ3ZFLFFBQUlDLFNBQVMsQ0FBQ0MsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUMxQjtBQUNBLGFBQU9DLFNBQVA7QUFDRCxLQUhELE1BR087QUFDTDtBQUNBLFlBQU07QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUEsZ0JBQUosQ0FDSixzQkFBc0JILFNBQVMsQ0FBQ0EsU0FBUyxDQUFDQyxNQUFWLEdBQW1CLENBQXBCLENBQVQsQ0FBZ0NHLElBQXRELEdBQTZELEdBRHpELENBQU47QUFHRDtBQUNGLEdBVkQ7QUFXRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi4vZXhjZXB0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbigvKiBbYXJncywgXW9wdGlvbnMgKi8pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gQSBtaXNzaW5nIGZpZWxkIGluIGEge3tmb299fSBjb25zdHJ1Y3QuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTb21lb25lIGlzIGFjdHVhbGx5IHRyeWluZyB0byBjYWxsIHNvbWV0aGluZywgYmxvdyB1cC5cbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXG4gICAgICAgICdNaXNzaW5nIGhlbHBlcjogXCInICsgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXS5uYW1lICsgJ1wiJ1xuICAgICAgKTtcbiAgICB9XG4gIH0pO1xufVxuIl19
