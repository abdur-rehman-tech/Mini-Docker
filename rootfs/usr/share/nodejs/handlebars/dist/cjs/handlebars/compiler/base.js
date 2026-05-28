/*istanbul ignore next*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseWithoutProcessing = parseWithoutProcessing;
exports.parse = parse;
Object.defineProperty(exports, "parser", {
  enumerable: true,
  get: function get() {
    return _parser["default"];
  }
});

var
/*istanbul ignore next*/
_parser = _interopRequireDefault(require("./parser"));

var
/*istanbul ignore next*/
_whitespaceControl = _interopRequireDefault(require("./whitespace-control"));

var
/*istanbul ignore next*/
Helpers = _interopRequireWildcard(require("./helpers"));

var
/*istanbul ignore next*/
_utils = require("../utils");

/*istanbul ignore next*/ function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var yy = {};

/*istanbul ignore next*/
(0,
/*istanbul ignore next*/
_utils.
/*istanbul ignore next*/
extend)(yy, Helpers);

function parseWithoutProcessing(input, options) {
  // Just return if an already-compiled AST was passed in.
  if (input.type === 'Program') {
    return input;
  }

  /*istanbul ignore next*/
  _parser[
  /*istanbul ignore next*/
  "default"].yy = yy; // Altering the shared object here, but this is ok as parser is a sync operation

  yy.locInfo = function (locInfo) {
    return new yy.SourceLocation(options && options.srcName, locInfo);
  };

  var ast =
  /*istanbul ignore next*/
  _parser[
  /*istanbul ignore next*/
  "default"].parse(input);

  return ast;
}

function parse(input, options) {
  var ast = parseWithoutProcessing(input, options);
  var strip = new
  /*istanbul ignore next*/
  _whitespaceControl[
  /*istanbul ignore next*/
  "default"](options);
  return strip.accept(ast);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2NvbXBpbGVyL2Jhc2UuanMiXSwibmFtZXMiOlsieXkiLCJleHRlbmQiLCJIZWxwZXJzIiwicGFyc2VXaXRob3V0UHJvY2Vzc2luZyIsImlucHV0Iiwib3B0aW9ucyIsInR5cGUiLCJwYXJzZXIiLCJsb2NJbmZvIiwiU291cmNlTG9jYXRpb24iLCJzcmNOYW1lIiwiYXN0IiwicGFyc2UiLCJzdHJpcCIsIldoaXRlc3BhY2VDb250cm9sIiwiYWNjZXB0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUFJQSxJQUFJQSxFQUFFLEdBQUcsRUFBVDs7QUFDQTtBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLFFBQU9ELEVBQVAsRUFBV0UsT0FBWDs7QUFFTyxTQUFTQyxzQkFBVCxDQUFnQ0MsS0FBaEMsRUFBdUNDLE9BQXZDLEVBQWdEO0FBQ3JEO0FBQ0EsTUFBSUQsS0FBSyxDQUFDRSxJQUFOLEtBQWUsU0FBbkIsRUFBOEI7QUFDNUIsV0FBT0YsS0FBUDtBQUNEOztBQUVERztBQUFBQTtBQUFBQTtBQUFBQSxhQUFPUCxFQUFQLEdBQVlBLEVBQVosQ0FOcUQsQ0FRckQ7O0FBQ0FBLEVBQUFBLEVBQUUsQ0FBQ1EsT0FBSCxHQUFhLFVBQVNBLE9BQVQsRUFBa0I7QUFDN0IsV0FBTyxJQUFJUixFQUFFLENBQUNTLGNBQVAsQ0FBc0JKLE9BQU8sSUFBSUEsT0FBTyxDQUFDSyxPQUF6QyxFQUFrREYsT0FBbEQsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsTUFBSUcsR0FBRztBQUFHSjtBQUFBQTtBQUFBQTtBQUFBQSxhQUFPSyxLQUFQLENBQWFSLEtBQWIsQ0FBVjs7QUFFQSxTQUFPTyxHQUFQO0FBQ0Q7O0FBRU0sU0FBU0MsS0FBVCxDQUFlUixLQUFmLEVBQXNCQyxPQUF0QixFQUErQjtBQUNwQyxNQUFJTSxHQUFHLEdBQUdSLHNCQUFzQixDQUFDQyxLQUFELEVBQVFDLE9BQVIsQ0FBaEM7QUFDQSxNQUFJUSxLQUFLLEdBQUc7QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUEsWUFBSixDQUFzQlQsT0FBdEIsQ0FBWjtBQUVBLFNBQU9RLEtBQUssQ0FBQ0UsTUFBTixDQUFhSixHQUFiLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXJzZXIgZnJvbSAnLi9wYXJzZXInO1xuaW1wb3J0IFdoaXRlc3BhY2VDb250cm9sIGZyb20gJy4vd2hpdGVzcGFjZS1jb250cm9sJztcbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCB7IGV4dGVuZCB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IHsgcGFyc2VyIH07XG5cbmxldCB5eSA9IHt9O1xuZXh0ZW5kKHl5LCBIZWxwZXJzKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlV2l0aG91dFByb2Nlc3NpbmcoaW5wdXQsIG9wdGlvbnMpIHtcbiAgLy8gSnVzdCByZXR1cm4gaWYgYW4gYWxyZWFkeS1jb21waWxlZCBBU1Qgd2FzIHBhc3NlZCBpbi5cbiAgaWYgKGlucHV0LnR5cGUgPT09ICdQcm9ncmFtJykge1xuICAgIHJldHVybiBpbnB1dDtcbiAgfVxuXG4gIHBhcnNlci55eSA9IHl5O1xuXG4gIC8vIEFsdGVyaW5nIHRoZSBzaGFyZWQgb2JqZWN0IGhlcmUsIGJ1dCB0aGlzIGlzIG9rIGFzIHBhcnNlciBpcyBhIHN5bmMgb3BlcmF0aW9uXG4gIHl5LmxvY0luZm8gPSBmdW5jdGlvbihsb2NJbmZvKSB7XG4gICAgcmV0dXJuIG5ldyB5eS5Tb3VyY2VMb2NhdGlvbihvcHRpb25zICYmIG9wdGlvbnMuc3JjTmFtZSwgbG9jSW5mbyk7XG4gIH07XG5cbiAgbGV0IGFzdCA9IHBhcnNlci5wYXJzZShpbnB1dCk7XG5cbiAgcmV0dXJuIGFzdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKGlucHV0LCBvcHRpb25zKSB7XG4gIGxldCBhc3QgPSBwYXJzZVdpdGhvdXRQcm9jZXNzaW5nKGlucHV0LCBvcHRpb25zKTtcbiAgbGV0IHN0cmlwID0gbmV3IFdoaXRlc3BhY2VDb250cm9sKG9wdGlvbnMpO1xuXG4gIHJldHVybiBzdHJpcC5hY2NlcHQoYXN0KTtcbn1cbiJdfQ==
