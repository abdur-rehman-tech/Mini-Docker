"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHeaders = void 0;
const constants_1 = __importDefault(require("./constants"));
const utils_1 = require("./utils");
class CHeaders {
    build() {
        let res = '';
        res += '#ifndef LLLLHTTP_C_HEADERS_\n';
        res += '#define LLLLHTTP_C_HEADERS_\n';
        res += '#ifdef __cplusplus\n';
        res += 'extern "C" {\n';
        res += '#endif\n';
        res += '\n';
        const errorMap = (0, utils_1.enumToMap)(constants_1.default.ERROR);
        const methodMap = (0, utils_1.enumToMap)(constants_1.default.METHODS);
        const httpMethodMap = (0, utils_1.enumToMap)(constants_1.default.METHODS, constants_1.default.METHODS_HTTP, [
            constants_1.default.METHODS.PRI,
        ]);
        const rtspMethodMap = (0, utils_1.enumToMap)(constants_1.default.METHODS, constants_1.default.METHODS_RTSP);
        const statusMap = (0, utils_1.enumToMap)(constants_1.default.STATUSES, constants_1.default.STATUSES_HTTP);
        res += this.buildEnum('llhttp_errno', 'HPE', errorMap);
        res += '\n';
        res += this.buildEnum('llhttp_flags', 'F', (0, utils_1.enumToMap)(constants_1.default.FLAGS), 'hex');
        res += '\n';
        res += this.buildEnum('llhttp_lenient_flags', 'LENIENT', (0, utils_1.enumToMap)(constants_1.default.LENIENT_FLAGS), 'hex');
        res += '\n';
        res += this.buildEnum('llhttp_type', 'HTTP', (0, utils_1.enumToMap)(constants_1.default.TYPE));
        res += '\n';
        res += this.buildEnum('llhttp_finish', 'HTTP_FINISH', (0, utils_1.enumToMap)(constants_1.default.FINISH));
        res += '\n';
        res += this.buildEnum('llhttp_method', 'HTTP', methodMap);
        res += '\n';
        res += this.buildEnum('llhttp_status', 'HTTP_STATUS', statusMap);
        res += '\n';
        res += this.buildMap('HTTP_ERRNO', errorMap);
        res += '\n';
        res += this.buildMap('HTTP_METHOD', httpMethodMap);
        res += '\n';
        res += this.buildMap('RTSP_METHOD', rtspMethodMap);
        res += '\n';
        res += this.buildMap('HTTP_ALL_METHOD', methodMap);
        res += '\n';
        res += this.buildMap('HTTP_STATUS', statusMap);
        res += '\n';
        res += '#ifdef __cplusplus\n';
        res += '}  /* extern "C" */\n';
        res += '#endif\n';
        res += '#endif  /* LLLLHTTP_C_HEADERS_ */\n';
        return res;
    }
    buildEnum(name, prefix, map, encoding = 'none') {
        let res = '';
        res += `enum ${name} {\n`;
        const keys = Object.keys(map);
        const keysLength = keys.length;
        for (let i = 0; i < keysLength; i++) {
            const key = keys[i];
            const isLast = i === keysLength - 1;
            let value = map[key];
            if (encoding === 'hex') {
                value = `0x${value.toString(16)}`;
            }
            res += `  ${prefix}_${key.replace(/-/g, '')} = ${value}`;
            if (!isLast) {
                res += ',\n';
            }
        }
        res += '\n};\n';
        res += `typedef enum ${name} ${name}_t;\n`;
        return res;
    }
    buildMap(name, map) {
        let res = '';
        res += `#define ${name}_MAP(XX) \\\n`;
        for (const [key, value] of Object.entries(map)) {
            res += `  XX(${value}, ${key.replace(/-/g, '')}, ${key}) \\\n`;
        }
        res += '\n';
        return res;
    }
}
exports.CHeaders = CHeaders;
//# sourceMappingURL=c-headers.js.map