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
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;

    if (!props.partials) {
      props.partials = {};

      ret = function
      /*istanbul ignore next*/
      ret(context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials =
        /*istanbul ignore next*/
        (0,
        /*istanbul ignore next*/
        _utils.
        /*istanbul ignore next*/
        extend)({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;
    return ret;
  });
}

/*istanbul ignore next*/
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2RlY29yYXRvcnMvaW5saW5lLmpzIl0sIm5hbWVzIjpbImluc3RhbmNlIiwicmVnaXN0ZXJEZWNvcmF0b3IiLCJmbiIsInByb3BzIiwiY29udGFpbmVyIiwib3B0aW9ucyIsInJldCIsInBhcnRpYWxzIiwiY29udGV4dCIsIm9yaWdpbmFsIiwiZXh0ZW5kIiwiYXJncyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7O0FBRWU7QUFBQTtBQUFBLFNBQVNBLFFBQVQsRUFBbUI7QUFDaENBLEVBQUFBLFFBQVEsQ0FBQ0MsaUJBQVQsQ0FBMkIsUUFBM0IsRUFBcUMsVUFBU0MsRUFBVCxFQUFhQyxLQUFiLEVBQW9CQyxTQUFwQixFQUErQkMsT0FBL0IsRUFBd0M7QUFDM0UsUUFBSUMsR0FBRyxHQUFHSixFQUFWOztBQUNBLFFBQUksQ0FBQ0MsS0FBSyxDQUFDSSxRQUFYLEVBQXFCO0FBQ25CSixNQUFBQSxLQUFLLENBQUNJLFFBQU4sR0FBaUIsRUFBakI7O0FBQ0FELE1BQUFBLEdBQUcsR0FBRztBQUFBO0FBQUEsVUFBU0UsT0FBVCxFQUFrQkgsT0FBbEIsRUFBMkI7QUFDL0I7QUFDQSxZQUFJSSxRQUFRLEdBQUdMLFNBQVMsQ0FBQ0csUUFBekI7QUFDQUgsUUFBQUEsU0FBUyxDQUFDRyxRQUFWO0FBQXFCO0FBQUE7QUFBQUc7QUFBQUE7QUFBQUE7QUFBQUEsZ0JBQU8sRUFBUCxFQUFXRCxRQUFYLEVBQXFCTixLQUFLLENBQUNJLFFBQTNCLENBQXJCO0FBQ0EsWUFBSUQsR0FBRyxHQUFHSixFQUFFLENBQUNNLE9BQUQsRUFBVUgsT0FBVixDQUFaO0FBQ0FELFFBQUFBLFNBQVMsQ0FBQ0csUUFBVixHQUFxQkUsUUFBckI7QUFDQSxlQUFPSCxHQUFQO0FBQ0QsT0FQRDtBQVFEOztBQUVESCxJQUFBQSxLQUFLLENBQUNJLFFBQU4sQ0FBZUYsT0FBTyxDQUFDTSxJQUFSLENBQWEsQ0FBYixDQUFmLElBQWtDTixPQUFPLENBQUNILEVBQTFDO0FBRUEsV0FBT0ksR0FBUDtBQUNELEdBakJEO0FBa0JEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXh0ZW5kIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckRlY29yYXRvcignaW5saW5lJywgZnVuY3Rpb24oZm4sIHByb3BzLCBjb250YWluZXIsIG9wdGlvbnMpIHtcbiAgICBsZXQgcmV0ID0gZm47XG4gICAgaWYgKCFwcm9wcy5wYXJ0aWFscykge1xuICAgICAgcHJvcHMucGFydGlhbHMgPSB7fTtcbiAgICAgIHJldCA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHBhcnRpYWxzIHN0YWNrIGZyYW1lIHByaW9yIHRvIGV4ZWMuXG4gICAgICAgIGxldCBvcmlnaW5hbCA9IGNvbnRhaW5lci5wYXJ0aWFscztcbiAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gZXh0ZW5kKHt9LCBvcmlnaW5hbCwgcHJvcHMucGFydGlhbHMpO1xuICAgICAgICBsZXQgcmV0ID0gZm4oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IG9yaWdpbmFsO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm9wcy5wYXJ0aWFsc1tvcHRpb25zLmFyZ3NbMF1dID0gb3B0aW9ucy5mbjtcblxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xufVxuIl19
