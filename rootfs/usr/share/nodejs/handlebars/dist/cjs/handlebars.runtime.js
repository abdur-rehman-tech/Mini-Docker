/*istanbul ignore next*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var
/*istanbul ignore next*/
base = _interopRequireWildcard(require("./handlebars/base"));

var
/*istanbul ignore next*/
_safeString = _interopRequireDefault(require("./handlebars/safe-string"));

var
/*istanbul ignore next*/
_exception = _interopRequireDefault(require("./handlebars/exception"));

var
/*istanbul ignore next*/
Utils = _interopRequireWildcard(require("./handlebars/utils"));

var
/*istanbul ignore next*/
runtime = _interopRequireWildcard(require("./handlebars/runtime"));

var
/*istanbul ignore next*/
_noConflict = _interopRequireDefault(require("./handlebars/no-conflict"));

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base.HandlebarsEnvironment();
  Utils.extend(hb, base);
  hb.SafeString =
  /*istanbul ignore next*/
  _safeString[
  /*istanbul ignore next*/
  "default"];
  hb.Exception =
  /*istanbul ignore next*/
  _exception[
  /*istanbul ignore next*/
  "default"];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;
  hb.VM = runtime;

  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

/*istanbul ignore next*/
(0,
/*istanbul ignore next*/
_noConflict[
/*istanbul ignore next*/
"default"])(inst);
inst['default'] = inst;

/*istanbul ignore next*/
var _default = inst;

/*istanbul ignore next*/
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9oYW5kbGViYXJzLnJ1bnRpbWUuanMiXSwibmFtZXMiOlsiY3JlYXRlIiwiaGIiLCJiYXNlIiwiSGFuZGxlYmFyc0Vudmlyb25tZW50IiwiVXRpbHMiLCJleHRlbmQiLCJTYWZlU3RyaW5nIiwiRXhjZXB0aW9uIiwiZXNjYXBlRXhwcmVzc2lvbiIsIlZNIiwicnVudGltZSIsInRlbXBsYXRlIiwic3BlYyIsImluc3QiLCJub0NvbmZsaWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOztBQUlBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFFQTtBQUFBO0FBQUE7Ozs7Ozs7O0FBUEE7QUFDQTtBQVFBO0FBQ0EsU0FBU0EsTUFBVCxHQUFrQjtBQUNoQixNQUFJQyxFQUFFLEdBQUcsSUFBSUMsSUFBSSxDQUFDQyxxQkFBVCxFQUFUO0FBRUFDLEVBQUFBLEtBQUssQ0FBQ0MsTUFBTixDQUFhSixFQUFiLEVBQWlCQyxJQUFqQjtBQUNBRCxFQUFBQSxFQUFFLENBQUNLLFVBQUg7QUFBZ0JBO0FBQUFBO0FBQUFBO0FBQUFBLFlBQWhCO0FBQ0FMLEVBQUFBLEVBQUUsQ0FBQ00sU0FBSDtBQUFlQTtBQUFBQTtBQUFBQTtBQUFBQSxZQUFmO0FBQ0FOLEVBQUFBLEVBQUUsQ0FBQ0csS0FBSCxHQUFXQSxLQUFYO0FBQ0FILEVBQUFBLEVBQUUsQ0FBQ08sZ0JBQUgsR0FBc0JKLEtBQUssQ0FBQ0ksZ0JBQTVCO0FBRUFQLEVBQUFBLEVBQUUsQ0FBQ1EsRUFBSCxHQUFRQyxPQUFSOztBQUNBVCxFQUFBQSxFQUFFLENBQUNVLFFBQUgsR0FBYyxVQUFTQyxJQUFULEVBQWU7QUFDM0IsV0FBT0YsT0FBTyxDQUFDQyxRQUFSLENBQWlCQyxJQUFqQixFQUF1QlgsRUFBdkIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT0EsRUFBUDtBQUNEOztBQUVELElBQUlZLElBQUksR0FBR2IsTUFBTSxFQUFqQjtBQUNBYSxJQUFJLENBQUNiLE1BQUwsR0FBY0EsTUFBZDs7QUFFQTtBQUFBO0FBQUFjO0FBQUFBO0FBQUFBO0FBQUFBLFlBQVdELElBQVg7QUFFQUEsSUFBSSxDQUFDLFNBQUQsQ0FBSixHQUFrQkEsSUFBbEI7OztlQUVlQSxJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuL2hhbmRsZWJhcnMvYmFzZSc7XG5cbi8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cbi8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG5pbXBvcnQgU2FmZVN0cmluZyBmcm9tICcuL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuL2hhbmRsZWJhcnMvZXhjZXB0aW9uJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vaGFuZGxlYmFycy91dGlscyc7XG5pbXBvcnQgKiBhcyBydW50aW1lIGZyb20gJy4vaGFuZGxlYmFycy9ydW50aW1lJztcblxuaW1wb3J0IG5vQ29uZmxpY3QgZnJvbSAnLi9oYW5kbGViYXJzL25vLWNvbmZsaWN0JztcblxuLy8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG5mdW5jdGlvbiBjcmVhdGUoKSB7XG4gIGxldCBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG4gIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG4gIGhiLlNhZmVTdHJpbmcgPSBTYWZlU3RyaW5nO1xuICBoYi5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGhiLlV0aWxzID0gVXRpbHM7XG4gIGhiLmVzY2FwZUV4cHJlc3Npb24gPSBVdGlscy5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIGhiLlZNID0gcnVudGltZTtcbiAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuICB9O1xuXG4gIHJldHVybiBoYjtcbn1cblxubGV0IGluc3QgPSBjcmVhdGUoKTtcbmluc3QuY3JlYXRlID0gY3JlYXRlO1xuXG5ub0NvbmZsaWN0KGluc3QpO1xuXG5pbnN0WydkZWZhdWx0J10gPSBpbnN0O1xuXG5leHBvcnQgZGVmYXVsdCBpbnN0O1xuIl19
