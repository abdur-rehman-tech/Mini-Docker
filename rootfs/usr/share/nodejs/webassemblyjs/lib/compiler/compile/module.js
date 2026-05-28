"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Module = void 0;
exports.createCompiledModule = createCompiledModule;
var _wastIdentifierToIndex = require("@webassemblyjs/ast/lib/transform/wast-identifier-to-index");
var _denormalizeTypeReferences = require("@webassemblyjs/ast/lib/transform/denormalize-type-references");
var _helperCompiler = require("@webassemblyjs/helper-compiler");
var _validation = _interopRequireDefault(require("@webassemblyjs/validation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var t = require("@webassemblyjs/ast");
var Module = /*#__PURE__*/_createClass(function Module(ir, ast, exports, imports) {
  _classCallCheck(this, Module);
  this._ir = ir;
  this._ast = ast;
  this.exports = exports;
  this.imports = imports;
});
exports.Module = Module;
function createCompiledModule(ast) {
  var exports = [];
  var imports = [];

  // Do compile-time ast manipulation in order to remove WAST
  // semantics during execution
  (0, _denormalizeTypeReferences.transform)(ast);
  (0, _wastIdentifierToIndex.transform)(ast);
  (0, _validation["default"])(ast);
  t.traverse(ast, {
    ModuleExport: function (_ModuleExport) {
      function ModuleExport(_x) {
        return _ModuleExport.apply(this, arguments);
      }
      ModuleExport.toString = function () {
        return _ModuleExport.toString();
      };
      return ModuleExport;
    }(function (_ref) {
      var node = _ref.node;
      if (node.descr.exportType === "Func") {
        exports.push({
          name: node.name,
          kind: "function"
        });
      }
    })
  });

  /**
   * Compile
   */
  var ir = (0, _helperCompiler.toIR)(ast);
  return new Module(ir, ast, exports, imports);
}