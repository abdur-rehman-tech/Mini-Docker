// warning: extremely hot code path.
// This has been meticulously optimized for use
// within npm install on large package trees.
// Do not edit without careful benchmarking.
const normalizeCache = Object.create(null)
const { hasOwnProperty } = Object.prototype
module.exports = s => {
  if (!hasOwnProperty.call(normalizeCache, s)) {
    // shake out identical accents and ligatures
    normalizeCache[s] = s
      .normalize('NFD')
      .toLocaleLowerCase('en')
      .toLocaleUpperCase('en')
  }
  return normalizeCache[s]
}
