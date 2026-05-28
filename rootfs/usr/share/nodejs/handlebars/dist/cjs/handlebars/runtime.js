/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRevision = checkRevision;
exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;

var
/*istanbul ignore next*/
Utils = _interopRequireWildcard(require("./utils"));

var
/*istanbul ignore next*/
_exception = _interopRequireDefault(require("./exception"));

var
/*istanbul ignore next*/
_base = require("./base");

var
/*istanbul ignore next*/
_helpers = require("./helpers");

var
/*istanbul ignore next*/
_wrapHelper = require("./internal/wrapHelper");

var
/*istanbul ignore next*/
_protoAccess = require("./internal/proto-access");

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision =
  /*istanbul ignore next*/
  _base.
  /*istanbul ignore next*/
  COMPILER_REVISION;

  if (compilerRevision >=
  /*istanbul ignore next*/
  _base.
  /*istanbul ignore next*/
  LAST_COMPATIBLE_COMPILER_REVISION && compilerRevision <=
  /*istanbul ignore next*/
  _base.
  /*istanbul ignore next*/
  COMPILER_REVISION) {
    return;
  }

  if (compilerRevision <
  /*istanbul ignore next*/
  _base.
  /*istanbul ignore next*/
  LAST_COMPATIBLE_COMPILER_REVISION) {
    var runtimeVersions =
    /*istanbul ignore next*/
    _base.
    /*istanbul ignore next*/
    REVISION_CHANGES[currentRevision],
        compilerVersions =
    /*istanbul ignore next*/
    _base.
    /*istanbul ignore next*/
    REVISION_CHANGES[compilerRevision];
    throw new
    /*istanbul ignore next*/
    _exception[
    /*istanbul ignore next*/
    "default"]('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
  } else {
    // Use the embedded version info since the runtime doesn't know about this revision yet
    throw new
    /*istanbul ignore next*/
    _exception[
    /*istanbul ignore next*/
    "default"]('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new
    /*istanbul ignore next*/
    _exception[
    /*istanbul ignore next*/
    "default"]('No environment passed to template');
  }

  if (!templateSpec || !templateSpec.main) {
    throw new
    /*istanbul ignore next*/
    _exception[
    /*istanbul ignore next*/
    "default"]('Unknown template object: ' +
    /*istanbul ignore next*/
    _typeof(templateSpec));
  }

  templateSpec.main.decorator = templateSpec.main_d; // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as pseudo-supported APIs.

  env.VM.checkRevision(templateSpec.compiler); // backwards compatibility for precompiled templates with compiler-version 7 (<4.3.0)

  var templateWasPrecompiledWithCompilerV7 = templateSpec.compiler && templateSpec.compiler[0] === 7;

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);

      if (options.ids) {
        options.ids[0] = true;
      }
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var extendedOptions = Utils.extend({}, options, {
      hooks: this.hooks,
      protoAccessControl: this.protoAccessControl
    });
    var result = env.VM.invokePartial.call(this, partial, context, extendedOptions);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, extendedOptions);
    }

    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');

        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }

        result = lines.join('\n');
      }

      return result;
    } else {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  } // Just add water


  var container = {
    strict: function
    /*istanbul ignore next*/
    strict(obj, name, loc) {
      if (!obj || !(name in obj)) {
        throw new
        /*istanbul ignore next*/
        _exception[
        /*istanbul ignore next*/
        "default"]('"' + name + '" not defined in ' + obj, {
          loc: loc
        });
      }

      return container.lookupProperty(obj, name);
    },
    lookupProperty: function
    /*istanbul ignore next*/
    lookupProperty(parent, propertyName) {
      var result = parent[propertyName];

      if (result == null) {
        return result;
      }

      if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
        return result;
      }

      if (
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _protoAccess.
      /*istanbul ignore next*/
      resultIsAllowed)(result, container.protoAccessControl, propertyName)) {
        return result;
      }

      return undefined;
    },
    lookup: function
    /*istanbul ignore next*/
    lookup(depths, name) {
      var len = depths.length;

      for (var i = 0; i < len; i++) {
        var result = depths[i] && container.lookupProperty(depths[i], name);

        if (result != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function
    /*istanbul ignore next*/
    lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    fn: function
    /*istanbul ignore next*/
    fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },
    programs: [],
    program: function
    /*istanbul ignore next*/
    program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);

      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }

      return programWrapper;
    },
    data: function
    /*istanbul ignore next*/
    data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }

      return value;
    },
    mergeIfNeeded: function
    /*istanbul ignore next*/
    mergeIfNeeded(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },
    // An empty object to use as replacement for null-contexts
    nullContext: Object.seal({}),
    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    /*istanbul ignore next*/
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var data = options.data;

    ret._setup(options);

    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }

    var depths,
        blockParams = templateSpec.useBlockParams ? [] : undefined;

    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context
    /*, options*/
    ) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }

    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }

  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      var mergedHelpers = Utils.extend({}, env.helpers, options.helpers);
      wrapHelpersToPassLookupProperty(mergedHelpers, container);
      container.helpers = mergedHelpers;

      if (templateSpec.usePartial) {
        // Use mergeIfNeeded here to prevent compiling global partials multiple times
        container.partials = container.mergeIfNeeded(options.partials, env.partials);
      }

      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = Utils.extend({}, env.decorators, options.decorators);
      }

      container.hooks = {};
      container.protoAccessControl =
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _protoAccess.
      /*istanbul ignore next*/
      createProtoAccessControl)(options);
      var keepHelperInHelpers = options.allowCallsToHelperMissing || templateWasPrecompiledWithCompilerV7;

      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _helpers.
      /*istanbul ignore next*/
      moveHelperToHooks)(container, 'helperMissing', keepHelperInHelpers);

      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _helpers.
      /*istanbul ignore next*/
      moveHelperToHooks)(container, 'blockHelperMissing', keepHelperInHelpers);
    } else {
      container.protoAccessControl = options.protoAccessControl; // internal option

      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
      container.hooks = options.hooks;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('must pass block params');
    }

    if (templateSpec.useDepths && !depths) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };

  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    /*istanbul ignore next*/
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var currentDepths = depths;

    if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);
  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}
