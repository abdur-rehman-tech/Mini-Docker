"use strict";

exports.__esModule = true;
exports.default = lodash;
var _get2 = _interopRequireDefault(require("lodash/get"));
var _sortBy2 = _interopRequireDefault(require("lodash/sortBy"));
var _each2 = _interopRequireDefault(require("lodash/each"));
var _assign3 = _interopRequireDefault(require("lodash/assign"));
var _types = require("@babel/types");
var _config = _interopRequireDefault(require("./config"));
var _importModule3 = _interopRequireDefault(require("./importModule"));
var _mapping = _interopRequireDefault(require("./mapping"));
var _Store = _interopRequireDefault(require("./Store"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/** The error message used when chain sequences are detected. */
var CHAIN_ERROR = ['Lodash chain sequences are not supported by babel-plugin-lodash.', 'Consider substituting chain sequences with composition patterns.', 'See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba'].join('\n');

/*----------------------------------------------------------------------------*/

function lodash(_ref) {
  var types = _ref.types;
  var identifiers = {
    'PLACEHOLDER': types.identifier('placeholder'),
    'UNDEFINED': types.identifier('undefined')
  };

  /**
   * Used to track variables built during the AST pass. We instantiate these in
   * the `Program` visitor in order to support running the plugin in watch mode
   * or on multiple files.
   *
   * @type Store
   */
  var store = new _Store.default();
  function getCallee(_ref2) {
    var parentPath = _ref2.parentPath;
    // Trace curried calls to their origin, e.g. `fp.partial(func)([fp, 2])(1)`.
    while (!parentPath.isStatement()) {
      if (parentPath.isCallExpression()) {
        var result = parentPath.node.callee;
        while (types.isCallExpression(result)) {
          result = result.callee;
        }
        return result;
      }
      parentPath = parentPath.parentPath;
    }
  }

  /*--------------------------------------------------------------------------*/

  var visitor = {
    Program(path, state) {
      var _assign2 = (0, _assign3.default)(_mapping.default, (0, _config.default)(state.opts)),
        ids = _assign2.ids;
      var file = path.hub.file;

      // Clear tracked method imports.
      _importModule3.default.cache.clear();
      store.clear();

      // Populate module paths per package.
      (0, _each2.default)(ids, function (id) {
        store.set(id);
        _mapping.default.modules.get(id).forEach(function (value, key) {
          store.set(id + '/' + key);
        });
      });
      var imports = [];
      var isModule = false;
      for (var _iterator = _createForOfIteratorHelperLoose(file.ast.program.body), _step; !(_step = _iterator()).done;) {
        var node = _step.value;
        if ((0, _types.isModuleDeclaration)(node)) {
          isModule = true;
          break;
        }
      }
      if (isModule) {
        file.path.traverse({
          ImportDeclaration: {
            exit(path) {
              var node = path.node;
              var imported = [];
              var specifiers = [];
              imports.push({
                source: node.source.value,
                imported,
                specifiers
              });
              for (var _iterator2 = _createForOfIteratorHelperLoose(path.get("specifiers")), _step2; !(_step2 = _iterator2()).done;) {
                var specifier = _step2.value;
                var local = specifier.node.local.name;
                if (specifier.isImportDefaultSpecifier()) {
                  imported.push("default");
                  specifiers.push({
                    kind: "named",
                    imported: "default",
                    local
                  });
                }
                if (specifier.isImportSpecifier()) {
                  var importedName = specifier.node.imported.name;
                  imported.push(importedName);
                  specifiers.push({
                    kind: "named",
                    imported: importedName,
                    local
                  });
                }
                if (specifier.isImportNamespaceSpecifier()) {
                  imported.push("*");
                  specifiers.push({
                    kind: "namespace",
                    local
                  });
                }
              }
            }
          }
        });
      }

      // Replace old members with their method imports.
      (0, _each2.default)(imports, function (module) {
        var pkgStore = store.get(module.source);
        if (!pkgStore) {
          return;
        }
        var isLodash = pkgStore.isLodash();
        var specs = (0, _sortBy2.default)(module.specifiers, function (spec) {
          return spec.imported === 'default';
        });
        (0, _each2.default)(specs, function (spec) {
          var imported = spec.imported,
            local = spec.local;
          var binding = file.scope.getBinding(local);
          var _binding$path$parent$ = binding.path.parent.importKind,
            importKind = _binding$path$parent$ === void 0 ? 'value' : _binding$path$parent$;

          // Skip type annotation imports.
          if (importKind != 'value') {
            return;
          }
          var isChain = isLodash && imported === 'chain';
          (0, _each2.default)(binding.referencePaths, function (refPath) {
            var node = refPath.node,
              parentPath = refPath.parentPath;
            var type = node.type;
            if (imported && imported !== 'default') {
              if (isChain && refPath.parentPath.isCallExpression()) {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }
              var _importModule = (0, _importModule3.default)(pkgStore, imported, refPath),
                name = _importModule.name;
              refPath.replaceWith({
                type,
                name
              });
            } else if (parentPath.isMemberExpression()) {
              var key = refPath.parent.property.name;
              if (isLodash && key === 'chain' && parentPath.parentPath.isCallExpression()) {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }
              var _importModule2 = (0, _importModule3.default)(pkgStore, key, refPath),
                _name = _importModule2.name;
              parentPath.replaceWith({
                type,
                name: _name
              });
            } else if (isLodash) {
              var callee = getCallee(refPath);
              if (callee && callee.name === local) {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }
              refPath.replaceWith(callee ? types.memberExpression(callee, identifiers.PLACEHOLDER) : identifiers.UNDEFINED);
            }
          });
        });
      });
    },
    ImportDeclaration(path) {
      if (store.get(path.node.source.value)) {
        // Remove old import.
        path.remove();
      }
    },
    ExportNamedDeclaration(path) {
      var node = path.node;
      var pkgPath = (0, _get2.default)(node, 'source.value');
      var pkgStore = store.get(pkgPath);
      if (!pkgStore) {
        return;
      }
      node.source = null;
      (0, _each2.default)(node.specifiers, function (spec) {
        spec.local = (0, _importModule3.default)(pkgStore, spec.local.name, path);
      });
    }
  };
  return {
    visitor
  };
}
module.exports = exports.default;