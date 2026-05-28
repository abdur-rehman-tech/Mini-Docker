"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DynamicImportKey = void 0;
exports.default = dynamicImport;
var _acorn = require("acorn");
/* eslint-disable no-underscore-dangle */

const DynamicImportKey = 'Import';

// NOTE: This allows `yield import()` to parse correctly.
exports.DynamicImportKey = DynamicImportKey;
_acorn.tokTypes._import.startsExpr = true;
function parseDynamicImport() {
  const node = this.startNode();
  this.next();
  if (this.type !== _acorn.tokTypes.parenL) {
    this.unexpected();
  }
  return this.finishNode(node, DynamicImportKey);
}
function parenAfter() {
  return /^(\s|\/\/.*|\/\*[^]*?\*\/)*\(/.test(this.input.slice(this.pos));
}
function dynamicImport(Parser) {
  return class extends Parser {
    parseStatement(context, topLevel, exports) {
      if (this.type === _acorn.tokTypes._import && parenAfter.call(this)) {
        return this.parseExpressionStatement(this.startNode(), this.parseExpression());
      }
      return super.parseStatement(context, topLevel, exports);
    }
    parseExprAtom(refDestructuringErrors) {
      if (this.type === _acorn.tokTypes._import) {
        return parseDynamicImport.call(this);
      }
      return super.parseExprAtom(refDestructuringErrors);
    }
  };
}