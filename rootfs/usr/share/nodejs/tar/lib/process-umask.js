// separate file so I stop getting nagged in vim about deprecated API
module.exports = {
  umask: () => process.umask()
};
