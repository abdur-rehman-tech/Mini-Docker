const _mime = require('./_index.cjs');

// For CommonJS, we need a non-frozen instance so that consumers
// can call mime.define() (e.g. superagent does this)
// The ESM export is frozen, but CommonJS needs mutability
const instance = new _mime.Mime();

// Copy the types from the frozen default instance
// Build a typeMap by collecting all types and their extensions
const frozenState = _mime.default._getTestState();
const typeMap = {};
const seenTypes = new Set();

for (const [ext, type] of frozenState.types.entries()) {
  if (!seenTypes.has(type)) {
    seenTypes.add(type);
    const extensions = _mime.default.getAllExtensions(type);
    if (extensions) {
      typeMap[type] = Array.from(extensions);
    }
  }
}

// Define all types at once
instance.define(typeMap, true);

// Export the mutable instance with Mime constructor
module.exports = instance;
module.exports.Mime = _mime.Mime;
module.exports.default = instance;
