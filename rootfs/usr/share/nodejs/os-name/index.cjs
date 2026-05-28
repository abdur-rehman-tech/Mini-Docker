var os = require('node:os');
var macosRelease = require('macos-release');
var windowsRelease = require('windows-release');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var os__default = /*#__PURE__*/_interopDefault(os);
var macosRelease__default = /*#__PURE__*/_interopDefault(macosRelease);
var windowsRelease__default = /*#__PURE__*/_interopDefault(windowsRelease);

function osName(platform, release) {
	if (!platform && release) {
		throw new Error('You can\'t specify a `release` without specifying `platform`');
	}

	platform = platform || os__default.default.platform();

	let id;

	if (platform === 'darwin') {
		if (!release && os__default.default.platform() === 'darwin') {
			release = os__default.default.release();
		}

		const prefix = release ? (Number(release.split('.')[0]) > 15 ? 'macOS' : 'OS X') : 'macOS';

		try {
			id = release ? macosRelease__default.default(release).name : '';

			if (id === 'Unknown') {
				return prefix;
			}
		} catch {}

		return prefix + (id ? ' ' + id : '');
	}

	if (platform === 'linux') {
		if (!release && os__default.default.platform() === 'linux') {
			release = os__default.default.release();
		}

		id = release ? release.replace(/^(\d+\.\d+).*/, '$1') : '';
		return 'Linux' + (id ? ' ' + id : '');
	}

	if (platform === 'win32') {
		if (!release && os__default.default.platform() === 'win32') {
			release = os__default.default.release();
		}

		id = release ? windowsRelease__default.default(release) : '';
		return 'Windows' + (id ? ' ' + id : '');
	}

	return platform;
}

module.exports = osName;
