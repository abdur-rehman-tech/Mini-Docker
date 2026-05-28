"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDynamicImportTransform = createDynamicImportTransform;
exports.getImportSource = getImportSource;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
function getImportSource(t, callNode) {
  var importArguments = callNode.arguments;
  var _importArguments = (0, _slicedToArray2["default"])(importArguments, 1),
    importPath = _importArguments[0];
  var isString = t.isStringLiteral(importPath) || t.isTemplateLiteral(importPath);
  if (isString) {
    t.removeComments(importPath);
    return importPath;
  }
  return t.templateLiteral([t.templateElement({
    raw: '',
    cooked: ''
  }), t.templateElement({
    raw: '',
    cooked: ''
  }, true)], importArguments);
}
function createDynamicImportTransform(_ref) {
  var template = _ref.template,
    t = _ref.types;
  var builders = {
    "static": {
      interop: template('Promise.resolve().then(() => INTEROP(require(SOURCE)))'),
      noInterop: template('Promise.resolve().then(() => require(SOURCE))')
    },
    dynamic: {
      interop: template('Promise.resolve(SOURCE).then(s => INTEROP(require(s)))'),
      noInterop: template('Promise.resolve(SOURCE).then(s => require(s))')
    }
  };
  var visited = typeof WeakSet === 'function' && new WeakSet();
  var isString = function isString(node) {
    return t.isStringLiteral(node) || t.isTemplateLiteral(node) && node.expressions.length === 0;
  };
  return function (context, path) {
    if (visited) {
      if (visited.has(path)) {
        return;
      }
      visited.add(path);
    }
    var SOURCE = getImportSource(t, path.parent);
    var builder = isString(SOURCE) ? builders["static"] : builders.dynamic;
    var newImport = context.opts.noInterop ? builder.noInterop({
      SOURCE: SOURCE
    }) : builder.interop({
      SOURCE: SOURCE,
      INTEROP: context.addHelper('interopRequireWildcard')
    });
    path.parentPath.replaceWith(newImport);
  };
}