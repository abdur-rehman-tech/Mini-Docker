const fetch = require('node-fetch')
const { promises: fs } = require('graceful-fs')
const log = require('./log')

async function download (gyp, url) {
  log.http('GET', url)

  const requestOpts = {
    headers: {
      'User-Agent': `node-gyp v${gyp.version} (node ${process.version})`,
      Connection: 'keep-alive'
    }
  }
  if (gyp.opts.proxy) {
    let proxy=true
    if (gyp.opts.noproxy) {
      let tmp = typeof gyp.opts.noproxy == 'string' ? gyp.opts.noproxy.split(/,\s*/) : gyp.opts.noproxy
      if (tmp.includes(url)) proxy = false;
    }
    if (proxy) {
      const {HttpsProxyAgent} = require('https-proxy-agent');
      requestOpts.agent = new HttpsProxyAgent(gyp.opts.proxy);
    }
  }

  if (gyp.opts.cafile) {
    console.error('cafile option not implemented here, use NODE_EXTRA_CA_CERTS variable instead');
  }

  const res = await fetch(url, requestOpts)
  log.http(res.status, res.url)

  return res
}

async function readCAFile (filename) {
  // The CA file can contain multiple certificates so split on certificate
  // boundaries.  [\S\s]*? is used to match everything including newlines.
  const ca = await fs.readFile(filename, 'utf8')
  const re = /(-----BEGIN CERTIFICATE-----[\S\s]*?-----END CERTIFICATE-----)/g
  return ca.match(re)
}

module.exports = {
  download,
  readCAFile
}
