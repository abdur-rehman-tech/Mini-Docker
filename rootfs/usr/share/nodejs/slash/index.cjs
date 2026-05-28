Object.defineProperty(exports, '__esModule', { value: true });

function slash(path) {
	const isExtendedLengthPath = path.startsWith('\\\\?\\');

	if (isExtendedLengthPath) {
		return path;
	}

	return path.replace(/\\/g, '/');
}

exports.default = slash;

(function() {
  const __named = module.exports;
  module.exports = __named.default;
  for (const key of Object.keys(__named)) {
    if (key !== 'default') {
      module.exports[key] = __named[key];
    }
  }
})();
