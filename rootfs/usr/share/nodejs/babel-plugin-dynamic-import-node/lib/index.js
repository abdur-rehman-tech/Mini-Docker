"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _utils = require("./utils");
function _default(api) {
  var transformImport = (0, _utils.createDynamicImportTransform)(api);
  return {
    // NOTE: Once we drop support for Babel <= v6 we should
    // update this to import from @babel/plugin-syntax-dynamic-import.
    // https://www.npmjs.com/package/@babel/plugin-syntax-dynamic-import
    manipulateOptions: function manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push('dynamicImport');
    },
    visitor: {
      Import: function Import(path) {
        transformImport(this, path);
      }
    }
  };
}
module.exports = exports.default;