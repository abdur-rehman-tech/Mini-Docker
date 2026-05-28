const m = require('./dist/cjs');

const minimatch = m.minimatch;
minimatch.minimatch = m.minimatch;

module.exports = minimatch;
