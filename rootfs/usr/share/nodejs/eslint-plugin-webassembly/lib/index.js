"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configs = void 0;
Object.defineProperty(exports, "rules", {
  enumerable: true,
  get: function get() {
    return _rules["default"];
  }
});
var _rules = _interopRequireDefault(require("./rules"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var configs = {
  recommended: {
    rules: {
      "webassembly/no-unknown-export": 2 // error
    }
  }
};
exports.configs = configs;