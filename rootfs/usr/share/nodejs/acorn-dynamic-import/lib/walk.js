"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inject;
var _index = require("./index");
function inject(injectableWalk) {
  return Object.assign({}, injectableWalk, {
    base: Object.assign({}, injectableWalk.base, {
      [_index.DynamicImportKey]() {}
    })
  });
}