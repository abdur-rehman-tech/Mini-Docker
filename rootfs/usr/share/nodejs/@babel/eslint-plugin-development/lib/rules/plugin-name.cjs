const isBabelPluginFactory = require("../utils/is-babel-plugin-factory.cjs");
function getReturnValue(node) {
  const {
    body
  } = node;
  if (body.type === "BlockStatement") {
    const returnNode = body.body.find(n => n.type === "ReturnStatement");
    return returnNode && returnNode.argument;
  }
  return body;
}
module.exports = {
  meta: {
    schema: []
  },
  create(context) {
    let pluginFound = false;
    return {
      FunctionDeclaration: functionVisitor,
      FunctionExpression: functionVisitor,
      ArrowFunctionExpression: functionVisitor,
      "Program:exit"(node) {
        if (!pluginFound) {
          context.report(node, "This file does not export a Babel plugin.");
        }
      }
    };
    function functionVisitor(node) {
      if (!isBabelPluginFactory(node, context.getScope())) return;
      const returnValue = getReturnValue(node);
      if (!returnValue || returnValue.type !== "ObjectExpression") return;
      pluginFound = true;
      if (!returnValue.properties.some(p => p.key.name === "name")) {
        context.report(returnValue, "This Babel plugin doesn't have a 'name' property.");
      }
    }
  }
};

//# sourceMappingURL=plugin-name.cjs.map
