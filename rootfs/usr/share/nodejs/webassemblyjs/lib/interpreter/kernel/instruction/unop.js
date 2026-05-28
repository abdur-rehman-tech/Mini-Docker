"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unopf32 = unopf32;
exports.unopf64 = unopf64;
exports.unopi32 = unopi32;
exports.unopi64 = unopi64;
var i32 = _interopRequireWildcard(require("../../runtime/values/i32"));
var i64 = _interopRequireWildcard(require("../../runtime/values/i64"));
var f32 = _interopRequireWildcard(require("../../runtime/values/f32"));
var f64 = _interopRequireWildcard(require("../../runtime/values/f64"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// https://webassembly.github.io/spec/core/exec/instructions.html#exec-binop
function unop(_ref, operation, createValue) {
  var value = _ref.value;
  switch (operation) {
    case "abs":
      return createValue(value.abs());
    case "neg":
      return createValue(value.neg());
    case "clz":
      return createValue(value.clz());
    case "ctz":
      return createValue(value.ctz());
    case "popcnt":
      return createValue(value.popcnt());
    case "eqz":
      return i32.createValue(value.eqz());
    case "reinterpret/f32":
      return i32.createValue(value.reinterpret());
    case "reinterpret/f64":
      return i64.createValue(value.reinterpret());
  }
  throw new Error("Unsupported unop: " + operation);
}
function unopi32(c, operation) {
  return unop(c, operation, i32.createValue);
}
function unopi64(c, operation) {
  return unop(c, operation, i64.createValue);
}
function unopf32(c, operation) {
  return unop(c, operation, f32.createValue);
}
function unopf64(c, operation) {
  return unop(c, operation, f64.createValue);
}