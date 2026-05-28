var process = require('process');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var process__default = /*#__PURE__*/_interopDefault(process);

function hasFlag(flag, argv = process__default.default.argv) {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}

module.exports = hasFlag;
