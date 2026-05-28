"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = validateAST;
Object.defineProperty(exports, "getType", {
  enumerable: true,
  get: function get() {
    return _typeInference.getType;
  }
});
exports.getValidationErrors = getValidationErrors;
Object.defineProperty(exports, "isConst", {
  enumerable: true,
  get: function get() {
    return _isConst["default"];
  }
});
exports.stack = void 0;
Object.defineProperty(exports, "typeEq", {
  enumerable: true,
  get: function get() {
    return _typeInference.typeEq;
  }
});
var _importOrder = _interopRequireDefault(require("./import-order"));
var _isConst = _interopRequireDefault(require("./is-const"));
var _typeChecker = _interopRequireDefault(require("./type-checker"));
var _imports = _interopRequireDefault(require("./imports"));
var _duplicatedExports = _interopRequireDefault(require("./duplicated-exports"));
var _ast = require("@webassemblyjs/ast");
var _typeInference = require("./type-inference");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function validateAST(ast) {
  var errors = getValidationErrors(ast);
  if (errors.length !== 0) {
    var errorMessage = "Validation errors:\n" + errors.join("\n");
    throw new Error(errorMessage);
  }
}
function getValidationErrors(ast) {
  var errors = [];
  var modules = [];

  // $FlowIgnore
  if (ast.type === "Module") {
    modules = [ast];
  }

  // $FlowIgnore
  if (ast.type === "Program") {
    modules = ast.body.filter(function (_ref) {
      var type = _ref.type;
      return type === "Module";
    });
  }
  modules.forEach(function (m) {
    var moduleContext = (0, _ast.moduleContextFromModuleAST)(m);

    // $FlowIgnore
    errors.push.apply(errors, _toConsumableArray((0, _imports["default"])(ast, moduleContext)));
    errors.push.apply(errors, _toConsumableArray((0, _isConst["default"])(ast, moduleContext)));
    errors.push.apply(errors, _toConsumableArray((0, _importOrder["default"])(ast)));
    errors.push.apply(errors, _toConsumableArray((0, _typeChecker["default"])(ast, moduleContext)));
    errors.push.apply(errors, _toConsumableArray((0, _duplicatedExports["default"])(ast)));
  });
  return errors;
}
var stack = _typeChecker["default"];
exports.stack = stack;