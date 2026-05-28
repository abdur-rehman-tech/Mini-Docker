"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _wastParser = require("@webassemblyjs/wast-parser");
var _wastPrinter = require("@webassemblyjs/wast-printer");
function _default(content) {
  var ast = (0, _wastParser.parse)(content);
  return (0, _wastPrinter.print)(ast);
}