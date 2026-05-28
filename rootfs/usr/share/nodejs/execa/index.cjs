const { execa, execaSync, execaCommand, execaCommandSync, execaNode } = require("./execa.cjs");

const res = (...args) => {
    return execa(...args);
}

// old API
res.sync = execaSync;
res.command = execaCommand;
res.commandSync = execaCommandSync;
res.node = execaNode;

// compatibility
res.execa = execa;

// new API
res.execaSync = execaSync;
res.execaCommand = execaCommand;
res.execaCommandSync = execaCommandSync;
res.execaNode = execaNode;

module.exports = res;
