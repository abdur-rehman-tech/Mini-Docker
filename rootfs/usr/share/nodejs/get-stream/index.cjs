const m=require('./dhnodejsBundle.cjs');
const g=m.default
Object.keys(m).forEach(k => {
  g[k]=m[k]
});
module.exports = g;
