/*istanbul ignore next*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var
/*istanbul ignore next*/
_neoAsync = _interopRequireDefault(require("neo-async"));

var
/*istanbul ignore next*/
_fs = _interopRequireDefault(require("fs"));

var
/*istanbul ignore next*/
Handlebars = _interopRequireWildcard(require("./handlebars"));

var
/*istanbul ignore next*/
_path = require("path");

var
/*istanbul ignore next*/
_sourceMap = require("source-map");

/*istanbul ignore next*/ function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-console */
module.exports.loadTemplates = function (opts, callback) {
  loadStrings(opts, function (err, strings) {
    if (err) {
      callback(err);
    } else {
      loadFiles(opts, function (err, files) {
        if (err) {
          callback(err);
        } else {
          opts.templates = strings.concat(files);
          callback(undefined, opts);
        }
      });
    }
  });
};

function loadStrings(opts, callback) {
  var strings = arrayCast(opts.string),
      names = arrayCast(opts.name);

  if (names.length !== strings.length && strings.length > 1) {
    return callback(new Handlebars.Exception('Number of names did not match the number of string inputs'));
  }

  /*istanbul ignore next*/
  _neoAsync[
  /*istanbul ignore next*/
  "default"].map(strings, function (string, callback) {
    if (string !== '-') {
      callback(undefined, string);
    } else {
      // Load from stdin
      var buffer = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', function (chunk) {
        buffer += chunk;
      });
      process.stdin.on('end', function () {
        callback(undefined, buffer);
      });
    }
  }, function (err, strings) {
    strings = strings.map(function (string, index)
    /*istanbul ignore next*/
    {
      return {
        name: names[index],
        path: names[index],
        source: string
      };
    });
    callback(err, strings);
  });
}

function loadFiles(opts, callback) {
  // Build file extension pattern
  var extension = (opts.extension || 'handlebars').replace(/[\\^$*+?.():=!|{}\-[\]]/g, function (arg) {
    return '\\' + arg;
  });
  extension = new RegExp('\\.' + extension + '$');
  var ret = [],
      queue = (opts.files || []).map(function (template)
  /*istanbul ignore next*/
  {
    return {
      template: template,
      root: opts.root
    };
  });

  /*istanbul ignore next*/
  _neoAsync[
  /*istanbul ignore next*/
  "default"].whilst(function ()
  /*istanbul ignore next*/
  {
    return queue.length;
  }, function (callback) {
    /*istanbul ignore next*/
    var _queue$shift = queue.shift(),
        path = _queue$shift.template,
        root = _queue$shift.root;

    /*istanbul ignore next*/
    _fs[
    /*istanbul ignore next*/
    "default"].stat(path, function (err, stat) {
      if (err) {
        return callback(new Handlebars.Exception(
        /*istanbul ignore next*/
        "Unable to open template file \"".concat(path, "\"")));
      }

      if (stat.isDirectory()) {
        opts.hasDirectory = true;

        /*istanbul ignore next*/
        _fs[
        /*istanbul ignore next*/
        "default"].readdir(path, function (err, children) {
          /* istanbul ignore next : Race condition that being too lazy to test */
          if (err) {
            return callback(err);
          }

          children.forEach(function (file) {
            var childPath = path + '/' + file;

            if (extension.test(childPath) ||
            /*istanbul ignore next*/
            _fs[
            /*istanbul ignore next*/
            "default"].statSync(childPath).isDirectory()) {
              queue.push({
                template: childPath,
                root: root || path
              });
            }
          });
          callback();
        });
      } else {
        /*istanbul ignore next*/
        _fs[
        /*istanbul ignore next*/
        "default"].readFile(path, 'utf8', function (err, data) {
          /* istanbul ignore next : Race condition that being too lazy to test */
          if (err) {
            return callback(err);
          }

          if (opts.bom && data.indexOf("\uFEFF") === 0) {
            data = data.substring(1);
          } // Clean the template name


          var name = path;

          if (!root) {
            name =
            /*istanbul ignore next*/
            (0,
            /*istanbul ignore next*/
            _path.
            /*istanbul ignore next*/
            basename)(name);
          } else if (name.indexOf(root) === 0) {
            name = name.substring(root.length + 1);
          }

          name = name.replace(extension, '');
          ret.push({
            path: path,
            name: name,
            source: data
          });
          callback();
        });
      }
    });
  }, function (err) {
    if (err) {
      callback(err);
    } else {
      callback(undefined, ret);
    }
  });
}

