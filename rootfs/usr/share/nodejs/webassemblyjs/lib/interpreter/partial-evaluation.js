"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluate = evaluate;
var _helperCompiler = require("@webassemblyjs/helper-compiler");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var t = require("@webassemblyjs/ast");
var _require = require("./kernel/exec"),
  executeStackFrame = _require.executeStackFrame;
var _require2 = require("./kernel/stackframe"),
  createStackFrame = _require2.createStackFrame;
var modulevalue = require("./runtime/values/module");
function evaluate(allocator, code) {
  var ir = (0, _helperCompiler.listOfInstructionsToIr)(code);

  // Create an empty module instance for the context
  var moduleInstance = modulevalue.createInstance(ir, allocator, t.module(undefined, []));
  var stackFrame = createStackFrame([], moduleInstance, allocator);
  var main = ir.funcTable.find(function (f) {
    return f.name === "main";
  });
  if (!(_typeof(main) === "object")) {
    throw new Error('typeof main === "object"' + " error: " + (undefined || "unknown"));
  }
  return executeStackFrame(ir, main.startAt, stackFrame);
}