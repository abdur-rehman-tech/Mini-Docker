const getReferenceOrigin = require("./get-reference-origin.cjs");
const getExportName = require("./get-export-name.cjs");
module.exports = function isBabelPluginFactory(node, scope) {
  const {
    parent
  } = node;
  if (parent.type === "CallExpression") {
    const calleeOrigin = getReferenceOrigin(parent.callee, scope);
    return !!(calleeOrigin && calleeOrigin.kind === "import" && calleeOrigin.name === "declare" && calleeOrigin.source === "@babel/helper-plugin-utils");
  }
  const exportName = getExportName(node);
  return exportName === "default" || exportName === "module.exports";
};

//# sourceMappingURL=is-babel-plugin-factory.cjs.map
