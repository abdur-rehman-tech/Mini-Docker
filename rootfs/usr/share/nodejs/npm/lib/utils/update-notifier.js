// print a banner telling the user to upgrade npm to latest
// but not in CI, and not if we're doing that already.
// Check daily for betas, and weekly otherwise.

const pacote = require('pacote')
const ciInfo = require('ci-info')
const semver = require('semver')
const chalk = require('chalk')
const { promisify } = require('util')
const stat = promisify(require('fs').stat)
const writeFile = promisify(require('fs').writeFile)
const { resolve } = require('path')

const SKIP = Symbol('SKIP')

const isGlobalNpmUpdate = npm => {
  return npm.flatOptions.global &&
    ['install', 'update'].includes(npm.command) &&
    npm.argv.some(arg => /^npm(@|$)/.test(arg))
}

// update check frequency
const DAILY = 1000 * 60 * 60 * 24
const WEEKLY = DAILY * 7

// don't put it in the _cacache folder, just in npm's cache
const lastCheckedFile = npm =>
  resolve(npm.flatOptions.cache, '../_update-notifier-last-checked')

const checkTimeout = async (npm, duration) => {
  const t = new Date(Date.now() - duration)
  const f = lastCheckedFile(npm)
  // if we don't have a file, then definitely check it.
  const st = await stat(f).catch(() => ({ mtime: t - 1 }))
  return t > st.mtime
}

const updateNotifier = async (npm, spec = 'latest') => {
  // Maintained by Debian JS Team
  return null
}

// only update the notification timeout if we actually finished checking
module.exports = async npm => {
  const notification = await updateNotifier(npm)

  // dont write the file if we skipped checking altogether
  if (notification === SKIP) {
    return null
  }

  // intentional.  do not await this.  it's a best-effort update.  if this
  // fails, it's ok.  might be using /dev/null as the cache or something weird
  // like that.
  writeFile(lastCheckedFile(npm), '').catch(() => {})
  return notification
}