/**
 * This is currently part of the official API, therefore implementation details should not be changed.
 */


function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      partial = options.data['partial-block'];
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }

  return partial;
}

function invokePartial(partial, context, options) {
  // Use the current closure context to save the partial-block if this partial
  var currentPartialBlock = options.data && options.data['partial-block'];
  options.partial = true;

  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock;

  if (options.fn && options.fn !== noop) {
    options.data =
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _base.
    /*istanbul ignore next*/
    createFrame)(options.data); // Wrapper function to get access to currentPartialBlock from the closure

    var fn = options.fn;

    partialBlock = options.data['partial-block'] = function partialBlockWrapper(context) {
      /*istanbul ignore next*/
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Restore the partial-block from the closure for the execution of the block
      // i.e. the part inside the block of the partial call.
      options.data =
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _base.
      /*istanbul ignore next*/
      createFrame)(options.data);
      options.data['partial-block'] = currentPartialBlock;
      return fn(context, options);
    };

    if (fn.partials) {
      options.partials = Utils.extend({}, options.partials, fn.partials);
    }
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new
    /*istanbul ignore next*/
    _exception[
    /*istanbul ignore next*/
    "default"]('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ?
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _base.
    /*istanbul ignore next*/
    createFrame)(data) : {};
    data.root = context;
  }

  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }

  return prog;
}

function wrapHelpersToPassLookupProperty(mergedHelpers, container) {
  Object.keys(mergedHelpers).forEach(function (helperName) {
    var helper = mergedHelpers[helperName];
    mergedHelpers[helperName] = passLookupPropertyOption(helper, container);
  });
}