module.exports.cli = function (opts) {
  if (opts.version) {
    console.log(Handlebars.VERSION);
    return;
  }

  if (!opts.templates.length && !opts.hasDirectory) {
    throw new Handlebars.Exception('Must define at least one template or directory.');
  }

  if (opts.simple && opts.min) {
    throw new Handlebars.Exception('Unable to minimize simple output');
  }

  var multiple = opts.templates.length !== 1 || opts.hasDirectory;

  if (opts.simple && multiple) {
    throw new Handlebars.Exception('Unable to output multiple templates in simple mode');
  } // Force simple mode if we have only one template and it's unnamed.


  if (!opts.amd && !opts.commonjs && opts.templates.length === 1 && !opts.templates[0].name) {
    opts.simple = true;
  } // Convert the known list into a hash


  var known = {};

  if (opts.known && !Array.isArray(opts.known)) {
    opts.known = [opts.known];
  }

  if (opts.known) {
    for (var i = 0, len = opts.known.length; i < len; i++) {
      known[opts.known[i]] = true;
    }
  }

  var objectName = opts.partial ? 'Handlebars.partials' : 'templates';
  var output = new
  /*istanbul ignore next*/
  _sourceMap.
  /*istanbul ignore next*/
  SourceNode();

  if (!opts.simple) {
    if (opts.amd) {
      output.add("define(['" + opts.handlebarPath + 'handlebars.runtime\'], function(Handlebars) {\n  Handlebars = Handlebars["default"];');
    } else if (opts.commonjs) {
      output.add('var Handlebars = require("' + opts.commonjs + '");');
    } else {
      output.add('(function() {\n');
    }

    output.add('  var template = Handlebars.template, templates = ');

    if (opts.namespace) {
      output.add(opts.namespace);
      output.add(' = ');
      output.add(opts.namespace);
      output.add(' || ');
    }

    output.add('{};\n');
  }

  opts.templates.forEach(function (template) {
    var options = {
      knownHelpers: known,
      knownHelpersOnly: opts.o
    };

    if (opts.map) {
      options.srcName = template.path;
    }

    if (opts.data) {
      options.data = true;
    }

    var precompiled = Handlebars.precompile(template.source, options); // If we are generating a source map, we have to reconstruct the SourceNode object

    if (opts.map) {
      var consumer = new
      /*istanbul ignore next*/
      _sourceMap.
      /*istanbul ignore next*/
      SourceMapConsumer(precompiled.map);
      precompiled =
      /*istanbul ignore next*/
      _sourceMap.
      /*istanbul ignore next*/
      SourceNode.fromStringWithSourceMap(precompiled.code, consumer);
    }

    if (opts.simple) {
      output.add([precompiled, '\n']);
    } else {
      if (!template.name) {
        throw new Handlebars.Exception('Name missing for template');
      }

      if (opts.amd && !multiple) {
        output.add('return ');
      }

      output.add([objectName, "['", template.name, "'] = template(", precompiled, ');\n']);
    }
  }); // Output the content

  if (!opts.simple) {
    if (opts.amd) {
      if (multiple) {
        output.add(['return ', objectName, ';\n']);
      }

      output.add('});');
    } else if (!opts.commonjs) {
      output.add('})();');
    }
  }

  if (opts.map) {
    output.add('\n//# sourceMappingURL=' + opts.map + '\n');
  }

  output = output.toStringWithSourceMap();
  output.map = output.map + '';

  if (opts.min) {
    output = minify(output, opts.map);
  }

  if (opts.map) {
    /*istanbul ignore next*/
    _fs[
    /*istanbul ignore next*/
    "default"].writeFileSync(opts.map, output.map, 'utf8');
  }

  output = output.code;

  if (opts.output) {
    /*istanbul ignore next*/
    _fs[
    /*istanbul ignore next*/
    "default"].writeFileSync(opts.output, output, 'utf8');
  } else {
    console.log(output);
  }
};

function arrayCast(value) {
  value = value != null ? value : [];

  if (!Array.isArray(value)) {
    value = [value];
  }

  return value;
}
/**
 * Run uglify to minify the compiled template, if uglify exists in the dependencies.
 *
 * We are using `require` instead of `import` here, because es6-modules do not allow
 * dynamic imports and uglify-js is an optional dependency. Since we are inside NodeJS here, this
 * should not be a problem.
 *
 * @param {string} output the compiled template
 * @param {string} sourceMapFile the file to write the source map to.
 */


