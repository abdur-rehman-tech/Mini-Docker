"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// 1. find to `exports.default`
// 2. find to all Expression(`exports.default`, `exports.foo` etc)
// 3. add `module.exports` if exists only `exports.default` assignment
// The above works after executing `preset-env`(transform-es2015-modules-*) in `Plugin.post`
module.exports = function (_ref) {
  var template = _ref.template;
  var pluginOptions;

  function addModuleExportsDefaults(path) {
    var finder = new ExportsFinder(path);

    if (!finder.isOnlyExportsDefault()) {
      return;
    }

    if (finder.isAmd()) {
      return;
    }

    var rootPath = finder.getRootPath(); // HACK: `path.node.body.push` instead of path.pushContainer(due doesn't work in Plugin.post)

    rootPath.node.body.push(template('module.exports = exports.default')());

    if (pluginOptions.addDefaultProperty) {
      rootPath.node.body.push(template('module.exports.default = exports.default')());
    }
  }

  var ExportsDefaultVisitor = {
    CallExpression: function CallExpression(path) {
      if (!path.get('callee').matchesPattern('Object.defineProperty')) {
        return;
      }

      var _path$get = path.get('arguments'),
          _path$get2 = _slicedToArray(_path$get, 2),
          identifier = _path$get2[0],
          prop = _path$get2[1];

      var objectName = identifier.get('name').node;
      var propertyName = prop.get('value').node;

      if ((objectName === 'exports' || objectName === '_exports') && propertyName === 'default') {
        addModuleExportsDefaults(path);
      }
    },
    AssignmentExpression: function AssignmentExpression(path) {
      if (path.get('left').matchesPattern('exports.default') || path.get('left').matchesPattern('_exports.default')) {
        addModuleExportsDefaults(path);
      }
    }
  };
  return {
    visitor: {
      Program: function Program(path, state) {
        // HACK: can't get plugin options in Plugin.post
        pluginOptions = state.opts;
      }
    },
    post: function post(fileMap) {
      fileMap.path.traverse(ExportsDefaultVisitor);
    }
  };
};

var ExportsFinder = /*#__PURE__*/function () {
  function ExportsFinder(exportsDefaultPath) {
    _classCallCheck(this, ExportsFinder);

    this.path = exportsDefaultPath;
    this.hasExportsDefault = false;
    this.hasExportsNamed = false;
    this.hasModuleExports = false;
  }

  _createClass(ExportsFinder, [{
    key: "getRootPath",
    value: function getRootPath() {
      return this.path.findParent(function (path) {
        return path.key === 'body' || !path.parentPath;
      });
    }
  }, {
    key: "isOnlyExportsDefault",
    value: function isOnlyExportsDefault() {
      var _this = this;

      this.getRootPath().get('body').forEach(function (path) {
        if (path.isVariableDeclaration()) {
          _this.findExports(path.get('declarations.0'), 'init');
        } else if (path.isExpressionStatement() && path.get('expression').isAssignmentExpression()) {
          _this.findExports(path);
        } else {
          _this.findExportsInCallExpression(path);
        }
      });
      return this.hasExportsDefault && !this.hasExportsNamed && !this.hasModuleExports;
    }
  }, {
    key: "findExports",
    value: function findExports(path) {
      var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'expression';

      // Not `exports.anything`, skip
      if (!path.get("".concat(property)).node || !path.get("".concat(property, ".left")).node || !path.get("".concat(property, ".left.object")).node) {
        return;
      }

      var objectName = path.get("".concat(property, ".left.object.name")).node; // Check name of  MemberExpressions and values of StringLiterals

      var propertyName = path.get("".concat(property, ".left.property.name")).node || path.get("".concat(property, ".left.property.value")).node;

      if (objectName === 'exports' || objectName === '_exports') {
        if (propertyName === 'default') {
          this.hasExportsDefault = true;
          this.findExports(path.get(property), 'right');
        } else if (propertyName !== '__esModule') {
          this.hasExportsNamed = true;
        }
      }

      if ("".concat(objectName, ".").concat(propertyName) === 'module.exports') {
        this.hasModuleExports = true;
      }
    }
  }, {
    key: "findExportsInCallExpression",
    value: function findExportsInCallExpression(path) {
      var self = this;
      path.traverse({
        CallExpression: function CallExpression(path) {
          if (!path.get('callee').matchesPattern('Object.defineProperty')) {
            return;
          }

          var _path$get3 = path.get('arguments'),
              _path$get4 = _slicedToArray(_path$get3, 2),
              identifier = _path$get4[0],
              prop = _path$get4[1];

          var objectName = identifier.get('name').node;
          var propertyName = prop.get('value').node;

          if ((objectName === 'exports' || objectName === '_exports') && propertyName !== '__esModule') {
            if (propertyName === 'default') {
              self.hasExportsDefault = true;
            } else {
              self.hasExportsNamed = true;
            }
          }
        }
      });
    }
  }, {
    key: "isAmd",
    value: function isAmd() {
      var rootPath = this.getRootPath();
      var hasntAmdRoot = !(rootPath.parentPath && rootPath.parentPath.parentPath);

      if (hasntAmdRoot) {
        return false;
      }

      var amdRoot = rootPath.parentPath.parentPath;

      if (!amdRoot.isCallExpression()) {
        return false;
      }

      if (amdRoot.get('callee.name').node === 'define') {
        return true;
      }

      return false;
    }
  }]);

  return ExportsFinder;
}();
//# sourceMappingURL=index.js.map