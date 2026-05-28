"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.codeFrameFromAst = codeFrameFromAst;
exports.codeFrameFromSource = codeFrameFromSource;
var _wastPrinter = require("@webassemblyjs/wast-printer");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var SHOW_LINES_AROUND_POINTER = 5;
function repeat(_char, nb) {
  return Array(nb).fill(_char).join("");
}

// TODO(sven): allow arbitrary ast nodes
function codeFrameFromAst(ast, loc) {
  return codeFrameFromSource((0, _wastPrinter.print)(ast), loc);
}
function codeFrameFromSource(source, loc) {
  var start = loc.start,
    end = loc.end;
  var length = 1;
  if (_typeof(end) === "object") {
    length = end.column - start.column + 1;
  }
  return source.split("\n").reduce(function (acc, line, lineNbr) {
    if (Math.abs(start.line - lineNbr) < SHOW_LINES_AROUND_POINTER) {
      acc += line + "\n";
    }

    // Add a new line with the pointer padded left
    if (lineNbr === start.line - 1) {
      acc += repeat(" ", start.column - 1);
      acc += repeat("^", length);
      acc += "\n";
    }
    return acc;
  }, "");
}