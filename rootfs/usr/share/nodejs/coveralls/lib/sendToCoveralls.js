'use strict';

const fetch = require('node-fetch');
const index = require('..');

const sendToCoveralls = (obj, cb) => {
  let urlBase = 'https://coveralls.io';
  if (process.env.COVERALLS_ENDPOINT) {
    urlBase = process.env.COVERALLS_ENDPOINT;
  }

  const str = JSON.stringify(obj);
  const url = `${urlBase}/api/v1/jobs`;

  if (index.options.stdout) {
    process.stdout.write(str);
    cb(null, { statusCode: 200 }, '');
  } else {
    fetch(url, {
      method: "post",
      body: str,
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      cb(null, res, res.body);
    }).catch(err => {
      cb(err);
    });
  }
};

module.exports = sendToCoveralls;
