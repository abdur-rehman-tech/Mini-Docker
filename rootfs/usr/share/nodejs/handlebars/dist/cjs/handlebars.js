/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var
/*istanbul ignore next*/
_handlebars = _interopRequireDefault(require("./handlebars.runtime"));

var
/*istanbul ignore next*/
_ast = _interopRequireDefault(require("./handlebars/compiler/ast"));

var
/*istanbul ignore next*/
_base = require("./handlebars/compiler/base");

var
/*istanbul ignore next*/
_compiler = require("./handlebars/compiler/compiler");

var
/*istanbul ignore next*/
_javascriptCompiler = _interopRequireDefault(require("./handlebars/compiler/javascript-compiler"));

var
/*istanbul ignore next*/
_visitor = _interopRequireDefault(require("./handlebars/compiler/visitor"));

var
/*istanbul ignore next*/
_noConflict = _interopRequireDefault(require("./handlebars/no-conflict"));

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Compiler imports
var _create =
/*istanbul ignore next*/
_handlebars[
/*istanbul ignore next*/
"default"].create;

function create() {
  var hb = _create();

  hb.compile = function (input, options) {
    return (
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _compiler.
      /*istanbul ignore next*/
      compile)(input, options, hb)
    );
  };

  hb.precompile = function (input, options) {
    return (
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _compiler.
      /*istanbul ignore next*/
      precompile)(input, options, hb)
    );
  };

  hb.AST =
  /*istanbul ignore next*/
  _ast[
  /*istanbul ignore next*/
  "default"];
  hb.Compiler =
  /*istanbul ignore next*/
  _compiler.
  /*istanbul ignore next*/
  Compiler;
  hb.JavaScriptCompiler =
  /*istanbul ignore next*/
  _javascriptCompiler[
  /*istanbul ignore next*/
  "default"];
  hb.Parser =
  /*istanbul ignore next*/
  _base.
  /*istanbul ignore next*/
  parser;
  hb.parse =
  /*istanbul ignore next*/
  _base.
  /*istanbul ignore next*/
  parse;
  hb.parseWithoutProcessing =
  /*istanbul ignore next*/
  _base.
  /*istanbul ignore next*/
  parseWithoutProcessing;
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
inst.Visitor =
/*istanbul ignore next*/
_visitor[
/*istanbul ignore next*/
"default"];
inst['default'] = inst;

/*istanbul ignore next*/
var _default = inst;

