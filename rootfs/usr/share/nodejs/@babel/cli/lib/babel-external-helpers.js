"use strict";

function _commander() {
  const data = require("commander");
  _commander = function () {
    return data;
  };
  return data;
}
function _core() {
  const data = require("@babel/core");
  _core = function () {
    return data;
  };
  return data;
}
function collect(value, previousValue) {
  if (typeof value !== "string") return previousValue;
  const values = value.split(",");
  if (previousValue) {
    previousValue.push(...values);
    return previousValue;
  }
  return values;
}
_commander().program.option("-l, --whitelist [whitelist]", "Whitelist of helpers to ONLY include", collect);
_commander().program.option("-t, --output-type [type]", "Type of output (global|umd|var)", "global");
_commander().program.usage("[options]");
_commander().program.parse(process.argv);
console.log((0, _core().buildExternalHelpers)(_commander().program.whitelist, _commander().program.outputType));

//# sourceMappingURL=babel-external-helpers.js.map
