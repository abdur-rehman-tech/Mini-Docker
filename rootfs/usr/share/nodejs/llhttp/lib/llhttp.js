"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHeaders = exports.URL = exports.HTTP = exports.constants = void 0;
const constants_1 = __importDefault(require("./llhttp/constants"));
exports.constants = constants_1.default;
const http_1 = require("./llhttp/http");
Object.defineProperty(exports, "HTTP", { enumerable: true, get: function () { return http_1.HTTP; } });
const url_1 = require("./llhttp/url");
Object.defineProperty(exports, "URL", { enumerable: true, get: function () { return url_1.URL; } });
const c_headers_1 = require("./llhttp/c-headers");
Object.defineProperty(exports, "CHeaders", { enumerable: true, get: function () { return c_headers_1.CHeaders; } });
exports.default = {
    constants: constants_1.default,
    HTTP: http_1.HTTP,
    URL: url_1.URL,
    CHeaders: c_headers_1.CHeaders,
};
//# sourceMappingURL=llhttp.js.map