/*istanbul ignore next*/
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9oYW5kbGViYXJzLmpzIl0sIm5hbWVzIjpbIl9jcmVhdGUiLCJydW50aW1lIiwiY3JlYXRlIiwiaGIiLCJjb21waWxlIiwiaW5wdXQiLCJvcHRpb25zIiwicHJlY29tcGlsZSIsIkFTVCIsIkNvbXBpbGVyIiwiSmF2YVNjcmlwdENvbXBpbGVyIiwiUGFyc2VyIiwicGFyc2UiLCJwYXJzZVdpdGhvdXRQcm9jZXNzaW5nIiwiaW5zdCIsIm5vQ29uZmxpY3QiLCJWaXNpdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQUE7QUFBQTs7QUFHQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUtBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUVBO0FBQUE7QUFBQTs7OztBQVhBO0FBYUEsSUFBSUEsT0FBTztBQUFHQztBQUFBQTtBQUFBQTtBQUFBQSxXQUFRQyxNQUF0Qjs7QUFDQSxTQUFTQSxNQUFULEdBQWtCO0FBQ2hCLE1BQUlDLEVBQUUsR0FBR0gsT0FBTyxFQUFoQjs7QUFFQUcsRUFBQUEsRUFBRSxDQUFDQyxPQUFILEdBQWEsVUFBU0MsS0FBVCxFQUFnQkMsT0FBaEIsRUFBeUI7QUFDcEMsV0FBTztBQUFBO0FBQUE7QUFBQUY7QUFBQUE7QUFBQUE7QUFBQUEsZUFBUUMsS0FBUixFQUFlQyxPQUFmLEVBQXdCSCxFQUF4QjtBQUFQO0FBQ0QsR0FGRDs7QUFHQUEsRUFBQUEsRUFBRSxDQUFDSSxVQUFILEdBQWdCLFVBQVNGLEtBQVQsRUFBZ0JDLE9BQWhCLEVBQXlCO0FBQ3ZDLFdBQU87QUFBQTtBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLGtCQUFXRixLQUFYLEVBQWtCQyxPQUFsQixFQUEyQkgsRUFBM0I7QUFBUDtBQUNELEdBRkQ7O0FBSUFBLEVBQUFBLEVBQUUsQ0FBQ0ssR0FBSDtBQUFTQTtBQUFBQTtBQUFBQTtBQUFBQSxZQUFUO0FBQ0FMLEVBQUFBLEVBQUUsQ0FBQ00sUUFBSDtBQUFjQTtBQUFBQTtBQUFBQTtBQUFBQSxVQUFkO0FBQ0FOLEVBQUFBLEVBQUUsQ0FBQ08sa0JBQUg7QUFBd0JBO0FBQUFBO0FBQUFBO0FBQUFBLFlBQXhCO0FBQ0FQLEVBQUFBLEVBQUUsQ0FBQ1EsTUFBSDtBQUFZQTtBQUFBQTtBQUFBQTtBQUFBQSxRQUFaO0FBQ0FSLEVBQUFBLEVBQUUsQ0FBQ1MsS0FBSDtBQUFXQTtBQUFBQTtBQUFBQTtBQUFBQSxPQUFYO0FBQ0FULEVBQUFBLEVBQUUsQ0FBQ1Usc0JBQUg7QUFBNEJBO0FBQUFBO0FBQUFBO0FBQUFBLHdCQUE1QjtBQUVBLFNBQU9WLEVBQVA7QUFDRDs7QUFFRCxJQUFJVyxJQUFJLEdBQUdaLE1BQU0sRUFBakI7QUFDQVksSUFBSSxDQUFDWixNQUFMLEdBQWNBLE1BQWQ7O0FBRUE7QUFBQTtBQUFBYTtBQUFBQTtBQUFBQTtBQUFBQSxZQUFXRCxJQUFYO0FBRUFBLElBQUksQ0FBQ0UsT0FBTDtBQUFlQTtBQUFBQTtBQUFBQTtBQUFBQSxVQUFmO0FBRUFGLElBQUksQ0FBQyxTQUFELENBQUosR0FBa0JBLElBQWxCOzs7ZUFFZUEsSSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBydW50aW1lIGZyb20gJy4vaGFuZGxlYmFycy5ydW50aW1lJztcblxuLy8gQ29tcGlsZXIgaW1wb3J0c1xuaW1wb3J0IEFTVCBmcm9tICcuL2hhbmRsZWJhcnMvY29tcGlsZXIvYXN0JztcbmltcG9ydCB7XG4gIHBhcnNlciBhcyBQYXJzZXIsXG4gIHBhcnNlLFxuICBwYXJzZVdpdGhvdXRQcm9jZXNzaW5nXG59IGZyb20gJy4vaGFuZGxlYmFycy9jb21waWxlci9iYXNlJztcbmltcG9ydCB7IENvbXBpbGVyLCBjb21waWxlLCBwcmVjb21waWxlIH0gZnJvbSAnLi9oYW5kbGViYXJzL2NvbXBpbGVyL2NvbXBpbGVyJztcbmltcG9ydCBKYXZhU2NyaXB0Q29tcGlsZXIgZnJvbSAnLi9oYW5kbGViYXJzL2NvbXBpbGVyL2phdmFzY3JpcHQtY29tcGlsZXInO1xuaW1wb3J0IFZpc2l0b3IgZnJvbSAnLi9oYW5kbGViYXJzL2NvbXBpbGVyL3Zpc2l0b3InO1xuXG5pbXBvcnQgbm9Db25mbGljdCBmcm9tICcuL2hhbmRsZWJhcnMvbm8tY29uZmxpY3QnO1xuXG5sZXQgX2NyZWF0ZSA9IHJ1bnRpbWUuY3JlYXRlO1xuZnVuY3Rpb24gY3JlYXRlKCkge1xuICBsZXQgaGIgPSBfY3JlYXRlKCk7XG5cbiAgaGIuY29tcGlsZSA9IGZ1bmN0aW9uKGlucHV0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGNvbXBpbGUoaW5wdXQsIG9wdGlvbnMsIGhiKTtcbiAgfTtcbiAgaGIucHJlY29tcGlsZSA9IGZ1bmN0aW9uKGlucHV0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHByZWNvbXBpbGUoaW5wdXQsIG9wdGlvbnMsIGhiKTtcbiAgfTtcblxuICBoYi5BU1QgPSBBU1Q7XG4gIGhiLkNvbXBpbGVyID0gQ29tcGlsZXI7XG4gIGhiLkphdmFTY3JpcHRDb21waWxlciA9IEphdmFTY3JpcHRDb21waWxlcjtcbiAgaGIuUGFyc2VyID0gUGFyc2VyO1xuICBoYi5wYXJzZSA9IHBhcnNlO1xuICBoYi5wYXJzZVdpdGhvdXRQcm9jZXNzaW5nID0gcGFyc2VXaXRob3V0UHJvY2Vzc2luZztcblxuICByZXR1cm4gaGI7XG59XG5cbmxldCBpbnN0ID0gY3JlYXRlKCk7XG5pbnN0LmNyZWF0ZSA9IGNyZWF0ZTtcblxubm9Db25mbGljdChpbnN0KTtcblxuaW5zdC5WaXNpdG9yID0gVmlzaXRvcjtcblxuaW5zdFsnZGVmYXVsdCddID0gaW5zdDtcblxuZXhwb3J0IGRlZmF1bHQgaW5zdDtcbiJdfQ==
