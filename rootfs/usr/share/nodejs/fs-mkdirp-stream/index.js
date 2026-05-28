'use strict';

const { Transform } = require('node:stream')
const { mkdirp } = require('mkdirp');

function toFunction(dirpath) {
  function stringResolver(chunk, callback) {
    callback(null, dirpath);
  }

  return stringResolver;
}

function mkdirpStream(resolver) {
  // Handle resolver that's just a dirpath
  if (typeof resolver === 'string') {
    resolver = toFunction(resolver);
  }

  return new Transform({
    objectMode: true,
    transform: function (chunk, encoding, callback) {
      resolver(chunk, onDirpath);

      function onDirpath(dirpathErr, dirpath, mode) {
        if (dirpathErr) {
          return callback(dirpathErr);
        }

        mkdirp(dirpath, mode)
          .then((token) => onMkdirp(null,token),(error) =>onMkdirp(error,null))
      }

      function onMkdirp(mkdirpErr) {
        if (mkdirpErr) {
          return callback(mkdirpErr);
        }

        callback(null, chunk);
      }
    },
  });
}

module.exports = mkdirpStream;
