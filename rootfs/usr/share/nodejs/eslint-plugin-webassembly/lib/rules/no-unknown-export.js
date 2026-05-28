"use strict";

var _ast = require("@webassemblyjs/ast");
var _wasmParser = require("@webassemblyjs/wasm-parser");
var _path = _interopRequireDefault(require("path"));
var _fs = require("fs");
var _estraverse = require("estraverse");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var decoderOpts = {
  ignoreCodeSection: true,
  ignoreDataSection: true
};
function getExportsFromWasm(file) {
  var exports = [];
  var binary = (0, _fs.readFileSync)(file, null);
  var ast = (0, _wasmParser.decode)(binary, decoderOpts);
  (0, _ast.traverse)(ast, {
    ModuleExport: function ModuleExport(_ref) {
      var node = _ref.node;
      exports.push(node.name);
    }
  });
  return exports;
}
function getUsageIn(body, on) {
  var used = [];
  (0, _estraverse.traverse)(body, {
    enter: function enter(node) {
      if (node.type === "MemberExpression") {
        var object = node.object,
          property = node.property;
        if (object.name === on) {
          used.push(property.name);
        }
      }
    }
  });
  return used;
}
module.exports = {
  create: function create(context) {
    return {
      /**
       * `import(x).then(f)`
       */
      MemberExpression: function MemberExpression(node) {
        var object = node.object,
          property = node.property;
        if (object.type !== "CallExpression") {
          return;
        }
        if (object.callee.type !== "Import") {
          return;
        }
        if (property.name !== "then") {
          return;
        }
        var dirname = _path["default"].dirname(context.getFilename());
        var source = object.arguments[0].value;
        var file = _path["default"].join(dirname, source);
        if ((0, _fs.existsSync)(file) === false) {
          return context.report({
            node: object,
            message: JSON.stringify(file) + " is not a valid WASM file"
          });
        }
        var exports = getExportsFromWasm(file);

        // get binding in `then(x)`
        var _node$parent$argument = _slicedToArray(node.parent.arguments, 1),
          fn = _node$parent$argument[0];
        var _fn$params = _slicedToArray(fn.params, 1),
          binding = _fn$params[0];
        var used = [];
        if (binding.type === "Identifier") {
          used = getUsageIn(fn.body, binding.name);
        }
        if (binding.type === "ObjectPattern") {
          used = binding.properties.map(function (prop) {
            return prop.value.name;
          });
        }
        used.forEach(function (name) {
          var exportExists = exports.indexOf(name) !== -1;
          if (exportExists === false) {
            context.report({
              node: node,
              message: JSON.stringify(name) + " is not exported"
            });
          }
        });
      }
    };
  }
};