function passLookupPropertyOption(helper, container) {
  var lookupProperty = container.lookupProperty;
  return (
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _wrapHelper.
    /*istanbul ignore next*/
    wrapHelper)(helper, function (options) {
      return Utils.extend({
        lookupProperty: lookupProperty
      }, options);
    })
  );
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3J1bnRpbWUuanMiXSwibmFtZXMiOlsiY2hlY2tSZXZpc2lvbiIsImNvbXBpbGVySW5mbyIsImNvbXBpbGVyUmV2aXNpb24iLCJjdXJyZW50UmV2aXNpb24iLCJDT01QSUxFUl9SRVZJU0lPTiIsIkxBU1RfQ09NUEFUSUJMRV9DT01QSUxFUl9SRVZJU0lPTiIsInJ1bnRpbWVWZXJzaW9ucyIsIlJFVklTSU9OX0NIQU5HRVMiLCJjb21waWxlclZlcnNpb25zIiwiRXhjZXB0aW9uIiwidGVtcGxhdGUiLCJ0ZW1wbGF0ZVNwZWMiLCJlbnYiLCJtYWluIiwiZGVjb3JhdG9yIiwibWFpbl9kIiwiVk0iLCJjb21waWxlciIsInRlbXBsYXRlV2FzUHJlY29tcGlsZWRXaXRoQ29tcGlsZXJWNyIsImludm9rZVBhcnRpYWxXcmFwcGVyIiwicGFydGlhbCIsImNvbnRleHQiLCJvcHRpb25zIiwiaGFzaCIsIlV0aWxzIiwiZXh0ZW5kIiwiaWRzIiwicmVzb2x2ZVBhcnRpYWwiLCJjYWxsIiwiZXh0ZW5kZWRPcHRpb25zIiwiaG9va3MiLCJwcm90b0FjY2Vzc0NvbnRyb2wiLCJyZXN1bHQiLCJpbnZva2VQYXJ0aWFsIiwiY29tcGlsZSIsInBhcnRpYWxzIiwibmFtZSIsImNvbXBpbGVyT3B0aW9ucyIsImluZGVudCIsImxpbmVzIiwic3BsaXQiLCJpIiwibCIsImxlbmd0aCIsImpvaW4iLCJjb250YWluZXIiLCJzdHJpY3QiLCJvYmoiLCJsb2MiLCJsb29rdXBQcm9wZXJ0eSIsInBhcmVudCIsInByb3BlcnR5TmFtZSIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwicmVzdWx0SXNBbGxvd2VkIiwidW5kZWZpbmVkIiwibG9va3VwIiwiZGVwdGhzIiwibGVuIiwibGFtYmRhIiwiY3VycmVudCIsImVzY2FwZUV4cHJlc3Npb24iLCJmbiIsInJldCIsInByb2dyYW1zIiwicHJvZ3JhbSIsImRhdGEiLCJkZWNsYXJlZEJsb2NrUGFyYW1zIiwiYmxvY2tQYXJhbXMiLCJwcm9ncmFtV3JhcHBlciIsIndyYXBQcm9ncmFtIiwidmFsdWUiLCJkZXB0aCIsIl9wYXJlbnQiLCJtZXJnZUlmTmVlZGVkIiwicGFyYW0iLCJjb21tb24iLCJudWxsQ29udGV4dCIsInNlYWwiLCJub29wIiwiX3NldHVwIiwidXNlRGF0YSIsImluaXREYXRhIiwidXNlQmxvY2tQYXJhbXMiLCJ1c2VEZXB0aHMiLCJjb25jYXQiLCJoZWxwZXJzIiwiZXhlY3V0ZURlY29yYXRvcnMiLCJpc1RvcCIsIm1lcmdlZEhlbHBlcnMiLCJ3cmFwSGVscGVyc1RvUGFzc0xvb2t1cFByb3BlcnR5IiwidXNlUGFydGlhbCIsInVzZURlY29yYXRvcnMiLCJkZWNvcmF0b3JzIiwiY3JlYXRlUHJvdG9BY2Nlc3NDb250cm9sIiwia2VlcEhlbHBlckluSGVscGVycyIsImFsbG93Q2FsbHNUb0hlbHBlck1pc3NpbmciLCJtb3ZlSGVscGVyVG9Ib29rcyIsIl9jaGlsZCIsInByb2ciLCJjdXJyZW50RGVwdGhzIiwiY3VycmVudFBhcnRpYWxCbG9jayIsImNvbnRleHRQYXRoIiwicGFydGlhbEJsb2NrIiwiY3JlYXRlRnJhbWUiLCJwYXJ0aWFsQmxvY2tXcmFwcGVyIiwiRnVuY3Rpb24iLCJyb290IiwicHJvcHMiLCJrZXlzIiwiZm9yRWFjaCIsImhlbHBlck5hbWUiLCJoZWxwZXIiLCJwYXNzTG9va3VwUHJvcGVydHlPcHRpb24iLCJ3cmFwSGVscGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBTUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7QUFLTyxTQUFTQSxhQUFULENBQXVCQyxZQUF2QixFQUFxQztBQUMxQyxNQUFNQyxnQkFBZ0IsR0FBSUQsWUFBWSxJQUFJQSxZQUFZLENBQUMsQ0FBRCxDQUE3QixJQUFxQyxDQUE5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b24gZnJvbSAnLi9leGNlcHRpb24nO1xuaW1wb3J0IHtcbiAgQ09NUElMRVJfUkVWSVNJT04sXG4gIGNyZWF0ZUZyYW1lLFxuICBMQVNUX0NPTVBBVElCTEVfQ09NUElMRVJfUkVWSVNJT04sXG4gIFJFVklTSU9OX0NIQU5HRVNcbn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7IG1vdmVIZWxwZXJUb0hvb2tzIH0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCB7IHdyYXBIZWxwZXIgfSBmcm9tICcuL2ludGVybmFsL3dyYXBIZWxwZXInO1xuaW1wb3J0IHtcbiAgY3JlYXRlUHJvdG9BY2Nlc3NDb250cm9sLFxuICByZXN1bHRJc0FsbG93ZWRcbn0gZnJvbSAnLi9pbnRlcm5hbC9wcm90by1hY2Nlc3MnO1xuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tSZXZpc2lvbihjb21waWxlckluZm8pIHtcbiAgY29uc3QgY29tcGlsZXJSZXZpc2lvbiA9IChjb21waWxlckluZm8gJiYgY29tcGlsZXJJbmZvWzBdKSB8fCAxLFxuICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChcbiAgICBjb21waWxlclJldmlzaW9uID49IExBU1RfQ09NUEFUSUJMRV9DT01QSUxFUl9SRVZJU0lPTiAmJlxuICAgIGNvbXBpbGVyUmV2aXNpb24gPD0gQ09NUElMRVJfUkVWSVNJT05cbiAgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBMQVNUX0NPTVBBVElCTEVfQ09NUElMRVJfUkVWSVNJT04pIHtcbiAgICBjb25zdCBydW50aW1lVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2N1cnJlbnRSZXZpc2lvbl0sXG4gICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgJ1RlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGFuIG9sZGVyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuICcgK1xuICAgICAgICAnUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArXG4gICAgICAgIHJ1bnRpbWVWZXJzaW9ucyArXG4gICAgICAgICcpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoJyArXG4gICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgK1xuICAgICAgICAnKS4nXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBVc2UgdGhlIGVtYmVkZGVkIHZlcnNpb24gaW5mbyBzaW5jZSB0aGUgcnVudGltZSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcyByZXZpc2lvbiB5ZXRcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgJ1RlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGEgbmV3ZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArXG4gICAgICAgICdQbGVhc2UgdXBkYXRlIHlvdXIgcnVudGltZSB0byBhIG5ld2VyIHZlcnNpb24gKCcgK1xuICAgICAgICBjb21waWxlckluZm9bMV0gK1xuICAgICAgICAnKS4nXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGUnKTtcbiAgfVxuICBpZiAoIXRlbXBsYXRlU3BlYyB8fCAhdGVtcGxhdGVTcGVjLm1haW4pIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdVbmtub3duIHRlbXBsYXRlIG9iamVjdDogJyArIHR5cGVvZiB0ZW1wbGF0ZVNwZWMpO1xuICB9XG5cbiAgdGVtcGxhdGVTcGVjLm1haW4uZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjLm1haW5fZDtcblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHNldWRvLXN1cHBvcnRlZCBBUElzLlxuICBlbnYuVk0uY2hlY2tSZXZpc2lvbih0ZW1wbGF0ZVNwZWMuY29tcGlsZXIpO1xuXG4gIC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGZvciBwcmVjb21waWxlZCB0ZW1wbGF0ZXMgd2l0aCBjb21waWxlci12ZXJzaW9uIDcgKDw0LjMuMClcbiAgY29uc3QgdGVtcGxhdGVXYXNQcmVjb21waWxlZFdpdGhDb21waWxlclY3ID1cbiAgICB0ZW1wbGF0ZVNwZWMuY29tcGlsZXIgJiYgdGVtcGxhdGVTcGVjLmNvbXBpbGVyWzBdID09PSA3O1xuXG4gIGZ1bmN0aW9uIGludm9rZVBhcnRpYWxXcmFwcGVyKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgICBjb250ZXh0ID0gVXRpbHMuZXh0ZW5kKHt9LCBjb250ZXh0LCBvcHRpb25zLmhhc2gpO1xuICAgICAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIG9wdGlvbnMuaWRzWzBdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGFydGlhbCA9IGVudi5WTS5yZXNvbHZlUGFydGlhbC5jYWxsKHRoaXMsIHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpO1xuXG4gICAgbGV0IGV4dGVuZGVkT3B0aW9ucyA9IFV0aWxzLmV4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgaG9va3M6IHRoaXMuaG9va3MsXG4gICAgICBwcm90b0FjY2Vzc0NvbnRyb2w6IHRoaXMucHJvdG9BY2Nlc3NDb250cm9sXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gZW52LlZNLmludm9rZVBhcnRpYWwuY2FsbChcbiAgICAgIHRoaXMsXG4gICAgICBwYXJ0aWFsLFxuICAgICAgY29udGV4dCxcbiAgICAgIGV4dGVuZGVkT3B0aW9uc1xuICAgICk7XG5cbiAgICBpZiAocmVzdWx0ID09IG51bGwgJiYgZW52LmNvbXBpbGUpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXSA9IGVudi5jb21waWxlKFxuICAgICAgICBwYXJ0aWFsLFxuICAgICAgICB0ZW1wbGF0ZVNwZWMuY29tcGlsZXJPcHRpb25zLFxuICAgICAgICBlbnZcbiAgICAgICk7XG4gICAgICByZXN1bHQgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0oY29udGV4dCwgZXh0ZW5kZWRPcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICBpZiAob3B0aW9ucy5pbmRlbnQpIHtcbiAgICAgICAgbGV0IGxpbmVzID0gcmVzdWx0LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoIWxpbmVzW2ldICYmIGkgKyAxID09PSBsKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaW5lc1tpXSA9IG9wdGlvbnMuaW5kZW50ICsgbGluZXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gbGluZXMuam9pbignXFxuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgICAnVGhlIHBhcnRpYWwgJyArXG4gICAgICAgICAgb3B0aW9ucy5uYW1lICtcbiAgICAgICAgICAnIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGUnXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIGxldCBjb250YWluZXIgPSB7XG4gICAgc3RyaWN0OiBmdW5jdGlvbihvYmosIG5hbWUsIGxvYykge1xuICAgICAgaWYgKCFvYmogfHwgIShuYW1lIGluIG9iaikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignXCInICsgbmFtZSArICdcIiBub3QgZGVmaW5lZCBpbiAnICsgb2JqLCB7XG4gICAgICAgICAgbG9jOiBsb2NcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5KG9iaiwgbmFtZSk7XG4gICAgfSxcbiAgICBsb29rdXBQcm9wZXJ0eTogZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgIGxldCByZXN1bHQgPSBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdElzQWxsb3dlZChyZXN1bHQsIGNvbnRhaW5lci5wcm90b0FjY2Vzc0NvbnRyb2wsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBsb29rdXA6IGZ1bmN0aW9uKGRlcHRocywgbmFtZSkge1xuICAgICAgY29uc3QgbGVuID0gZGVwdGhzLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGRlcHRoc1tpXSAmJiBjb250YWluZXIubG9va3VwUHJvcGVydHkoZGVwdGhzW2ldLCBuYW1lKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcHRoc1tpXVtuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbGFtYmRhOiBmdW5jdGlvbihjdXJyZW50LCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGN1cnJlbnQgPT09ICdmdW5jdGlvbicgPyBjdXJyZW50LmNhbGwoY29udGV4dCkgOiBjdXJyZW50O1xuICAgIH0sXG5cbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuXG4gICAgZm46IGZ1bmN0aW9uKGkpIHtcbiAgICAgIGxldCByZXQgPSB0ZW1wbGF0ZVNwZWNbaV07XG4gICAgICByZXQuZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjW2kgKyAnX2QnXTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgICBsZXQgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldLFxuICAgICAgICBmbiA9IHRoaXMuZm4oaSk7XG4gICAgICBpZiAoZGF0YSB8fCBkZXB0aHMgfHwgYmxvY2tQYXJhbXMgfHwgZGVjbGFyZWRCbG9ja1BhcmFtcykge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHdyYXBQcm9ncmFtKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBmbixcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGRlY2xhcmVkQmxvY2tQYXJhbXMsXG4gICAgICAgICAgYmxvY2tQYXJhbXMsXG4gICAgICAgICAgZGVwdGhzXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSB3cmFwUHJvZ3JhbSh0aGlzLCBpLCBmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvZ3JhbVdyYXBwZXI7XG4gICAgfSxcblxuICAgIGRhdGE6IGZ1bmN0aW9uKHZhbHVlLCBkZXB0aCkge1xuICAgICAgd2hpbGUgKHZhbHVlICYmIGRlcHRoLS0pIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5fcGFyZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gICAgbWVyZ2VJZk5lZWRlZDogZnVuY3Rpb24ocGFyYW0sIGNvbW1vbikge1xuICAgICAgbGV0IG9iaiA9IHBhcmFtIHx8IGNvbW1vbjtcblxuICAgICAgaWYgKHBhcmFtICYmIGNvbW1vbiAmJiBwYXJhbSAhPT0gY29tbW9uKSB7XG4gICAgICAgIG9iaiA9IFV0aWxzLmV4dGVuZCh7fSwgY29tbW9uLCBwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcbiAgICAvLyBBbiBlbXB0eSBvYmplY3QgdG8gdXNlIGFzIHJlcGxhY2VtZW50IGZvciBudWxsLWNvbnRleHRzXG4gICAgbnVsbENvbnRleHQ6IE9iamVjdC5zZWFsKHt9KSxcblxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogdGVtcGxhdGVTcGVjLmNvbXBpbGVyXG4gIH07XG5cbiAgZnVuY3Rpb24gcmV0KGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBkYXRhID0gb3B0aW9ucy5kYXRhO1xuXG4gICAgcmV0Ll9zZXR1cChvcHRpb25zKTtcbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCAmJiB0ZW1wbGF0ZVNwZWMudXNlRGF0YSkge1xuICAgICAgZGF0YSA9IGluaXREYXRhKGNvbnRleHQsIGRhdGEpO1xuICAgIH1cbiAgICBsZXQgZGVwdGhzLFxuICAgICAgYmxvY2tQYXJhbXMgPSB0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgPyBbXSA6IHVuZGVmaW5lZDtcbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocykge1xuICAgICAgaWYgKG9wdGlvbnMuZGVwdGhzKSB7XG4gICAgICAgIGRlcHRocyA9XG4gICAgICAgICAgY29udGV4dCAhPSBvcHRpb25zLmRlcHRoc1swXVxuICAgICAgICAgICAgPyBbY29udGV4dF0uY29uY2F0KG9wdGlvbnMuZGVwdGhzKVxuICAgICAgICAgICAgOiBvcHRpb25zLmRlcHRocztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlcHRocyA9IFtjb250ZXh0XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWluKGNvbnRleHQgLyosIG9wdGlvbnMqLykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgJycgK1xuICAgICAgICB0ZW1wbGF0ZVNwZWMubWFpbihcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICBjb250YWluZXIuaGVscGVycyxcbiAgICAgICAgICBjb250YWluZXIucGFydGlhbHMsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBibG9ja1BhcmFtcyxcbiAgICAgICAgICBkZXB0aHNcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBtYWluID0gZXhlY3V0ZURlY29yYXRvcnMoXG4gICAgICB0ZW1wbGF0ZVNwZWMubWFpbixcbiAgICAgIG1haW4sXG4gICAgICBjb250YWluZXIsXG4gICAgICBvcHRpb25zLmRlcHRocyB8fCBbXSxcbiAgICAgIGRhdGEsXG4gICAgICBibG9ja1BhcmFtc1xuICAgICk7XG4gICAgcmV0dXJuIG1haW4oY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cblxuICByZXQuaXNUb3AgPSB0cnVlO1xuXG4gIHJldC5fc2V0dXAgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGxldCBtZXJnZWRIZWxwZXJzID0gVXRpbHMuZXh0ZW5kKHt9LCBlbnYuaGVscGVycywgb3B0aW9ucy5oZWxwZXJzKTtcbiAgICAgIHdyYXBIZWxwZXJzVG9QYXNzTG9va3VwUHJvcGVydHkobWVyZ2VkSGVscGVycywgY29udGFpbmVyKTtcbiAgICAgIGNvbnRhaW5lci5oZWxwZXJzID0gbWVyZ2VkSGVscGVycztcblxuICAgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VQYXJ0aWFsKSB7XG4gICAgICAgIC8vIFVzZSBtZXJnZUlmTmVlZGVkIGhlcmUgdG8gcHJldmVudCBjb21waWxpbmcgZ2xvYmFsIHBhcnRpYWxzIG11bHRpcGxlIHRpbWVzXG4gICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IGNvbnRhaW5lci5tZXJnZUlmTmVlZGVkKFxuICAgICAgICAgIG9wdGlvbnMucGFydGlhbHMsXG4gICAgICAgICAgZW52LnBhcnRpYWxzXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAodGVtcGxhdGVTcGVjLnVzZVBhcnRpYWwgfHwgdGVtcGxhdGVTcGVjLnVzZURlY29yYXRvcnMpIHtcbiAgICAgICAgY29udGFpbmVyLmRlY29yYXRvcnMgPSBVdGlscy5leHRlbmQoXG4gICAgICAgICAge30sXG4gICAgICAgICAgZW52LmRlY29yYXRvcnMsXG4gICAgICAgICAgb3B0aW9ucy5kZWNvcmF0b3JzXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lci5ob29rcyA9IHt9O1xuICAgICAgY29udGFpbmVyLnByb3RvQWNjZXNzQ29udHJvbCA9IGNyZWF0ZVByb3RvQWNjZXNzQ29udHJvbChvcHRpb25zKTtcblxuICAgICAgbGV0IGtlZXBIZWxwZXJJbkhlbHBlcnMgPVxuICAgICAgICBvcHRpb25zLmFsbG93Q2FsbHNUb0hlbHBlck1pc3NpbmcgfHxcbiAgICAgICAgdGVtcGxhdGVXYXNQcmVjb21waWxlZFdpdGhDb21waWxlclY3O1xuICAgICAgbW92ZUhlbHBlclRvSG9va3MoY29udGFpbmVyLCAnaGVscGVyTWlzc2luZycsIGtlZXBIZWxwZXJJbkhlbHBlcnMpO1xuICAgICAgbW92ZUhlbHBlclRvSG9va3MoY29udGFpbmVyLCAnYmxvY2tIZWxwZXJNaXNzaW5nJywga2VlcEhlbHBlckluSGVscGVycyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5wcm90b0FjY2Vzc0NvbnRyb2wgPSBvcHRpb25zLnByb3RvQWNjZXNzQ29udHJvbDsgLy8gaW50ZXJuYWwgb3B0aW9uXG4gICAgICBjb250YWluZXIuaGVscGVycyA9IG9wdGlvbnMuaGVscGVycztcbiAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgICBjb250YWluZXIuZGVjb3JhdG9ycyA9IG9wdGlvbnMuZGVjb3JhdG9ycztcbiAgICAgIGNvbnRhaW5lci5ob29rcyA9IG9wdGlvbnMuaG9va3M7XG4gICAgfVxuICB9O1xuXG4gIHJldC5fY2hpbGQgPSBmdW5jdGlvbihpLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyAmJiAhYmxvY2tQYXJhbXMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ211c3QgcGFzcyBibG9jayBwYXJhbXMnKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMgJiYgIWRlcHRocykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignbXVzdCBwYXNzIHBhcmVudCBkZXB0aHMnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gd3JhcFByb2dyYW0oXG4gICAgICBjb250YWluZXIsXG4gICAgICBpLFxuICAgICAgdGVtcGxhdGVTcGVjW2ldLFxuICAgICAgZGF0YSxcbiAgICAgIDAsXG4gICAgICBibG9ja1BhcmFtcyxcbiAgICAgIGRlcHRoc1xuICAgICk7XG4gIH07XG4gIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwUHJvZ3JhbShcbiAgY29udGFpbmVyLFxuICBpLFxuICBmbixcbiAgZGF0YSxcbiAgZGVjbGFyZWRCbG9ja1BhcmFtcyxcbiAgYmxvY2tQYXJhbXMsXG4gIGRlcHRoc1xuKSB7XG4gIGZ1bmN0aW9uIHByb2coY29udGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGN1cnJlbnREZXB0aHMgPSBkZXB0aHM7XG4gICAgaWYgKFxuICAgICAgZGVwdGhzICYmXG4gICAgICBjb250ZXh0ICE9IGRlcHRoc1swXSAmJlxuICAgICAgIShjb250ZXh0ID09PSBjb250YWluZXIubnVsbENvbnRleHQgJiYgZGVwdGhzWzBdID09PSBudWxsKVxuICAgICkge1xuICAgICAgY3VycmVudERlcHRocyA9IFtjb250ZXh0XS5jb25jYXQoZGVwdGhzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm4oXG4gICAgICBjb250YWluZXIsXG4gICAgICBjb250ZXh0LFxuICAgICAgY29udGFpbmVyLmhlbHBlcnMsXG4gICAgICBjb250YWluZXIucGFydGlhbHMsXG4gICAgICBvcHRpb25zLmRhdGEgfHwgZGF0YSxcbiAgICAgIGJsb2NrUGFyYW1zICYmIFtvcHRpb25zLmJsb2NrUGFyYW1zXS5jb25jYXQoYmxvY2tQYXJhbXMpLFxuICAgICAgY3VycmVudERlcHRoc1xuICAgICk7XG4gIH1cblxuICBwcm9nID0gZXhlY3V0ZURlY29yYXRvcnMoZm4sIHByb2csIGNvbnRhaW5lciwgZGVwdGhzLCBkYXRhLCBibG9ja1BhcmFtcyk7XG5cbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IGRlcHRocyA/IGRlcHRocy5sZW5ndGggOiAwO1xuICBwcm9nLmJsb2NrUGFyYW1zID0gZGVjbGFyZWRCbG9ja1BhcmFtcyB8fCAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGN1cnJlbnRseSBwYXJ0IG9mIHRoZSBvZmZpY2lhbCBBUEksIHRoZXJlZm9yZSBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIHNob3VsZCBub3QgYmUgY2hhbmdlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVQYXJ0aWFsKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKCFwYXJ0aWFsKSB7XG4gICAgaWYgKG9wdGlvbnMubmFtZSA9PT0gJ0BwYXJ0aWFsLWJsb2NrJykge1xuICAgICAgcGFydGlhbCA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdO1xuICAgIH1cbiAgfSBlbHNlIGlmICghcGFydGlhbC5jYWxsICYmICFvcHRpb25zLm5hbWUpIHtcbiAgICAvLyBUaGlzIGlzIGEgZHluYW1pYyBwYXJ0aWFsIHRoYXQgcmV0dXJuZWQgYSBzdHJpbmdcbiAgICBvcHRpb25zLm5hbWUgPSBwYXJ0aWFsO1xuICAgIHBhcnRpYWwgPSBvcHRpb25zLnBhcnRpYWxzW3BhcnRpYWxdO1xuICB9XG4gIHJldHVybiBwYXJ0aWFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIC8vIFVzZSB0aGUgY3VycmVudCBjbG9zdXJlIGNvbnRleHQgdG8gc2F2ZSB0aGUgcGFydGlhbC1ibG9jayBpZiB0aGlzIHBhcnRpYWxcbiAgY29uc3QgY3VycmVudFBhcnRpYWxCbG9jayA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXTtcbiAgb3B0aW9ucy5wYXJ0aWFsID0gdHJ1ZTtcbiAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoID0gb3B0aW9ucy5pZHNbMF0gfHwgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoO1xuICB9XG5cbiAgbGV0IHBhcnRpYWxCbG9jaztcbiAgaWYgKG9wdGlvbnMuZm4gJiYgb3B0aW9ucy5mbiAhPT0gbm9vcCkge1xuICAgIG9wdGlvbnMuZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgLy8gV3JhcHBlciBmdW5jdGlvbiB0byBnZXQgYWNjZXNzIHRvIGN1cnJlbnRQYXJ0aWFsQmxvY2sgZnJvbSB0aGUgY2xvc3VyZVxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm47XG4gICAgcGFydGlhbEJsb2NrID0gb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ10gPSBmdW5jdGlvbiBwYXJ0aWFsQmxvY2tXcmFwcGVyKFxuICAgICAgY29udGV4dCxcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgICkge1xuICAgICAgLy8gUmVzdG9yZSB0aGUgcGFydGlhbC1ibG9jayBmcm9tIHRoZSBjbG9zdXJlIGZvciB0aGUgZXhlY3V0aW9uIG9mIHRoZSBibG9ja1xuICAgICAgLy8gaS5lLiB0aGUgcGFydCBpbnNpZGUgdGhlIGJsb2NrIG9mIHRoZSBwYXJ0aWFsIGNhbGwuXG4gICAgICBvcHRpb25zLmRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ10gPSBjdXJyZW50UGFydGlhbEJsb2NrO1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH07XG4gICAgaWYgKGZuLnBhcnRpYWxzKSB7XG4gICAgICBvcHRpb25zLnBhcnRpYWxzID0gVXRpbHMuZXh0ZW5kKHt9LCBvcHRpb25zLnBhcnRpYWxzLCBmbi5wYXJ0aWFscyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCAmJiBwYXJ0aWFsQmxvY2spIHtcbiAgICBwYXJ0aWFsID0gcGFydGlhbEJsb2NrO1xuICB9XG5cbiAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1RoZSBwYXJ0aWFsICcgKyBvcHRpb25zLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICB9IGVsc2UgaWYgKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkge1xuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGluaXREYXRhKGNvbnRleHQsIGRhdGEpIHtcbiAgaWYgKCFkYXRhIHx8ICEoJ3Jvb3QnIGluIGRhdGEpKSB7XG4gICAgZGF0YSA9IGRhdGEgPyBjcmVhdGVGcmFtZShkYXRhKSA6IHt9O1xuICAgIGRhdGEucm9vdCA9IGNvbnRleHQ7XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59XG5cbmZ1bmN0aW9uIGV4ZWN1dGVEZWNvcmF0b3JzKGZuLCBwcm9nLCBjb250YWluZXIsIGRlcHRocywgZGF0YSwgYmxvY2tQYXJhbXMpIHtcbiAgaWYgKGZuLmRlY29yYXRvcikge1xuICAgIGxldCBwcm9wcyA9IHt9O1xuICAgIHByb2cgPSBmbi5kZWNvcmF0b3IoXG4gICAgICBwcm9nLFxuICAgICAgcHJvcHMsXG4gICAgICBjb250YWluZXIsXG4gICAgICBkZXB0aHMgJiYgZGVwdGhzWzBdLFxuICAgICAgZGF0YSxcbiAgICAgIGJsb2NrUGFyYW1zLFxuICAgICAgZGVwdGhzXG4gICAgKTtcbiAgICBVdGlscy5leHRlbmQocHJvZywgcHJvcHMpO1xuICB9XG4gIHJldHVybiBwcm9nO1xufVxuXG5mdW5jdGlvbiB3cmFwSGVscGVyc1RvUGFzc0xvb2t1cFByb3BlcnR5KG1lcmdlZEhlbHBlcnMsIGNvbnRhaW5lcikge1xuICBPYmplY3Qua2V5cyhtZXJnZWRIZWxwZXJzKS5mb3JFYWNoKGhlbHBlck5hbWUgPT4ge1xuICAgIGxldCBoZWxwZXIgPSBtZXJnZWRIZWxwZXJzW2hlbHBlck5hbWVdO1xuICAgIG1lcmdlZEhlbHBlcnNbaGVscGVyTmFtZV0gPSBwYXNzTG9va3VwUHJvcGVydHlPcHRpb24oaGVscGVyLCBjb250YWluZXIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcGFzc0xvb2t1cFByb3BlcnR5T3B0aW9uKGhlbHBlciwgY29udGFpbmVyKSB7XG4gIGNvbnN0IGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5O1xuICByZXR1cm4gd3JhcEhlbHBlcihoZWxwZXIsIG9wdGlvbnMgPT4ge1xuICAgIHJldHVybiBVdGlscy5leHRlbmQoeyBsb29rdXBQcm9wZXJ0eSB9LCBvcHRpb25zKTtcbiAgfSk7XG59XG4iXX0=
