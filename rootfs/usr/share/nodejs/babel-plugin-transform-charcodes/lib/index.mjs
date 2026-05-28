import * as charcodes from "charcodes";
import { parse } from "@babel/parser";
import traverse from '@babel/traverse';
export default function (babel) {
  var t = babel.types;
  function parseFunctionSource(str) {
    var root = parse(str, {
      sourceType: 'script'
    });
    return root.program.body[0];
  }
  function createInlineFunction(func, id) {
    traverse(func, {
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
