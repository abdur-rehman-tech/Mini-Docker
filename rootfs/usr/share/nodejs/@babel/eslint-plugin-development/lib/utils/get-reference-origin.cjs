module.exports = function getReferenceOrigin(node, scope) {
  if (node.type === "Identifier") {
    const variable = getVariableDefinition(node.name, scope);
    if (!variable) return null;
    const definition = variable.definition;
    const defNode = definition.node;
    if (definition.type === "ImportBinding") {
      if (defNode.type === "ImportSpecifier") {
        return {
          kind: "import",
          source: definition.parent.source.value,
          name: defNode.imported.name
        };
      }
      if (defNode.type === "ImportNamespaceSpecifier") {
        return {
          kind: "import *",
          source: definition.parent.source.value
        };
      }
    }
    if (definition.type === "Variable" && defNode.init) {
      const origin = getReferenceOrigin(defNode.init, variable.scope);
      return origin && patternToProperty(definition.name, origin);
    }
    if (definition.type === "Parameter") {
      return patternToProperty(definition.name, {
        kind: "param",
        index: definition.index,
        functionNode: definition.node
      });
    }
  }
  if (node.type === "MemberExpression" && !node.computed) {
    const origin = getReferenceOrigin(node.object, scope);
    return origin && addProperty(origin, node.property.name);
  }
  return null;
};
function getVariableDefinition(name, scope) {
  let currentScope = scope;
  do {
    const variable = currentScope.set.get(name);
    if (variable && variable.defs[0]) {
      return {
        scope: currentScope,
        definition: variable.defs[0]
      };
    }
  } while (currentScope = currentScope.upper);
}
function patternToProperty(id, base) {
  const path = getPatternPath(id);
  return path && path.reduce(addProperty, base);
}
function addProperty(origin, name) {
  if (origin.kind === "import *") {
    return {
      kind: "import",
      source: origin.source,
      name
    };
  }
  if (origin.kind === "property") {
    return {
      kind: "property",
      base: origin.base,
      path: origin.path + "." + name,
      name
    };
  }
  return {
    kind: "property",
    base: origin,
    path: name,
    name
  };
}
function getPatternPath(node) {
  let current = node;
  const path = [];
  do {
    const property = current.parent;
    if (property.type === "ArrayPattern" || property.type === "AssignmentPattern" || property.computed) {
      return null;
    }
    if (property.type === "Property") {
      path.unshift(property.key.name);
    } else {
      break;
    }
  } while (current = current.parent.parent);
  return path;
}

//# sourceMappingURL=get-reference-origin.cjs.map
