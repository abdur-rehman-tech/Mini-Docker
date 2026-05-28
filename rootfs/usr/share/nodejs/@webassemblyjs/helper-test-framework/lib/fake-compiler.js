"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFakeLocsListOfInstructions = addFakeLocsListOfInstructions;
exports.compileASTNodes = compileASTNodes;
var _ast = require("@webassemblyjs/ast");
var _helperCompiler = require("@webassemblyjs/helper-compiler");
function addFakeLocsListOfInstructions(instrs) {
  var loc = function loc(x) {
    return {
      start: {
        column: x,
        line: -1
      },
      end: {
        column: x + 1,
        line: -1
      }
    };
  };
  instrs.forEach(function (instr, index) {
    instr.loc = loc(index);
  });
}
function compileASTNodes(nodes) {
  nodes.push((0, _ast.instruction)("end"));
  addFakeLocsListOfInstructions(nodes);
  return (0, _helperCompiler.listOfInstructionsToIr)(nodes);
}