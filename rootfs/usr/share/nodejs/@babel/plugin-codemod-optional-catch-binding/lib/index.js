"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _pluginSyntaxOptionalCatchBinding = require("@babel/plugin-syntax-optional-catch-binding");
function _default({
  types: t
}) {
  return {
    inherits: _pluginSyntaxOptionalCatchBinding.default,
    visitor: {
      CatchClause(path) {
        if (path.node.param === null || !t.isIdentifier(path.node.param)) {
          return;
        }
        const binding = path.scope.getOwnBinding(path.node.param.name);
        if (binding.constantViolations.length > 0) {
          return;
        }
        if (!binding.referenced) {
          const paramPath = path.get("param");
          paramPath.remove();
        }
      }
    }
  };
}

//# sourceMappingURL=index.js.map
