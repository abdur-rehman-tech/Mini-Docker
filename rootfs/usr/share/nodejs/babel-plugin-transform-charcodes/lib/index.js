"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var charcodes = _interopRequireWildcard(require("charcodes"));
var _parser = require("@babel/parser");
var _traverse = _interopRequireDefault(require("@babel/traverse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _default(babel) {
  var t = babel.types;
  function parseFunctionSource(str) {
    var root = (0, _parser.parse)(str, {
      sourceType: 'script'
    });
    return root.program.body[0];
  }
  function createInlineFunction(func, id) {
    (0, _traverse["default"])(func, {
      noScope: true,
      Identifier: function Identifier(path) {
        var name = path.node.name;
        if (typeof charcodes[name] !== "undefined" && typeof charcodes[name] !== "function") {
          path.replaceWith(t.NumericLiteral(charcodes[name]));
        }
      }
    });
    return t.variableDeclaration('var', [t.variableDeclarator(id, t.toExpression(func))]);
  }
  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path, state) {
        if (path.node.source.value === "charcodes") {
          state.importedLocalName = path.node.specifiers[0].local.name;
          path.remove();
        }
      },
      MemberExpression: function MemberExpression(path, state) {
        if (typeof state.importedLocalName !== "undefined" && path.node.object.name == state.importedLocalName) {
          var rightName = path.node.property.name;
          var charCodeValue = charcodes[rightName];
          if (typeof charCodeValue === "undefined") {
            throw new Error("unknown key " + rightName);
          } else if (typeof charCodeValue !== "function") {
            path.replaceWith(t.NumericLiteral(charCodeValue));
          } else {
            var fn = parseFunctionSource(charCodeValue.toString());
            var id = path.scope.generateUidIdentifier(rightName);
            state._toHoist.push(createInlineFunction(fn, id));
            path.replaceWith(id);
          }
        }
      },
      Program: {
        enter: function enter(path, state) {
          state._toHoist = [];
        },
        exit: function exit(path, state) {
          state._toHoist.forEach(function (x) {
            path.node.body.unshift(x);
          });
        }
      }
    }
  };
}