function minify(output, sourceMapFile) {
  try {
    // Try to resolve uglify-js in order to see if it does exist
    require.resolve('uglify-js');
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      // Something else seems to be wrong
      throw e;
    } // it does not exist!


    console.error('Code minimization is disabled due to missing uglify-js dependency');
    return output;
  }

  return require('uglify-js').minify(output.code, {
    sourceMap: {
      content: output.map,
      url: sourceMapFile
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9wcmVjb21waWxlci5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibG9hZFRlbXBsYXRlcyIsIm9wdHMiLCJjYWxsYmFjayIsImxvYWRTdHJpbmdzIiwiZXJyIiwic3RyaW5ncyIsImxvYWRGaWxlcyIsImZpbGVzIiwidGVtcGxhdGVzIiwiY29uY2F0IiwidW5kZWZpbmVkIiwiYXJyYXlDYXN0Iiwic3RyaW5nIiwibmFtZXMiLCJuYW1lIiwibGVuZ3RoIiwiSGFuZGxlYmFycyIsIkV4Y2VwdGlvbiIsIkFzeW5jIiwibWFwIiwiYnVmZmVyIiwicHJvY2VzcyIsInN0ZGluIiwic2V0RW5jb2RpbmciLCJvbiIsImNodW5rIiwiaW5kZXgiLCJwYXRoIiwic291cmNlIiwiZXh0ZW5zaW9uIiwicmVwbGFjZSIsImFyZyIsIlJlZ0V4cCIsInJldCIsInF1ZXVlIiwidGVtcGxhdGUiLCJyb290Iiwid2hpbHN0Iiwic2hpZnQiLCJmcyIsInN0YXQiLCJpc0RpcmVjdG9yeSIsImhhc0RpcmVjdG9yeSIsInJlYWRkaXIiLCJjaGlsZHJlbiIsImZvckVhY2giLCJmaWxlIiwiY2hpbGRQYXRoIiwidGVzdCIsInN0YXRTeW5jIiwicHVzaCIsInJlYWRGaWxlIiwiZGF0YSIsImJvbSIsImluZGV4T2YiLCJzdWJzdHJpbmciLCJiYXNlbmFtZSIsImNsaSIsInZlcnNpb24iLCJjb25zb2xlIiwibG9nIiwiVkVSU0lPTiIsInNpbXBsZSIsIm1pbiIsIm11bHRpcGxlIiwiYW1kIiwiY29tbW9uanMiLCJrbm93biIsIkFycmF5IiwiaXNBcnJheSIsImkiLCJsZW4iLCJvYmplY3ROYW1lIiwicGFydGlhbCIsIm91dHB1dCIsIlNvdXJjZU5vZGUiLCJhZGQiLCJoYW5kbGViYXJQYXRoIiwibmFtZXNwYWNlIiwib3B0aW9ucyIsImtub3duSGVscGVycyIsImtub3duSGVscGVyc09ubHkiLCJvIiwic3JjTmFtZSIsInByZWNvbXBpbGVkIiwicHJlY29tcGlsZSIsImNvbnN1bWVyIiwiU291cmNlTWFwQ29uc3VtZXIiLCJmcm9tU3RyaW5nV2l0aFNvdXJjZU1hcCIsImNvZGUiLCJ0b1N0cmluZ1dpdGhTb3VyY2VNYXAiLCJtaW5pZnkiLCJ3cml0ZUZpbGVTeW5jIiwidmFsdWUiLCJzb3VyY2VNYXBGaWxlIiwicmVxdWlyZSIsInJlc29sdmUiLCJlIiwiZXJyb3IiLCJzb3VyY2VNYXAiLCJjb250ZW50IiwidXJsIl0sIm1hcHBpbmdzIjoiOzs7OztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7O0FBTEE7QUFPQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVDLGFBQWYsR0FBK0IsVUFBU0MsSUFBVCxFQUFlQyxRQUFmLEVBQXlCO0FBQ3REQyxFQUFBQSxXQUFXLENBQUNGLElBQUQsRUFBTyxVQUFTRyxHQUFULEVBQWNDLE9BQWQsRUFBdUI7QUFDdkMsUUFBSUQsR0FBSixFQUFTO0FBQ1BGLE1BQUFBLFFBQVEsQ0FBQ0UsR0FBRCxDQUFSO0FBQ0QsS0FGRCxNQUVPO0FBQ0xFLE1BQUFBLFNBQVMsQ0FBQ0wsSUFBRCxFQUFPLFVBQVNHLEdBQVQsRUFBY0csS0FBZCxFQUFxQjtBQUNuQyxZQUFJSCxHQUFKLEVBQVM7QUFDUEYsVUFBQUEsUUFBUSxDQUFDRSxHQUFELENBQVI7QUFDRCxTQUZELE1BRU87QUFDTEgsVUFBQUEsSUFBSSxDQUFDTyxTQUFMLEdBQWlCSCxPQUFPLENBQUNJLE1BQVIsQ0FBZUYsS0FBZixDQUFqQjtBQUNBTCxVQUFBQSxRQUFRLENBQUNRLFNBQUQsRUFBWVQsSUFBWixDQUFSO0FBQ0Q7QUFDRixPQVBRLENBQVQ7QUFRRDtBQUNGLEdBYlUsQ0FBWDtBQWNELENBZkQ7O0FBaUJBLFNBQVNFLFdBQVQsQ0FBcUJGLElBQXJCLEVBQTJCQyxRQUEzQixFQUFxQztBQUNuQyxNQUFJRyxPQUFPLEdBQUdNLFNBQVMsQ0FBQ1YsSUFBSSxDQUFDVyxNQUFO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LFdBQWhCO0FBQ0QsR0FIRCxDQUdFLE9BQU9DLENBQVAsRUFBVTtBQUNWLFFBQUlBLENBQUMsQ0FBQ1IsSUFBRixLQUFXLGtCQUFmLEVBQW1DO0FBQ2pDO0FBQ0EsWUFBTVEsQ0FBTjtBQUNELEtBSlMsQ0FLVjs7O0FBQ0F0QyxJQUFBQSxPQUFPLENBQUN1QyxLQUFSLENBQ0UsbUVBREY7QUFHQSxXQUFPeEIsTUFBUDtBQUNEOztBQUNELFNBQU9xQixPQUFPLENBQUMsV0FBRCxDQUFQLENBQXFCSixNQUFyQixDQUE0QmpCLE1BQU0sQ0FBQ2UsSUFBbkMsRUFBeUM7QUFDOUNVLElBQUFBLFNBQVMsRUFBRTtBQUNUQyxNQUFBQSxPQUFPLEVBQUUxQixNQUFNLENBQUN2RCxHQURQO0FBRVRrRixNQUFBQSxHQUFHLEVBQUVQO0FBRkk7QUFEbUMsR0FBekMsQ0FBUDtBQU1EIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IEFzeW5jIGZyb20gJ25lby1hc3luYyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgSGFuZGxlYmFycyBmcm9tICcuL2hhbmRsZWJhcnMnO1xuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IFNvdXJjZU1hcENvbnN1bWVyLCBTb3VyY2VOb2RlIH0gZnJvbSAnc291cmNlLW1hcCc7XG5cbm1vZHVsZS5leHBvcnRzLmxvYWRUZW1wbGF0ZXMgPSBmdW5jdGlvbihvcHRzLCBjYWxsYmFjaykge1xuICBsb2FkU3RyaW5ncyhvcHRzLCBmdW5jdGlvbihlcnIsIHN0cmluZ3MpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjYWxsYmFjayhlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2FkRmlsZXMob3B0cywgZnVuY3Rpb24oZXJyLCBmaWxlcykge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcHRzLnRlbXBsYXRlcyA9IHN0cmluZ3MuY29uY2F0KGZpbGVzKTtcbiAgICAgICAgICBjYWxsYmFjayh1bmRlZmluZWQsIG9wdHMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gbG9hZFN0cmluZ3Mob3B0cywgY2FsbGJhY2spIHtcbiAgbGV0IHN0cmluZ3MgPSBhcnJheUNhc3Qob3B0cy5zdHJpbmcpLFxuICAgIG5hbWVzID0gYXJyYXlDYXN0KG9wdHMubmFtZSk7XG5cbiAgaWYgKG5hbWVzLmxlbmd0aCAhPT0gc3RyaW5ncy5sZW5ndGggJiYgc3RyaW5ncy5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKFxuICAgICAgbmV3IEhhbmRsZWJhcnMuRXhjZXB0aW9uKFxuICAgICAgICAnTnVtYmVyIG9mIG5hbWVzIGRpZCBub3QgbWF0Y2ggdGhlIG51bWJlciBvZiBzdHJpbmcgaW5wdXRzJ1xuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBBc3luYy5tYXAoXG4gICAgc3RyaW5ncyxcbiAgICBmdW5jdGlvbihzdHJpbmcsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoc3RyaW5nICE9PSAnLScpIHtcbiAgICAgICAgY2FsbGJhY2sodW5kZWZpbmVkLCBzdHJpbmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTG9hZCBmcm9tIHN0ZGluXG4gICAgICAgIGxldCBidWZmZXIgPSAnJztcbiAgICAgICAgcHJvY2Vzcy5zdGRpbi5zZXRFbmNvZGluZygndXRmOCcpO1xuXG4gICAgICAgIHByb2Nlc3Muc3RkaW4ub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuICAgICAgICAgIGJ1ZmZlciArPSBjaHVuaztcbiAgICAgICAgfSk7XG4gICAgICAgIHByb2Nlc3Muc3RkaW4ub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgYnVmZmVyKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBmdW5jdGlvbihlcnIsIHN0cmluZ3MpIHtcbiAgICAgIHN0cmluZ3MgPSBzdHJpbmdzLm1hcCgoc3RyaW5nLCBpbmRleCkgPT4gKHtcbiAgICAgICAgbmFtZTogbmFtZXNbaW5kZXhdLFxuICAgICAgICBwYXRoOiBuYW1lc1tpbmRleF0sXG4gICAgICAgIHNvdXJjZTogc3RyaW5nXG4gICAgICB9KSk7XG4gICAgICBjYWxsYmFjayhlcnIsIHN0cmluZ3MpO1xuICAgIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gbG9hZEZpbGVzKG9wdHMsIGNhbGxiYWNrKSB7XG4gIC8vIEJ1aWxkIGZpbGUgZXh0ZW5zaW9uIHBhdHRlcm5cbiAgbGV0IGV4dGVuc2lvbiA9IChvcHRzLmV4dGVuc2lvbiB8fCAnaGFuZGxlYmFycycpLnJlcGxhY2UoXG4gICAgL1tcXFxcXiQqKz8uKCk6PSF8e31cXC1bXFxdXS9nLFxuICAgIGZ1bmN0aW9uKGFyZykge1xuICAgICAgcmV0dXJuICdcXFxcJyArIGFyZztcbiAgICB9XG4gICk7XG4gIGV4dGVuc2lvbiA9IG5ldyBSZWdFeHAoJ1xcXFwuJyArIGV4dGVuc2lvbiArICckJyk7XG5cbiAgbGV0IHJldCA9IFtdLFxuICAgIHF1ZXVlID0gKG9wdHMuZmlsZXMgfHwgW10pLm1hcCh0ZW1wbGF0ZSA9PiAoeyB0ZW1wbGF0ZSwgcm9vdDogb3B0cy5yb290IH0pKTtcbiAgQXN5bmMud2hpbHN0KFxuICAgICgpID0+IHF1ZXVlLmxlbmd0aCxcbiAgICBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgbGV0IHsgdGVtcGxhdGU6IHBhdGgsIHJvb3QgfSA9IHF1ZXVlLnNoaWZ0KCk7XG5cbiAgICAgIGZzLnN0YXQocGF0aCwgZnVuY3Rpb24oZXJyLCBzdGF0KSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soXG4gICAgICAgICAgICBuZXcgSGFuZGxlYmFycy5FeGNlcHRpb24oYFVuYWJsZSB0byBvcGVuIHRlbXBsYXRlIGZpbGUgXCIke3BhdGh9XCJgKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgb3B0cy5oYXNEaXJlY3RvcnkgPSB0cnVlO1xuXG4gICAgICAgICAgZnMucmVhZGRpcihwYXRoLCBmdW5jdGlvbihlcnIsIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCA6IFJhY2UgY29uZGl0aW9uIHRoYXQgYmVpbmcgdG9vIGxhenkgdG8gdGVzdCAqL1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgICBsZXQgY2hpbGRQYXRoID0gcGF0aCArICcvJyArIGZpbGU7XG5cbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGV4dGVuc2lvbi50ZXN0KGNoaWxkUGF0aCkgfHxcbiAgICAgICAgICAgICAgICBmcy5zdGF0U3luYyhjaGlsZFBhdGgpLmlzRGlyZWN0b3J5KClcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcXVldWUucHVzaCh7IHRlbXBsYXRlOiBjaGlsZFBhdGgsIHJvb3Q6IHJvb3QgfHwgcGF0aCB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMucmVhZEZpbGUocGF0aCwgJ3V0ZjgnLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IDogUmFjZSBjb25kaXRpb24gdGhhdCBiZWluZyB0b28gbGF6eSB0byB0ZXN0ICovXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0cy5ib20gJiYgZGF0YS5pbmRleE9mKCdcXHVGRUZGJykgPT09IDApIHtcbiAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDbGVhbiB0aGUgdGVtcGxhdGUgbmFtZVxuICAgICAgICAgICAgbGV0IG5hbWUgPSBwYXRoO1xuICAgICAgICAgICAgaWYgKCFyb290KSB7XG4gICAgICAgICAgICAgIG5hbWUgPSBiYXNlbmFtZShuYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmFtZS5pbmRleE9mKHJvb3QpID09PSAwKSB7XG4gICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZyhyb290Lmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZShleHRlbnNpb24sICcnKTtcblxuICAgICAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICBzb3VyY2U6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uKGVycikge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sodW5kZWZpbmVkLCByZXQpO1xuICAgICAgfVxuICAgIH1cbiAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMuY2xpID0gZnVuY3Rpb24ob3B0cykge1xuICBpZiAob3B0cy52ZXJzaW9uKSB7XG4gICAgY29uc29sZS5sb2coSGFuZGxlYmFycy5WRVJTSU9OKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIW9wdHMudGVtcGxhdGVzLmxlbmd0aCAmJiAhb3B0cy5oYXNEaXJlY3RvcnkpIHtcbiAgICB0aHJvdyBuZXcgSGFuZGxlYmFycy5FeGNlcHRpb24oXG4gICAgICAnTXVzdCBkZWZpbmUgYXQgbGVhc3Qgb25lIHRlbXBsYXRlIG9yIGRpcmVjdG9yeS4nXG4gICAgKTtcbiAgfVxuXG4gIGlmIChvcHRzLnNpbXBsZSAmJiBvcHRzLm1pbikge1xuICAgIHRocm93IG5ldyBIYW5kbGViYXJzLkV4Y2VwdGlvbignVW5hYmxlIHRvIG1pbmltaXplIHNpbXBsZSBvdXRwdXQnKTtcbiAgfVxuXG4gIGNvbnN0IG11bHRpcGxlID0gb3B0cy50ZW1wbGF0ZXMubGVuZ3RoICE9PSAxIHx8IG9wdHMuaGFzRGlyZWN0b3J5O1xuICBpZiAob3B0cy5zaW1wbGUgJiYgbXVsdGlwbGUpIHtcbiAgICB0aHJvdyBuZXcgSGFuZGxlYmFycy5FeGNlcHRpb24oXG4gICAgICAnVW5hYmxlIHRvIG91dHB1dCBtdWx0aXBsZSB0ZW1wbGF0ZXMgaW4gc2ltcGxlIG1vZGUnXG4gICAgKTtcbiAgfVxuXG4gIC8vIEZvcmNlIHNpbXBsZSBtb2RlIGlmIHdlIGhhdmUgb25seSBvbmUgdGVtcGxhdGUgYW5kIGl0J3MgdW5uYW1lZC5cbiAgaWYgKFxuICAgICFvcHRzLmFtZCAmJlxuICAgICFvcHRzLmNvbW1vbmpzICYmXG4gICAgb3B0cy50ZW1wbGF0ZXMubGVuZ3RoID09PSAxICYmXG4gICAgIW9wdHMudGVtcGxhdGVzWzBdLm5hbWVcbiAgKSB7XG4gICAgb3B0cy5zaW1wbGUgPSB0cnVlO1xuICB9XG5cbiAgLy8gQ29udmVydCB0aGUga25vd24gbGlzdCBpbnRvIGEgaGFzaFxuICBsZXQga25vd24gPSB7fTtcbiAgaWYgKG9wdHMua25vd24gJiYgIUFycmF5LmlzQXJyYXkob3B0cy5rbm93bikpIHtcbiAgICBvcHRzLmtub3duID0gW29wdHMua25vd25dO1xuICB9XG4gIGlmIChvcHRzLmtub3duKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG9wdHMua25vd24ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGtub3duW29wdHMua25vd25baV1dID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvYmplY3ROYW1lID0gb3B0cy5wYXJ0aWFsID8gJ0hhbmRsZWJhcnMucGFydGlhbHMnIDogJ3RlbXBsYXRlcyc7XG5cbiAgbGV0IG91dHB1dCA9IG5ldyBTb3VyY2VOb2RlKCk7XG4gIGlmICghb3B0cy5zaW1wbGUpIHtcbiAgICBpZiAob3B0cy5hbWQpIHtcbiAgICAgIG91dHB1dC5hZGQoXG4gICAgICAgIFwiZGVmaW5lKFsnXCIgK1xuICAgICAgICAgIG9wdHMuaGFuZGxlYmFyUGF0aCArXG4gICAgICAgICAgJ2hhbmRsZWJhcnMucnVudGltZVxcJ10sIGZ1bmN0aW9uKEhhbmRsZWJhcnMpIHtcXG4gIEhhbmRsZWJhcnMgPSBIYW5kbGViYXJzW1wiZGVmYXVsdFwiXTsnXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAob3B0cy5jb21tb25qcykge1xuICAgICAgb3V0cHV0LmFkZCgndmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKFwiJyArIG9wdHMuY29tbW9uanMgKyAnXCIpOycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQuYWRkKCcoZnVuY3Rpb24oKSB7XFxuJyk7XG4gICAgfVxuICAgIG91dHB1dC5hZGQoJyAgdmFyIHRlbXBsYXRlID0gSGFuZGxlYmFycy50ZW1wbGF0ZSwgdGVtcGxhdGVzID0gJyk7XG4gICAgaWYgKG9wdHMubmFtZXNwYWNlKSB7XG4gICAgICBvdXRwdXQuYWRkKG9wdHMubmFtZXNwYWNlKTtcbiAgICAgIG91dHB1dC5hZGQoJyA9ICcpO1xuICAgICAgb3V0cHV0LmFkZChvcHRzLm5hbWVzcGFjZSk7XG4gICAgICBvdXRwdXQuYWRkKCcgfHwgJyk7XG4gICAgfVxuICAgIG91dHB1dC5hZGQoJ3t9O1xcbicpO1xuICB9XG5cbiAgb3B0cy50ZW1wbGF0ZXMuZm9yRWFjaChmdW5jdGlvbih0ZW1wbGF0ZSkge1xuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAga25vd25IZWxwZXJzOiBrbm93bixcbiAgICAgIGtub3duSGVscGVyc09ubHk6IG9wdHMub1xuICAgIH07XG5cbiAgICBpZiAob3B0cy5tYXApIHtcbiAgICAgIG9wdGlvbnMuc3JjTmFtZSA9IHRlbXBsYXRlLnBhdGg7XG4gICAgfVxuICAgIGlmIChvcHRzLmRhdGEpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IHRydWU7XG4gICAgfVxuXG4gICAgbGV0IHByZWNvbXBpbGVkID0gSGFuZGxlYmFycy5wcmVjb21waWxlKHRlbXBsYXRlLnNvdXJjZSwgb3B0aW9ucyk7XG5cbiAgICAvLyBJZiB3ZSBhcmUgZ2VuZXJhdGluZyBhIHNvdXJjZSBtYXAsIHdlIGhhdmUgdG8gcmVjb25zdHJ1Y3QgdGhlIFNvdXJjZU5vZGUgb2JqZWN0XG4gICAgaWYgKG9wdHMubWFwKSB7XG4gICAgICBsZXQgY29uc3VtZXIgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIocHJlY29tcGlsZWQubWFwKTtcbiAgICAgIHByZWNvbXBpbGVkID0gU291cmNlTm9kZS5mcm9tU3RyaW5nV2l0aFNvdXJjZU1hcChcbiAgICAgICAgcHJlY29tcGlsZWQuY29kZSxcbiAgICAgICAgY29uc3VtZXJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuc2ltcGxlKSB7XG4gICAgICBvdXRwdXQuYWRkKFtwcmVjb21waWxlZCwgJ1xcbiddKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0ZW1wbGF0ZS5uYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBIYW5kbGViYXJzLkV4Y2VwdGlvbignTmFtZSBtaXNzaW5nIGZvciB0ZW1wbGF0ZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5hbWQgJiYgIW11bHRpcGxlKSB7XG4gICAgICAgIG91dHB1dC5hZGQoJ3JldHVybiAnKTtcbiAgICAgIH1cbiAgICAgIG91dHB1dC5hZGQoW1xuICAgICAgICBvYmplY3ROYW1lLFxuICAgICAgICBcIlsnXCIsXG4gICAgICAgIHRlbXBsYXRlLm5hbWUsXG4gICAgICAgIFwiJ10gPSB0ZW1wbGF0ZShcIixcbiAgICAgICAgcHJlY29tcGlsZWQsXG4gICAgICAgICcpO1xcbidcbiAgICAgIF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gT3V0cHV0IHRoZSBjb250ZW50XG4gIGlmICghb3B0cy5zaW1wbGUpIHtcbiAgICBpZiAob3B0cy5hbWQpIHtcbiAgICAgIGlmIChtdWx0aXBsZSkge1xuICAgICAgICBvdXRwdXQuYWRkKFsncmV0dXJuICcsIG9iamVjdE5hbWUsICc7XFxuJ10pO1xuICAgICAgfVxuICAgICAgb3V0cHV0LmFkZCgnfSk7Jyk7XG4gICAgfSBlbHNlIGlmICghb3B0cy5jb21tb25qcykge1xuICAgICAgb3V0cHV0LmFkZCgnfSkoKTsnKTtcbiAgICB9XG4gIH1cblxuICBpZiAob3B0cy5tYXApIHtcbiAgICBvdXRwdXQuYWRkKCdcXG4vLyMgc291cmNlTWFwcGluZ1VSTD0nICsgb3B0cy5tYXAgKyAnXFxuJyk7XG4gIH1cblxuICBvdXRwdXQgPSBvdXRwdXQudG9TdHJpbmdXaXRoU291cmNlTWFwKCk7XG4gIG91dHB1dC5tYXAgPSBvdXRwdXQubWFwICsgJyc7XG5cbiAgaWYgKG9wdHMubWluKSB7XG4gICAgb3V0cHV0ID0gbWluaWZ5KG91dHB1dCwgb3B0cy5tYXApO1xuICB9XG5cbiAgaWYgKG9wdHMubWFwKSB7XG4gICAgZnMud3JpdGVGaWxlU3luYyhvcHRzLm1hcCwgb3V0cHV0Lm1hcCwgJ3V0ZjgnKTtcbiAgfVxuICBvdXRwdXQgPSBvdXRwdXQuY29kZTtcblxuICBpZiAob3B0cy5vdXRwdXQpIHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKG9wdHMub3V0cHV0LCBvdXRwdXQsICd1dGY4Jyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2cob3V0cHV0KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gYXJyYXlDYXN0KHZhbHVlKSB7XG4gIHZhbHVlID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogW107XG4gIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIFJ1biB1Z2xpZnkgdG8gbWluaWZ5IHRoZSBjb21waWxlZCB0ZW1wbGF0ZSwgaWYgdWdsaWZ5IGV4aXN0cyBpbiB0aGUgZGVwZW5kZW5jaWVzLlxuICpcbiAqIFdlIGFyZSB1c2luZyBgcmVxdWlyZWAgaW5zdGVhZCBvZiBgaW1wb3J0YCBoZXJlLCBiZWNhdXNlIGVzNi1tb2R1bGVzIGRvIG5vdCBhbGxvd1xuICogZHluYW1pYyBpbXBvcnRzIGFuZCB1Z2xpZnktanMgaXMgYW4gb3B0aW9uYWwgZGVwZW5kZW5jeS4gU2luY2Ugd2UgYXJlIGluc2lkZSBOb2RlSlMgaGVyZSwgdGhpc1xuICogc2hvdWxkIG5vdCBiZSBhIHByb2JsZW0uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG91dHB1dCB0aGUgY29tcGlsZWQgdGVtcGxhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VNYXBGaWxlIHRoZSBmaWxlIHRvIHdyaXRlIHRoZSBzb3VyY2UgbWFwIHRvLlxuICovXG5mdW5jdGlvbiBtaW5pZnkob3V0cHV0LCBzb3VyY2VNYXBGaWxlKSB7XG4gIHRyeSB7XG4gICAgLy8gVHJ5IHRvIHJlc29sdmUgdWdsaWZ5LWpzIGluIG9yZGVyIHRvIHNlZSBpZiBpdCBkb2VzIGV4aXN0XG4gICAgcmVxdWlyZS5yZXNvbHZlKCd1Z2xpZnktanMnKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlLmNvZGUgIT09ICdNT0RVTEVfTk9UX0ZPVU5EJykge1xuICAgICAgLy8gU29tZXRoaW5nIGVsc2Ugc2VlbXMgdG8gYmUgd3JvbmdcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICAgIC8vIGl0IGRvZXMgbm90IGV4aXN0IVxuICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAnQ29kZSBtaW5pbWl6YXRpb24gaXMgZGlzYWJsZWQgZHVlIHRvIG1pc3NpbmcgdWdsaWZ5LWpzIGRlcGVuZGVuY3knXG4gICAgKTtcbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG4gIHJldHVybiByZXF1aXJlKCd1Z2xpZnktanMnKS5taW5pZnkob3V0cHV0LmNvZGUsIHtcbiAgICBzb3VyY2VNYXA6IHtcbiAgICAgIGNvbnRlbnQ6IG91dHB1dC5tYXAsXG4gICAgICB1cmw6IHNvdXJjZU1hcEZpbGVcbiAgICB9XG4gIH0pO1xufVxuIl19
