// Bootstrap cliui with CommonJS dependencies:
import { cliui } from './index.js';
const stringWidth = require('string-width');
const stripAnsi = require('strip-ansi');
const wrap = require('wrap-ansi');
export default function ui(opts) {
    return cliui(opts, {
        stringWidth,
        stripAnsi,
        wrap
    });
}
