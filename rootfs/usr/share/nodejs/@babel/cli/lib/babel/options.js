"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseArgv;
function _fs() {
  const data = require("fs");
  _fs = function () {
    return data;
  };
  return data;
}
function _commander() {
  const data = require("commander");
  _commander = function () {
    return data;
  };
  return data;
}
function _core() {
  const data = require("@babel/core");
  _core = function () {
    return data;
  };
  return data;
}
function _glob() {
  const data = require("glob");
  _glob = function () {
    return data;
  };
  return data;
}
_commander().program.option("-f, --filename [filename]", "The filename to use when reading from stdin. This will be used in source-maps, errors etc.");
_commander().program.option("--presets [list]", "A comma-separated list of preset names.", collect);
_commander().program.option("--plugins [list]", "A comma-separated list of plugin names.", collect);
_commander().program.option("--config-file [path]", "Path to a .babelrc file to use.");
_commander().program.option("--env-name [name]", "The name of the 'env' to use when loading configs and plugins. " + "Defaults to the value of BABEL_ENV, or else NODE_ENV, or else 'development'.");
_commander().program.option("--root-mode [mode]", "The project-root resolution mode. " + "One of 'root' (the default), 'upward', or 'upward-optional'.");
_commander().program.option("--source-type [script|module]", "");
_commander().program.option("--no-babelrc", "Whether or not to look up .babelrc and .babelignore files.");
_commander().program.option("--ignore [list]", "List of glob paths to **not** compile.", collect);
_commander().program.option("--only [list]", "List of glob paths to **only** compile.", collect);
_commander().program.option("--no-highlight-code", "Enable or disable ANSI syntax highlighting of code frames. (on by default)");
_commander().program.option("--no-comments", "Write comments to generated output. (true by default)");
_commander().program.option("--retain-lines", "Retain line numbers. This will result in really ugly code.");
_commander().program.option("--compact [true|false|auto]", "Do not include superfluous whitespace characters and line terminators.", booleanify);
_commander().program.option("--minified", "Save as many bytes when printing. (false by default)");
_commander().program.option("--auxiliary-comment-before [string]", "Print a comment before any injected non-user code.");
_commander().program.option("--auxiliary-comment-after [string]", "Print a comment after any injected non-user code.");
_commander().program.option("-s, --source-maps [true|false|inline|both]", "", booleanify, undefined);
_commander().program.option("--source-map-target [string]", "Set `file` on returned source map.");
_commander().program.option("--source-file-name [string]", "Set `sources[0]` on returned source map.");
_commander().program.option("--source-root [filename]", "The root from which all sources are relative.");
{
  _commander().program.option("--module-root [filename]", "Optional prefix for the AMD module formatter that will be prepended to the filename on module definitions.");
  _commander().program.option("-M, --module-ids", "Insert an explicit id for modules.");
  _commander().program.option("--module-id [string]", "Specify a custom name for module ids.");
}
_commander().program.option("-x, --extensions [extensions]", "List of extensions to compile when a directory has been the input. [" + _core().DEFAULT_EXTENSIONS.join() + "]", collect);
_commander().program.option("--keep-file-extension", "Preserve the file extensions of the input files.");
_commander().program.option("-w, --watch", "Recompile files on changes.");
_commander().program.option("--skip-initial-build", "Do not compile files before watching.");
_commander().program.option("-o, --out-file [out]", "Compile all input files into a single file.");
_commander().program.option("-d, --out-dir [out]", "Compile an input directory of modules into an output directory.");
_commander().program.option("--relative", "Compile into an output directory relative to input directory or file. Requires --out-dir [out]");
_commander().program.option("-D, --copy-files", "When compiling a directory copy over non-compilable files.");
_commander().program.option("--include-dotfiles", "Include dotfiles when compiling and copying non-compilable files.");
_commander().program.option("--no-copy-ignored", "Exclude ignored files when copying non-compilable files.");
_commander().program.option("--verbose", "Log everything. This option conflicts with --quiet");
_commander().program.option("--quiet", "Don't log anything. This option conflicts with --verbose");
_commander().program.option("--delete-dir-on-start", "Delete the out directory before compilation.");
_commander().program.option("--out-file-extension [string]", "Use a specific extension for the output files");
_commander().program.version("7.20.7" + " (@babel/core " + _core().version + ")");
_commander().program.usage("[options] <files ...>");
_commander().program.allowExcessArguments();
_commander().program.action(() => {});
function parseArgv(args) {
  _commander().program.parse(args);
  const errors = [];
  let filenames = _commander().program.args.reduce(function (globbed, input) {
    let files = _glob().sync(input);
    if (!files.length) files = [input];
    globbed.push(...files);
    return globbed;
  }, []);
  filenames = Array.from(new Set(filenames));
  filenames.forEach(function (filename) {
    if (!_fs().existsSync(filename)) {
      errors.push(filename + " does not exist");
    }
  });
  if (_commander().program.outDir && !filenames.length) {
    errors.push("--out-dir requires filenames");
  }
  if (_commander().program.outFile && _commander().program.outDir) {
    errors.push("--out-file and --out-dir cannot be used together");
  }
  if (_commander().program.relative && !_commander().program.outDir) {
    errors.push("--relative requires --out-dir usage");
  }
  if (_commander().program.watch) {
    if (!_commander().program.outFile && !_commander().program.outDir) {
      errors.push("--watch requires --out-file or --out-dir");
    }
    if (!filenames.length) {
      errors.push("--watch requires filenames");
    }
  }
  if (_commander().program.skipInitialBuild && !_commander().program.watch) {
    errors.push("--skip-initial-build requires --watch");
  }
  if (_commander().program.deleteDirOnStart && !_commander().program.outDir) {
    errors.push("--delete-dir-on-start requires --out-dir");
  }
  if (_commander().program.verbose && _commander().program.quiet) {
    errors.push("--verbose and --quiet cannot be used together");
  }
  if (!_commander().program.outDir && filenames.length === 0 && typeof _commander().program.filename !== "string" && _commander().program.babelrc !== false) {
    errors.push("stdin compilation requires either -f/--filename [filename] or --no-babelrc");
  }
  if (_commander().program.keepFileExtension && _commander().program.outFileExtension) {
    errors.push("--out-file-extension cannot be used with --keep-file-extension");
  }
  if (errors.length) {
    console.error("babel:");
    errors.forEach(function (e) {
      console.error("  " + e);
    });
    return null;
  }
  const opts = _commander().program.opts();
  const babelOptions = {
    presets: opts.presets,
    plugins: opts.plugins,
    rootMode: opts.rootMode,
    configFile: opts.configFile,
    envName: opts.envName,
    sourceType: opts.sourceType,
    ignore: opts.ignore,
    only: opts.only,
    retainLines: opts.retainLines,
    compact: opts.compact,
    minified: opts.minified,
    auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
    auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
    sourceMaps: opts.sourceMaps,
    sourceFileName: opts.sourceFileName,
    sourceRoot: opts.sourceRoot,
    babelrc: opts.babelrc === true ? undefined : opts.babelrc,
    highlightCode: opts.highlightCode === true ? undefined : opts.highlightCode,
    comments: opts.comments === true ? undefined : opts.comments
  };
  {
    Object.assign(babelOptions, {
      moduleRoot: opts.moduleRoot,
      moduleIds: opts.moduleIds,
      moduleId: opts.moduleId
    });
  }
  for (const key of Object.keys(babelOptions)) {
    if (babelOptions[key] === undefined) {
      delete babelOptions[key];
    }
  }
  return {
    babelOptions,
    cliOptions: {
      filename: opts.filename,
      filenames,
      extensions: opts.extensions,
      keepFileExtension: opts.keepFileExtension,
      outFileExtension: opts.outFileExtension,
      watch: opts.watch,
      skipInitialBuild: opts.skipInitialBuild,
      outFile: opts.outFile,
      outDir: opts.outDir,
      relative: opts.relative,
      copyFiles: opts.copyFiles,
      copyIgnored: opts.copyFiles && opts.copyIgnored,
      includeDotfiles: opts.includeDotfiles,
      verbose: opts.verbose,
      quiet: opts.quiet,
      deleteDirOnStart: opts.deleteDirOnStart,
      sourceMapTarget: opts.sourceMapTarget
    }
  };
}
function booleanify(val) {
  if (val === undefined) return undefined;
  if (val === "true" || val == 1) {
    return true;
  }
  if (val === "false" || val == 0 || !val) {
    return false;
  }
  return val;
}
function collect(value, previousValue) {
  if (typeof value !== "string") return previousValue;
  const values = value.split(",");
  if (previousValue) {
    previousValue.push(...values);
    return previousValue;
  }
  return values;
}

//# sourceMappingURL=options.js.map
