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
  instance.registerHelper('if', function (conditional, options) {
    if (arguments.length != 2) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('#if requires exactly one argument');
    }

    if (
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    isFunction)(conditional)) {
      conditional = conditional.call(this);
    } // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.


    if (!options.hash.includeZero && !conditional ||
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    isEmpty)(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });
  instance.registerHelper('unless', function (conditional, options) {
    if (arguments.length != 2) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('#unless requires exactly one argument');
    }

    return instance.helpers['if'].call(this, conditional, {
      fn: options.inverse,
      inverse: options.fn,
      hash: options.hash
    });
  });
}

/*istanbul ignore next*/
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaWYuanMiXSwibmFtZXMiOlsiaW5zdGFuY2UiLCJyZWdpc3RlckhlbHBlciIsImNvbmRpdGlvbmFsIiwib3B0aW9ucyIsImFyZ3VtZW50cyIsImxlbmd0aCIsIkV4Y2VwdGlvbiIsImlzRnVuY3Rpb24iLCJjYWxsIiwiaGFzaCIsImluY2x1ZGVaZXJvIiwiaXNFbXB0eSIsImludmVyc2UiLCJmbiIsImhlbHBlcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7OztBQUVlO0FBQUE7QUFBQSxTQUFTQSxRQUFULEVBQW1CO0FBQ2hDQSxFQUFBQSxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsVUFBU0MsV0FBVCxFQUFzQkMsT0FBdEIsRUFBK0I7QUFDM0QsUUFBSUMsU0FBUyxDQUFDQyxNQUFWLElBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLFlBQU07QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUEsZ0JBQUosQ0FBYyxtQ0FBZCxDQUFOO0FBQ0Q7O0FBQ0Q7QUFBSTtBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLGdCQUFXTCxXQUFYLENBQUosRUFBNkI7QUFDM0JBLE1BQUFBLFdBQVcsR0FBR0EsV0FBVyxDQUFDTSxJQUFaLENBQWlCLElBQWpCLENBQWQ7QUFDRCxLQU4wRCxDQVEzRDtBQUNBO0FBQ0E7OztBQUNBLFFBQUssQ0FBQ0wsT0FBTyxDQUFDTSxJQUFSLENBQWFDLFdBQWQsSUFBNkIsQ0FBQ1IsV0FBL0I7QUFBK0M7QUFBQTtBQUFBUztBQUFBQTtBQUFBQTtBQUFBQSxhQUFRVCxXQUFSLENBQW5ELEVBQXlFO0FBQ3ZFLGFBQU9DLE9BQU8sQ0FBQ1MsT0FBUixDQUFnQixJQUFoQixDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBT1QsT0FBTyxDQUFDVSxFQUFSLENBQVcsSUFBWCxDQUFQO0FBQ0Q7QUFDRixHQWhCRDtBQWtCQWIsRUFBQUEsUUFBUSxDQUFDQyxjQUFULENBQXdCLFFBQXhCLEVBQWtDLFVBQVNDLFdBQVQsRUFBc0JDLE9BQXRCLEVBQStCO0FBQy9ELFFBQUlDLFNBQVMsQ0FBQ0MsTUFBVixJQUFvQixDQUF4QixFQUEyQjtBQUN6QixZQUFNO0FBQUlDO0FBQUFBO0FBQUFBO0FBQUFBLGdCQUFKLENBQWMsdUNBQWQsQ0FBTjtBQUNEOztBQUNELFdBQU9OLFFBQVEsQ0FBQ2MsT0FBVCxDQUFpQixJQUFqQixFQUF1Qk4sSUFBdkIsQ0FBNEIsSUFBNUIsRUFBa0NOLFdBQWxDLEVBQStDO0FBQ3BEVyxNQUFBQSxFQUFFLEVBQUVWLE9BQU8sQ0FBQ1MsT0FEd0M7QUFFcERBLE1BQUFBLE9BQU8sRUFBRVQsT0FBTyxDQUFDVSxFQUZtQztBQUdwREosTUFBQUEsSUFBSSxFQUFFTixPQUFPLENBQUNNO0FBSHNDLEtBQS9DLENBQVA7QUFLRCxHQVREO0FBVUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0VtcHR5LCBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJyNpZiByZXF1aXJlcyBleGFjdGx5IG9uZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoaXNGdW5jdGlvbihjb25kaXRpb25hbCkpIHtcbiAgICAgIGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJlbmRlciB0aGUgcG9zaXRpdmUgcGF0aCBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5IGFuZCBub3QgZW1wdHkuXG4gICAgLy8gVGhlIGBpbmNsdWRlWmVyb2Agb3B0aW9uIG1heSBiZSBzZXQgdG8gdHJlYXQgdGhlIGNvbmR0aW9uYWwgYXMgcHVyZWx5IG5vdCBlbXB0eSBiYXNlZCBvbiB0aGVcbiAgICAvLyBiZWhhdmlvciBvZiBpc0VtcHR5LiBFZmZlY3RpdmVseSB0aGlzIGRldGVybWluZXMgaWYgMCBpcyBoYW5kbGVkIGJ5IHRoZSBwb3NpdGl2ZSBwYXRoIG9yIG5lZ2F0aXZlLlxuICAgIGlmICgoIW9wdGlvbnMuaGFzaC5pbmNsdWRlWmVybyAmJiAhY29uZGl0aW9uYWwpIHx8IGlzRW1wdHkoY29uZGl0aW9uYWwpKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5mbih0aGlzKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd1bmxlc3MnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJyN1bmxlc3MgcmVxdWlyZXMgZXhhY3RseSBvbmUgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge1xuICAgICAgZm46IG9wdGlvbnMuaW52ZXJzZSxcbiAgICAgIGludmVyc2U6IG9wdGlvbnMuZm4sXG4gICAgICBoYXNoOiBvcHRpb25zLmhhc2hcbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=
