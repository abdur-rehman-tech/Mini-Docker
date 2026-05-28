"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("@babel/helper-plugin-utils");
var _default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "syntax-import-reflection",
    manipulateOptions(_, parserOpts) {
      parserOpts.plugins.push("importReflection");
    }
  };
});
exports.default = _default;

//# sourceMappingURL=index.js.map
