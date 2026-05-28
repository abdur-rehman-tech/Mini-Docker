/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var
/*istanbul ignore next*/
_base = require("../base");

var
/*istanbul ignore next*/
_exception = _interopRequireDefault(require("../exception"));

var
/*istanbul ignore next*/
_utils = require("../utils");

var
/*istanbul ignore next*/
_codeGen = _interopRequireDefault(require("./code-gen"));

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Literal(value) {
  this.value = value;
}

function JavaScriptCompiler() {}

JavaScriptCompiler.prototype = {
  // PUBLIC API: You can override these methods in a subclass to provide
  // alternative compiled forms for name lookup and buffering semantics
  nameLookup: function
  /*istanbul ignore next*/
  nameLookup(parent, name
  /*,  type */
  ) {
    return this.internalNameLookup(parent, name);
  },
  depthedLookup: function
  /*istanbul ignore next*/
  depthedLookup(name) {
    return [this.aliasable('container.lookup'), '(depths, ', JSON.stringify(name), ')'];
  },
  compilerInfo: function
  /*istanbul ignore next*/
  compilerInfo() {
    var revision =
    /*istanbul ignore next*/
    _base.
    /*istanbul ignore next*/
    COMPILER_REVISION,
        versions =
    /*istanbul ignore next*/
    _base.
    /*istanbul ignore next*/
    REVISION_CHANGES[revision];
    return [revision, versions];
  },
  appendToBuffer: function
  /*istanbul ignore next*/
  appendToBuffer(source, location, explicit) {
    // Force a source as this simplifies the merge logic.
    if (!
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    isArray)(source)) {
      source = [source];
    }

    source = this.source.wrap(source, location);

    if (this.environment.isSimple) {
      return ['return ', source, ';'];
    } else if (explicit) {
      // This is a case where the buffer operation occurs as a child of another
      // construct, generally braces. We have to explicitly output these buffer
      // operations to ensure that the emitted code goes in the correct location.
      return ['buffer += ', source, ';'];
    } else {
      source.appendToBuffer = true;
      return source;
    }
  },
  initializeBuffer: function
  /*istanbul ignore next*/
  initializeBuffer() {
    return this.quotedString('');
  },
  // END PUBLIC API
  internalNameLookup: function
  /*istanbul ignore next*/
  internalNameLookup(parent, name) {
    this.lookupPropertyFunctionIsUsed = true;
    return ['lookupProperty(', parent, ',', JSON.stringify(name), ')'];
  },
  lookupPropertyFunctionIsUsed: false,
  compile: function
  /*istanbul ignore next*/
  compile(environment, options, context, asObject) {
    this.environment = environment;
    this.options = options;
    this.stringParams = this.options.stringParams;
    this.trackIds = this.options.trackIds;
    this.precompile = !asObject;
    this.name = this.environment.name;
    this.isChild = !!context;
    this.context = context || {
      decorators: [],
      programs: [],
      environments: []
    };
    this.preamble();
    this.stackSlot = 0;
    this.stackVars = [];
    this.aliases = {};
    this.registers = {
      list: []
    };
    this.hashes = [];
    this.compileStack = [];
    this.inlineStack = [];
    this.blockParams = [];
    this.compileChildren(environment, options);
    this.useDepths = this.useDepths || environment.useDepths || environment.useDecorators || this.options.compat;
    this.useBlockParams = this.useBlockParams || environment.useBlockParams;
    var opcodes = environment.opcodes,
        opcode,
        firstLoc,
        i,
        l;

    for (i = 0, l = opcodes.length; i < l; i++) {
      opcode = opcodes[i];
      this.source.currentLocation = opcode.loc;
      firstLoc = firstLoc || opcode.loc;
      this[opcode.opcode].apply(this, opcode.args);
    } // Flush any trailing content that might be pending.


    this.source.currentLocation = firstLoc;
    this.pushSource('');
    /* istanbul ignore next */

    if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('Compile completed with content left on stack');
    }

    if (!this.decorators.isEmpty()) {
      this.useDecorators = true;
      this.decorators.prepend(['var decorators = container.decorators, ', this.lookupPropertyFunctionVarDeclaration(), ';\n']);
      this.decorators.push('return fn;');

      if (asObject) {
        this.decorators = Function.apply(this, ['fn', 'props', 'container', 'depth0', 'data', 'blockParams', 'depths', this.decorators.merge()]);
      } else {
        this.decorators.prepend('function(fn, props, container, depth0, data, blockParams, depths) {\n');
        this.decorators.push('}\n');
        this.decorators = this.decorators.merge();
      }
    } else {
      this.decorators = undefined;
    }

    var fn = this.createFunctionContext(asObject);

    if (!this.isChild) {
      var ret = {
        compiler: this.compilerInfo(),
        main: fn
      };

      if (this.decorators) {
        ret.main_d = this.decorators; // eslint-disable-line camelcase

        ret.useDecorators = true;
      }

      /*istanbul ignore next*/
      var _this$context = this.context,
          programs = _this$context.programs,
          decorators = _this$context.decorators;

      for (i = 0, l = programs.length; i < l; i++) {
        if (programs[i]) {
          ret[i] = programs[i];

          if (decorators[i]) {
            ret[i + '_d'] = decorators[i];
            ret.useDecorators = true;
          }
        }
      }

      if (this.environment.usePartial) {
        ret.usePartial = true;
      }

      if (this.options.data) {
        ret.useData = true;
      }

      if (this.useDepths) {
        ret.useDepths = true;
      }

      if (this.useBlockParams) {
        ret.useBlockParams = true;
      }

      if (this.options.compat) {
        ret.compat = true;
      }

      if (!asObject) {
        ret.compiler = JSON.stringify(ret.compiler);
        this.source.currentLocation = {
          start: {
            line: 1,
            column: 0
          }
        };
        ret = this.objectLiteral(ret);

        if (options.srcName) {
          ret = ret.toStringWithSourceMap({
            file: options.destName
          });
          ret.map = ret.map && ret.map.toString();
        } else {
          ret = ret.toString();
        }
      } else {
        ret.compilerOptions = this.options;
      }

      return ret;
    } else {
      return fn;
    }
  },
  preamble: function
  /*istanbul ignore next*/
  preamble() {
    // track the last context pushed into place to allow skipping the
    // getContext opcode when it would be a noop
    this.lastContext = 0;
    this.source = new
    /*istanbul ignore next*/
    _codeGen[
    /*istanbul ignore next*/
    "default"](this.options.srcName);
    this.decorators = new
    /*istanbul ignore next*/
    _codeGen[
    /*istanbul ignore next*/
    "default"](this.options.srcName);
  },
  createFunctionContext: function
  /*istanbul ignore next*/
  createFunctionContext(asObject) {
    /*istanbul ignore next*/
    var _this = this;

    var varDeclarations = '';
    var locals = this.stackVars.concat(this.registers.list);

    if (locals.length > 0) {
      varDeclarations += ', ' + locals.join(', ');
    } // Generate minimizer alias mappings
    //
    // When using true SourceNodes, this will update all references to the given alias
    // as the source nodes are reused in situ. For the non-source node compilation mode,
    // aliases will not be used, but this case is already being run on the client and
    // we aren't concern about minimizing the template size.


    var aliasCount = 0;
    Object.keys(this.aliases).forEach(function (alias) {
      var node = _this.aliases[alias];

      if (node.children && node.referenceCount > 1) {
        varDeclarations += ', alias' + ++aliasCount + '=' + alias;
        node.children[0] = 'alias' + aliasCount;
      }
    });

    if (this.lookupPropertyFunctionIsUsed) {
      varDeclarations += ', ' + this.lookupPropertyFunctionVarDeclaration();
    }

    var params = ['container', 'depth0', 'helpers', 'partials', 'data'];

    if (this.useBlockParams || this.useDepths) {
      params.push('blockParams');
    }

    if (this.useDepths) {
      params.push('depths');
    } // Perform a second pass over the output to merge content when possible


    var source = this.mergeSource(varDeclarations);

    if (asObject) {
      params.push(source);
      return Function.apply(this, params);
    } else {
      return this.source.wrap(['function(', params.join(','), ') {\n  ', source, '}']);
    }
  },
  mergeSource: function
  /*istanbul ignore next*/
  mergeSource(varDeclarations) {
    var isSimple = this.environment.isSimple,
        appendOnly = !this.forceBuffer,
        appendFirst,
        sourceSeen,
        bufferStart,
        bufferEnd;
    this.source.each(function (line) {
      if (line.appendToBuffer) {
        if (bufferStart) {
          line.prepend('  + ');
        } else {
          bufferStart = line;
        }

        bufferEnd = line;
      } else {
        if (bufferStart) {
          if (!sourceSeen) {
            appendFirst = true;
          } else {
            bufferStart.prepend('buffer += ');
          }

          bufferEnd.add(';');
          bufferStart = bufferEnd = undefined;
        }

        sourceSeen = true;

        if (!isSimple) {
          appendOnly = false;
        }
      }
    });

    if (appendOnly) {
      if (bufferStart) {
        bufferStart.prepend('return ');
        bufferEnd.add(';');
      } else if (!sourceSeen) {
        this.source.push('return "";');
      }
    } else {
      varDeclarations += ', buffer = ' + (appendFirst ? '' : this.initializeBuffer());

      if (bufferStart) {
        bufferStart.prepend('return buffer + ');
        bufferEnd.add(';');
      } else {
        this.source.push('return buffer;');
      }
    }

    if (varDeclarations) {
      this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n'));
    }

    return this.source.merge();
  },
  lookupPropertyFunctionVarDeclaration: function
  /*istanbul ignore next*/
  lookupPropertyFunctionVarDeclaration() {
    return (
      /*istanbul ignore next*/
      "\n      lookupProperty = container.lookupProperty || function(parent, propertyName) {\n        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {\n          return parent[propertyName];\n        }\n        return undefined\n    }\n    ".trim()
    );
  },
  // [blockValue]
  //
  // On stack, before: hash, inverse, program, value
  // On stack, after: return value of blockHelperMissing
  //
  // The purpose of this opcode is to take a block of the form
  // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
  // replace it on the stack with the result of properly
  // invoking blockHelperMissing.
  blockValue: function
  /*istanbul ignore next*/
  blockValue(name) {
    var blockHelperMissing = this.aliasable('container.hooks.blockHelperMissing'),
        params = [this.contextName(0)];
    this.setupHelperArgs(name, 0, params);
    var blockName = this.popStack();
    params.splice(1, 0, blockName);
    this.push(this.source.functionCall(blockHelperMissing, 'call', params));
  },
  // [ambiguousBlockValue]
  //
  // On stack, before: hash, inverse, program, value
  // Compiler value, before: lastHelper=value of last found helper, if any
  // On stack, after, if no lastHelper: same as [blockValue]
  // On stack, after, if lastHelper: value
  ambiguousBlockValue: function
  /*istanbul ignore next*/
  ambiguousBlockValue() {
    // We're being a bit cheeky and reusing the options value from the prior exec
    var blockHelperMissing = this.aliasable('container.hooks.blockHelperMissing'),
        params = [this.contextName(0)];
    this.setupHelperArgs('', 0, params, true);
    this.flushInline();
    var current = this.topStack();
    params.splice(1, 0, current);
    this.pushSource(['if (!', this.lastHelper, ') { ', current, ' = ', this.source.functionCall(blockHelperMissing, 'call', params), '}']);
  },
  // [appendContent]
  //
  // On stack, before: ...
  // On stack, after: ...
  //
  // Appends the string value of `content` to the current buffer
  appendContent: function
  /*istanbul ignore next*/
  appendContent(content) {
    if (this.pendingContent) {
      content = this.pendingContent + content;
    } else {
      this.pendingLocation = this.source.currentLocation;
    }

    this.pendingContent = content;
  },
  // [append]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Coerces `value` to a String and appends it to the current buffer.
  //
  // If `value` is truthy, or 0, it is coerced into a string and appended
  // Otherwise, the empty string is appended
  append: function
  /*istanbul ignore next*/
  append() {
    if (this.isInline()) {
      this.replaceStack(function (current)
      /*istanbul ignore next*/
      {
        return [' != null ? ', current, ' : ""'];
      });
      this.pushSource(this.appendToBuffer(this.popStack()));
    } else {
      var local = this.popStack();
      this.pushSource(['if (', local, ' != null) { ', this.appendToBuffer(local, undefined, true), ' }']);

      if (this.environment.isSimple) {
        this.pushSource(['else { ', this.appendToBuffer("''", undefined, true), ' }']);
      }
    }
  },
  // [appendEscaped]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Escape `value` and append it to the buffer
  appendEscaped: function
  /*istanbul ignore next*/
  appendEscaped() {
    this.pushSource(this.appendToBuffer([this.aliasable('container.escapeExpression'), '(', this.popStack(), ')']));
  },
  // [getContext]
  //
  // On stack, before: ...
  // On stack, after: ...
  // Compiler value, after: lastContext=depth
  //
  // Set the value of the `lastContext` compiler value to the depth
  getContext: function
  /*istanbul ignore next*/
  getContext(depth) {
    this.lastContext = depth;
  },
  // [pushContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext, ...
  //
  // Pushes the value of the current context onto the stack.
  pushContext: function
  /*istanbul ignore next*/
  pushContext() {
    this.pushStackLiteral(this.contextName(this.lastContext));
  },
  // [lookupOnContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext[name], ...
  //
  // Looks up the value of `name` on the current context and pushes
  // it onto the stack.
  lookupOnContext: function
  /*istanbul ignore next*/
  lookupOnContext(parts, falsy, strict, scoped) {
    var i = 0;

    if (!scoped && this.options.compat && !this.lastContext) {
      // The depthed query is expected to handle the undefined logic for the root level that
      // is implemented below, so we evaluate that directly in compat mode
      this.push(this.depthedLookup(parts[i++]));
    } else {
      this.pushContext();
    }

    this.resolvePath('context', parts, i, falsy, strict);
  },
  // [lookupBlockParam]
  //
  // On stack, before: ...
  // On stack, after: blockParam[name], ...
  //
  // Looks up the value of `parts` on the given block param and pushes
  // it onto the stack.
  lookupBlockParam: function
  /*istanbul ignore next*/
  lookupBlockParam(blockParamId, parts) {
    this.useBlockParams = true;
    this.push(['blockParams[', blockParamId[0], '][', blockParamId[1], ']']);
    this.resolvePath('context', parts, 1);
  },
  // [lookupData]
  //
  // On stack, before: ...
  // On stack, after: data, ...
  //
  // Push the data lookup operator
  lookupData: function
  /*istanbul ignore next*/
  lookupData(depth, parts, strict) {
    if (!depth) {
      this.pushStackLiteral('data');
    } else {
      this.pushStackLiteral('container.data(data, ' + depth + ')');
    }

    this.resolvePath('data', parts, 0, true, strict);
  },
  resolvePath: function
  /*istanbul ignore next*/
  resolvePath(type, parts, i, falsy, strict) {
    /*istanbul ignore next*/
    var _this2 = this;

    if (this.options.strict || this.options.assumeObjects) {
      this.push(strictLookup(this.options.strict && strict, this, parts, type));
      return;
    }

    var len = parts.length;

    for (; i < len; i++) {
      /* eslint-disable no-loop-func */
      this.replaceStack(function (current) {
        var lookup = _this2.nameLookup(current, parts[i], type); // We want to ensure that zero and false are handled properly if the context (falsy flag)
        // needs to have the special handling for these values.


        if (!falsy) {
          return [' != null ? ', lookup, ' : ', current];
        } else {
          // Otherwise we can use generic falsy handling
          return [' && ', lookup];
        }
      });
      /* eslint-enable no-loop-func */
    }
  },
  // [resolvePossibleLambda]
  //
  // On stack, before: value, ...
  // On stack, after: resolved value, ...
  //
  // If the `value` is a lambda, replace it on the stack by
  // the return value of the lambda
  resolvePossibleLambda: function
  /*istanbul ignore next*/
  resolvePossibleLambda() {
    this.push([this.aliasable('container.lambda'), '(', this.popStack(), ', ', this.contextName(0), ')']);
  },
  // [pushStringParam]
  //
  // On stack, before: ...
  // On stack, after: string, currentContext, ...
  //
  // This opcode is designed for use in string mode, which
  // provides the string value of a parameter along with its
  // depth rather than resolving it immediately.
  pushStringParam: function
  /*istanbul ignore next*/
  pushStringParam(string, type) {
    this.pushContext();
    this.pushString(type); // If it's a subexpression, the string result
    // will be pushed after this opcode.

    if (type !== 'SubExpression') {
      if (typeof string === 'string') {
        this.pushString(string);
      } else {
        this.pushStackLiteral(string);
      }
    }
  },
  emptyHash: function
  /*istanbul ignore next*/
  emptyHash(omitEmpty) {
    if (this.trackIds) {
      this.push('{}'); // hashIds
    }

    if (this.stringParams) {
      this.push('{}'); // hashContexts

      this.push('{}'); // hashTypes
    }

    this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
  },
  pushHash: function
  /*istanbul ignore next*/
  pushHash() {
    if (this.hash) {
      this.hashes.push(this.hash);
    }

    this.hash = {
      values: {},
      types: [],
      contexts: [],
      ids: []
    };
  },
  popHash: function
  /*istanbul ignore next*/
  popHash() {
    var hash = this.hash;
    this.hash = this.hashes.pop();

    if (this.trackIds) {
      this.push(this.objectLiteral(hash.ids));
    }

    if (this.stringParams) {
      this.push(this.objectLiteral(hash.contexts));
      this.push(this.objectLiteral(hash.types));
    }

    this.push(this.objectLiteral(hash.values));
  },
  // [pushString]
  //
  // On stack, before: ...
  // On stack, after: quotedString(string), ...
  //
  // Push a quoted version of `string` onto the stack
  pushString: function
  /*istanbul ignore next*/
  pushString(string) {
    this.pushStackLiteral(this.quotedString(string));
  },
  // [pushLiteral]
  //
  // On stack, before: ...
  // On stack, after: value, ...
  //
  // Pushes a value onto the stack. This operation prevents
  // the compiler from creating a temporary variable to hold
  // it.
  pushLiteral: function
  /*istanbul ignore next*/
  pushLiteral(value) {
    this.pushStackLiteral(value);
  },
  // [pushProgram]
  //
  // On stack, before: ...
  // On stack, after: program(guid), ...
  //
  // Push a program expression onto the stack. This takes
  // a compile-time guid and converts it into a runtime-accessible
  // expression.
  pushProgram: function
  /*istanbul ignore next*/
  pushProgram(guid) {
    if (guid != null) {
      this.pushStackLiteral(this.programExpression(guid));
    } else {
      this.pushStackLiteral(null);
    }
  },

  /*istanbul ignore next*/
  // [registerDecorator]
  //
  // On stack, before: hash, program, params..., ...
  // On stack, after: ...
  //
  // Pops off the decorator's parameters, invokes the decorator,
  // and inserts the decorator into the decorators list.
  registerDecorator: function registerDecorator(paramSize, name) {
    var foundDecorator = this.nameLookup('decorators', name, 'decorator'),
        options = this.setupHelperArgs(name, paramSize);
    this.decorators.push(['fn = ', this.decorators.functionCall(foundDecorator, '', ['fn', 'props', 'container', options]), ' || fn;']);
  },
  // [invokeHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // Pops off the helper's parameters, invokes the helper,
  // and pushes the helper's return value onto the stack.
  //
  // If the helper is not found, `helperMissing` is called.
  invokeHelper: function
  /*istanbul ignore next*/
  invokeHelper(paramSize, name, isSimple) {
    var nonHelper = this.popStack(),
        helper = this.setupHelper(paramSize, name);
    var possibleFunctionCalls = [];

    if (isSimple) {
      // direct call to helper
      possibleFunctionCalls.push(helper.name);
    } // call a function from the input object


    possibleFunctionCalls.push(nonHelper);

    if (!this.options.strict) {
      possibleFunctionCalls.push(this.aliasable('container.hooks.helperMissing'));
    }

    var functionLookupCode = ['(', this.itemsSeparatedBy(possibleFunctionCalls, '||'), ')'];
    var functionCall = this.source.functionCall(functionLookupCode, 'call', helper.callParams);
    this.push(functionCall);
  },
  itemsSeparatedBy: function
  /*istanbul ignore next*/
  itemsSeparatedBy(items, separator) {
    var result = [];
    result.push(items[0]);

    for (var i = 1; i < items.length; i++) {
      result.push(separator, items[i]);
    }

    return result;
  },
  // [invokeKnownHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // This operation is used when the helper is known to exist,
  // so a `helperMissing` fallback is not required.
  invokeKnownHelper: function
  /*istanbul ignore next*/
  invokeKnownHelper(paramSize, name) {
    var helper = this.setupHelper(paramSize, name);
    this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
  },
  // [invokeAmbiguous]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of disambiguation
  //
  // This operation is used when an expression like `{{foo}}`
  // is provided, but we don't know at compile-time whether it
  // is a helper or a path.
  //
  // This operation emits more code than the other options,
  // and can be avoided by passing the `knownHelpers` and
  // `knownHelpersOnly` flags at compile-time.
  invokeAmbiguous: function
  /*istanbul ignore next*/
  invokeAmbiguous(name, helperCall) {
    this.useRegister('helper');
    var nonHelper = this.popStack();
    this.emptyHash();
    var helper = this.setupHelper(0, name, helperCall);
    var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');
    var lookup = ['(', '(helper = ', helperName, ' || ', nonHelper, ')'];

    if (!this.options.strict) {
      lookup[0] = '(helper = ';
      lookup.push(' != null ? helper : ', this.aliasable('container.hooks.helperMissing'));
    }

    this.push(['(', lookup, helper.paramsInit ? ['),(', helper.paramsInit] : [], '),', '(typeof helper === ', this.aliasable('"function"'), ' ? ', this.source.functionCall('helper', 'call', helper.callParams), ' : helper))']);
  },
  // [invokePartial]
  //
  // On stack, before: context, ...
  // On stack after: result of partial invocation
  //
  // This operation pops off a context, invokes a partial with that context,
  // and pushes the result of the invocation back.
  invokePartial: function
  /*istanbul ignore next*/
  invokePartial(isDynamic, name, indent) {
    var params = [],
        options = this.setupParams(name, 1, params);

    if (isDynamic) {
      name = this.popStack();
      delete options.name;
    }

    if (indent) {
      options.indent = JSON.stringify(indent);
    }

    options.helpers = 'helpers';
    options.partials = 'partials';
    options.decorators = 'container.decorators';

    if (!isDynamic) {
      params.unshift(this.nameLookup('partials', name, 'partial'));
    } else {
      params.unshift(name);
    }

    if (this.options.compat) {
      options.depths = 'depths';
    }

    options = this.objectLiteral(options);
    params.push(options);
    this.push(this.source.functionCall('container.invokePartial', '', params));
  },
  // [assignToHash]
  //
  // On stack, before: value, ..., hash, ...
  // On stack, after: ..., hash, ...
  //
  // Pops a value off the stack and assigns it to the current hash
  assignToHash: function
  /*istanbul ignore next*/
  assignToHash(key) {
    var value = this.popStack(),
        context,
        type,
        id;

    if (this.trackIds) {
      id = this.popStack();
    }

    if (this.stringParams) {
      type = this.popStack();
      context = this.popStack();
    }

    var hash = this.hash;

    if (context) {
      hash.contexts[key] = context;
    }

    if (type) {
      hash.types[key] = type;
    }

    if (id) {
      hash.ids[key] = id;
    }

    hash.values[key] = value;
  },
  pushId: function
  /*istanbul ignore next*/
  pushId(type, name, child) {
    if (type === 'BlockParam') {
      this.pushStackLiteral('blockParams[' + name[0] + '].path[' + name[1] + ']' + (child ? ' + ' + JSON.stringify('.' + child) : ''));
    } else if (type === 'PathExpression') {
      this.pushString(name);
    } else if (type === 'SubExpression') {
      this.pushStackLiteral('true');
    } else {
      this.pushStackLiteral('null');
    }
  },
  // HELPERS
  compiler: JavaScriptCompiler,
  compileChildren: function
  /*istanbul ignore next*/
  compileChildren(environment, options) {
    var children = environment.children,
        child,
        compiler;

    for (var i = 0, l = children.length; i < l; i++) {
      child = children[i];
      compiler = new this.compiler(); // eslint-disable-line new-cap

      var existing = this.matchExistingProgram(child);

      if (existing == null) {
        this.context.programs.push(''); // Placeholder to prevent name conflicts for nested children

        var index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
        this.context.decorators[index] = compiler.decorators;
        this.context.environments[index] = child;
        this.useDepths = this.useDepths || compiler.useDepths;
        this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
        child.useDepths = this.useDepths;
        child.useBlockParams = this.useBlockParams;
      } else {
        child.index = existing.index;
        child.name = 'program' + existing.index;
        this.useDepths = this.useDepths || existing.useDepths;
        this.useBlockParams = this.useBlockParams || existing.useBlockParams;
      }
    }
  },
  matchExistingProgram: function
  /*istanbul ignore next*/
  matchExistingProgram(child) {
    for (var i = 0, len = this.context.environments.length; i < len; i++) {
      var environment = this.context.environments[i];

      if (environment && environment.equals(child)) {
        return environment;
      }
    }
  },
  programExpression: function
  /*istanbul ignore next*/
  programExpression(guid) {
    var child = this.environment.children[guid],
        programParams = [child.index, 'data', child.blockParams];

    if (this.useBlockParams || this.useDepths) {
      programParams.push('blockParams');
    }

    if (this.useDepths) {
      programParams.push('depths');
    }

    return 'container.program(' + programParams.join(', ') + ')';
  },
  useRegister: function
  /*istanbul ignore next*/
  useRegister(name) {
    if (!this.registers[name]) {
      this.registers[name] = true;
      this.registers.list.push(name);
    }
  },
  push: function
  /*istanbul ignore next*/
  push(expr) {
    if (!(expr instanceof Literal)) {
      expr = this.source.wrap(expr);
    }

    this.inlineStack.push(expr);
    return expr;
  },
  pushStackLiteral: function
  /*istanbul ignore next*/
  pushStackLiteral(item) {
    this.push(new Literal(item));
  },
  pushSource: function
  /*istanbul ignore next*/
  pushSource(source) {
    if (this.pendingContent) {
      this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
      this.pendingContent = undefined;
    }

    if (source) {
      this.source.push(source);
    }
  },
  replaceStack: function
  /*istanbul ignore next*/
  replaceStack(callback) {
    var prefix = ['('],
        stack,
        createdStack,
        usedLiteral;
    /* istanbul ignore next */

    if (!this.isInline()) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('replaceStack on non-inline');
    } // We want to merge the inline statement into the replacement statement via ','


    var top = this.popStack(true);

    if (top instanceof Literal) {
      // Literals do not need to be inlined
      stack = [top.value];
      prefix = ['(', stack];
      usedLiteral = true;
    } else {
      // Get or create the current stack name for use by the inline
      createdStack = true;
      var name = this.incrStack();
      prefix = ['((', this.push(name), ' = ', top, ')'];
      stack = this.topStack();
    }

    var item = callback.call(this, stack);

    if (!usedLiteral) {
      this.popStack();
    }

    if (createdStack) {
      this.stackSlot--;
    }

    this.push(prefix.concat(item, ')'));
  },
  incrStack: function
  /*istanbul ignore next*/
  incrStack() {
    this.stackSlot++;

    if (this.stackSlot > this.stackVars.length) {
      this.stackVars.push('stack' + this.stackSlot);
    }

    return this.topStackName();
  },
  topStackName: function
  /*istanbul ignore next*/
  topStackName() {
    return 'stack' + this.stackSlot;
  },
  flushInline: function
  /*istanbul ignore next*/
  flushInline() {
    var inlineStack = this.inlineStack;
    this.inlineStack = [];

    for (var i = 0, len = inlineStack.length; i < len; i++) {
      var entry = inlineStack[i];
      /* istanbul ignore if */

      if (entry instanceof Literal) {
        this.compileStack.push(entry);
      } else {
        var stack = this.incrStack();
        this.pushSource([stack, ' = ', entry, ';']);
        this.compileStack.push(stack);
      }
    }
  },
  isInline: function
  /*istanbul ignore next*/
  isInline() {
    return this.inlineStack.length;
  },
  popStack: function
  /*istanbul ignore next*/
  popStack(wrapped) {
    var inline = this.isInline(),
        item = (inline ? this.inlineStack : this.compileStack).pop();

    if (!wrapped && item instanceof Literal) {
      return item.value;
    } else {
      if (!inline) {
        /* istanbul ignore next */
        if (!this.stackSlot) {
          throw new
          /*istanbul ignore next*/
          _exception[
          /*istanbul ignore next*/
          "default"]('Invalid stack pop');
        }

        this.stackSlot--;
      }

      return item;
    }
  },
  topStack: function
  /*istanbul ignore next*/
  topStack() {
    var stack = this.isInline() ? this.inlineStack : this.compileStack,
        item = stack[stack.length - 1];
    /* istanbul ignore if */

    if (item instanceof Literal) {
      return item.value;
    } else {
      return item;
    }
  },
  contextName: function
  /*istanbul ignore next*/
  contextName(context) {
    if (this.useDepths && context) {
      return 'depths[' + context + ']';
    } else {
      return 'depth' + context;
    }
  },
  quotedString: function
  /*istanbul ignore next*/
  quotedString(str) {
    return this.source.quotedString(str);
  },
  objectLiteral: function
  /*istanbul ignore next*/
  objectLiteral(obj) {
    return this.source.objectLiteral(obj);
  },
  aliasable: function
  /*istanbul ignore next*/
  aliasable(name) {
    var ret = this.aliases[name];

    if (ret) {
      ret.referenceCount++;
      return ret;
    }

    ret = this.aliases[name] = this.source.wrap(name);
    ret.aliasable = true;
    ret.referenceCount = 1;
    return ret;
  },
  setupHelper: function
  /*istanbul ignore next*/
  setupHelper(paramSize, name, blockHelper) {
    var params = [],
        paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
    var foundHelper = this.nameLookup('helpers', name, 'helper'),
        callContext = this.aliasable(
    /*istanbul ignore next*/
    "".concat(this.contextName(0), " != null ? ").concat(this.contextName(0), " : (container.nullContext || {})"));
    return {
      params: params,
      paramsInit: paramsInit,
      name: foundHelper,
      callParams: [callContext].concat(params)
    };
  },
  setupParams: function
  /*istanbul ignore next*/
  setupParams(helper, paramSize, params) {
    var options = {},
        contexts = [],
        types = [],
        ids = [],
        objectArgs = !params,
        param;

    if (objectArgs) {
      params = [];
    }

    options.name = this.quotedString(helper);
    options.hash = this.popStack();

    if (this.trackIds) {
      options.hashIds = this.popStack();
    }

    if (this.stringParams) {
      options.hashTypes = this.popStack();
      options.hashContexts = this.popStack();
    }

    var inverse = this.popStack(),
        program = this.popStack(); // Avoid setting fn and inverse if neither are set. This allows
    // helpers to do a check for `if (options.fn)`

    if (program || inverse) {
      options.fn = program || 'container.noop';
      options.inverse = inverse || 'container.noop';
    } // The parameters go on to the stack in order (making sure that they are evaluated in order)
    // so we need to pop them off the stack in reverse order


    var i = paramSize;

    while (i--) {
      param = this.popStack();
      params[i] = param;

      if (this.trackIds) {
        ids[i] = this.popStack();
      }

      if (this.stringParams) {
        types[i] = this.popStack();
        contexts[i] = this.popStack();
      }
    }

    if (objectArgs) {
      options.args = this.source.generateArray(params);
    }

    if (this.trackIds) {
      options.ids = this.source.generateArray(ids);
    }

    if (this.stringParams) {
      options.types = this.source.generateArray(types);
      options.contexts = this.source.generateArray(contexts);
    }

    if (this.options.data) {
      options.data = 'data';
    }

    if (this.useBlockParams) {
      options.blockParams = 'blockParams';
    }

    return options;
  },
  setupHelperArgs: function
  /*istanbul ignore next*/
  setupHelperArgs(helper, paramSize, params, useRegister) {
    var options = this.setupParams(helper, paramSize, params);
    options.loc = JSON.stringify(this.source.currentLocation);
    options = this.objectLiteral(options);

    if (useRegister) {
      this.useRegister('options');
      params.push('options');
      return ['options=', options];
    } else if (params) {
      params.push(options);
      return '';
    } else {
      return options;
    }
  }
};

(function () {
  var reservedWords = ('break else new var' + ' case finally return void' + ' catch for switch while' + ' continue function this with' + ' default if throw' + ' delete in try' + ' do instanceof typeof' + ' abstract enum int short' + ' boolean export interface static' + ' byte extends long super' + ' char final native synchronized' + ' class float package throws' + ' const goto private transient' + ' debugger implements protected volatile' + ' double import public let yield await' + ' null true false').split(' ');
  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for (var i = 0, l = reservedWords.length; i < l; i++) {
    compilerWords[reservedWords[i]] = true;
  }
})();
/**
 * @deprecated May be removed in the next major version
 */


JavaScriptCompiler.isValidJavaScriptVariableName = function (name) {
  return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
};

function strictLookup(requireTerminal, compiler, parts, type) {
  var stack = compiler.popStack(),
      i = 0,
      len = parts.length;

  if (requireTerminal) {
    len--;
  }

  for (; i < len; i++) {
    stack = compiler.nameLookup(stack, parts[i], type);
  }

  if (requireTerminal) {
    return [compiler.aliasable('container.strict'), '(', stack, ', ', compiler.quotedString(parts[i]), ', ', JSON.stringify(compiler.source.currentLocation), ' )'];
  } else {
    return stack;
  }
}

/*istanbul ignore next*/
var _default = JavaScriptCompiler;

/*istanbul ignore next*/
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2NvbXBpbGVyL2phdmFzY3JpcHQtY29tcGlsZXIuanMiXSwibmFtZXMiOlsiTGl0ZXJhbCIsInZhbHVlIiwiSmF2YVNjcmlwdENvbXBpbGVyIiwicHJvdG90eXBlIiwibmFtZUxvb2t1cCIsInBhcmVudCIsIm5hbWUiLCJpbnRlcm5hbE5hbWVMb29rdXAiLCJkZXB0aGVkTG9va3VwIiwiYWxpYXNhYmxlIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbXBpbGVySW5mbyIsInJldmlzaW9uIiwiQ09NUElMRVJfUkVWSVNJT04iLCJ2ZXJzaW9ucyIsIlJFVklTSU9OX0NIQU5HRVMiLCJhcHBlbmRUb0J1ZmZlciIsInNvdXJjZSIsImxvY2F0aW9uIiwiZXhwbGljaXQiLCJpc0FycmF5Iiwid3JhcCIsImVudmlyb25tZW50IiwiaXNTaW1wbGUiLCJpbml0aWFsaXplQnVmZmVyIiwicXVvdGVkU3RyaW5nIiwibG9va3VwUHJvcGVydHlGdW5jdGlvbklzVXNlZCIsImNvbXBpbGUiLCJvcHRpb25zIiwiY29udGV4dCIsImFzT2JqZWN0Iiwic3RyaW5nUGFyYW1zIiwidHJhY2tJZHMiLCJwcmVjb21waWxlIiwiaXNDaGlsZCIsImRlY29yYXRvcnMiLCJwcm9ncmFtcyIsImVudmlyb25tZW50cyIsInByZWFtYmxlIiwic3RhY2tTbG90Iiwic3RhY2tWYXJzIiwiYWxpYXNlcyIsInJlZ2lzdGVycyIsImxpc3QiLCJoYXNoZXMiLCJjb21waWxlU3RhY2siLCJpbmxpbmVTdGFjayIsImJsb2NrUGFyYW1zIiwiY29tcGlsZUNoaWxkcmVuIiwidXNlRGVwdGhzIiwidXNlRGVjb3JhdG9ycyIsImNvbXBhdCIsInVzZUJsb2NrUGFyYW1zIiwib3Bjb2RlcyIsIm9wY29kZSIsImZpcnN0TG9jIiwiaSIsImwiLCJsZW5ndGgiLCJjdXJyZW50TG9jYXRpb24iLCJsb2MiLCJhcHBseSIsImFyZ3MiLCJwdXNoU291cmNlIiwiRXhjZXB0aW9uIiwiaXNFbXB0eSIsInByZXBlbmQiLCJsb29rdXBQcm9wZXJ0eUZ1bmN0aW9uVmFyRGVjbGFyYXRpb24iLCJwdXNoIiwiRnVuY3Rpb24iLCJtZXJnZSIsInVuZGVmaW5lZCIsImZuIiwiY3JlYXRlRnVuY3Rpb25Db250ZXh0IiwicmV0IiwiY29tcGlsZXIiLCJtYWluIiwibWFpbl9kIiwidXNlUGFydGlhbCIsImRhdGEiLCJ1c2VEYXRhIiwic3RhcnQiLCJsaW5lIiwiY29sdW1uIiwib2JqZWN0TGl0ZXJhbCIsInNyY05hbWUiLCJ0b1N0cmluZ1dpdGhTb3VyY2VNYXAiLCJmaWxlIiwiZGVzdE5hbWUiLCJtYXAiLCJ0b1N0cmluZyIsImNvbXBpbGVyT3B0aW9ucyIsImxhc3RDb250ZXh0IiwiQ29kZUdlbiIsInZhckRlY2xhcmF0aW9ucyIsImxvY2FscyIsImNvbmNhdCIsImpvaW4iLCJhbGlhc0NvdW50IiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJhbGlhcyIsIm5vZGUiLCJjaGlsZHJlbiIsInJlZmVyZW5jZUNvdW50IiwicGFyYW1zIiwibWVyZ2VTb3VyY2UiLCJhcHBlbmRPbmx5IiwiZm9yY2VCdWZmZXIiLCJhcHBlbmRGaXJzdCIsInNvdXJjZVNlZW4iLCJidWZmZXJTdGFydCIsImJ1ZmZlckVuZCIsImVhY2giLCJhZGQiLCJzdWJzdHJpbmciLCJ0cmltIiwiYmxvY2tWYWx1ZSIsImJsb2NrSGVscGVyTWlzc2luZyIsImNvbnRleHROYW1lIiwic2V0dXBIZWxwZXJBcmdzIiwiYmxvY2tOYW1lIiwicG9wU3RhY2siLCJzcGxpY2UiLCJmdW5jdGlvbkNhbGwiLCJhbWJpZ3VvdXNCbG9ja1ZhbHVlIiwiZmx1c2hJbmxpbmUiLCJjdXJyZW50IiwidG9wU3RhY2siLCJsYXN0SGVscGVyIiwiYXBwZW5kQ29udGVudCIsImNvbnRlbnQiLCJwZW5kaW5nQ29udGVudCIsInBlbmRpbmdMb2NhdGlvbiIsImFwcGVuZCIsImlzSW5saW5lIiwicmVwbGFjZVN0YWNrIiwibG9jYWwiLCJhcHBlbmRFc2NhcGVkIiwiZ2V0Q29udGV4dCIsImRlcHRoIiwicHVzaENvbnRleHQiLCJwdXNoU3RhY2tMaXRlcmFsIiwibG9va3VwT25Db250ZXh0IiwicGFydHMiLCJmYWxzeSIsInN0cmljdCIsInNjb3BlZCIsInJlc29sdmVQYXRoIiwibG9va3VwQmxvY2tQYXJhbSIsImJsb2NrUGFyYW1JZCIsImxvb2t1cERhdGEiLCJ0eXBlIiwiYXNzdW1lT2JqZWN0cyIsInN0cmljdExvb2t1cCIsImxlbiIsImxvb2t1cCIsInJlc29sdmVQb3NzaWJsZUxhbWJkYSIsInB1c2hTdHJpbmdQYXJhbSIsInN0cmluZyIsInB1c2hTdHJpbmciLCJlbXB0eUhhc2giLCJvbWl0RW1wdHkiLCJwdXNoSGFzaCIsImhhc2giLCJ2YWx1ZXMiLCJ0eXBlcyIsImNvbnRleHRzIiwiaWRzIiwicG9wSGFzaCIsInBvcCIsInB1c2hMaXRlcmFsIiwicHVzaFByb2dyYW0iLCJndWlkIiwicHJvZ3JhbUV4cHJlc3Npb24iLCJyZWdpc3RlckRlY29yYXRvciIsInBhcmFtU2l6ZSIsImZvdW5kRGVjb3JhdG9yIiwiaW52b2tlSGVscGVyIiwibm9uSGVscGVyIiwiaGVscGVyIiwic2V0dXBIZWxwZXIiLCJwb3NzaWJsZUZ1bmN0aW9uQ2FsbHMiLCJmdW5jdGlvbkxvb2t1cENvZGUiLCJpdGVtc1NlcGFyYXRlZEJ5IiwiY2FsbFBhcmFtcyIsIml0ZW1zIiwic2VwYXJhdG9yIiwicmVzdWx0IiwiaW52b2tlS25vd25IZWxwZXIiLCJpbnZva2VBbWJpZ3VvdXMiLCJoZWxwZXJDYWxsIiwidXNlUmVnaXN0ZXIiLCJoZWxwZXJOYW1lIiwicGFyYW1zSW5pdCIsImludm9rZVBhcnRpYWwiLCJpc0R5bmFtaWMiLCJpbmRlbnQiLCJzZXR1cFBhcmFtcyIsImhlbHBlcnMiLCJwYXJ0aWFscyIsInVuc2hpZnQiLCJkZXB0aHMiLCJhc3NpZ25Ub0hhc2giLCJrZXkiLCJpZCIsInB1c2hJZCIsImNoaWxkIiwiZXhpc3RpbmciLCJtYXRjaEV4aXN0aW5nUHJvZ3JhbSIsImluZGV4IiwiZXF1YWxzIiwicHJvZ3JhbVBhcmFtcyIsImV4cHIiLCJpdGVtIiwiY2FsbGJhY2siLCJwcmVmaXgiLCJzdGFjayIsImNyZWF0ZWRTdGFjayIsInVzZWRMaXRlcmFsIiwidG9wIiwiaW5jclN0YWNrIiwiY2FsbCIsInRvcFN0YWNrTmFtZSIsImVudHJ5Iiwid3JhcHBlZCIsImlubGluZSIsInN0ciIsIm9iaiIsImJsb2NrSGVscGVyIiwiZm91bmRIZWxwZXIiLCJjYWxsQ29udGV4dCIsIm9iamVjdEFyZ3MiLCJwYXJhbSIsImhhc2hJZHMiLCJoYXNoVHlwZXMiLCJoYXNoQ29udGV4dHMiLCJpbnZlcnNlIiwicHJvZ3JhbSIsImdlbmVyYXRlQXJyYXkiLCJyZXNlcnZlZFdvcmRzIiwic3BsaXQiLCJjb21waWxlcldvcmRzIiwiUkVTRVJWRURfV09SRFMiLCJpc1ZhbGlkSmF2YVNjcmlwdFZhcmlhYmxlTmFtZSIsInRlc3QiLCJyZXF1aXJlVGVybWluYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBRUEsU0FBU0EsT0FBVCxDQUFpQkMsS0FBakIsRUFBd0I7QUFDdEIsT0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0Q7O0FBRUQsU0FBU0Msa0JBQVQsR0FBOEIsQ0FBRTs7QUFFaENBLGtCQUFrQixDQUFDQyxTQUFuQixHQUErQjtBQUM3QjtBQUNBO0FBQ0FDLEVBQUFBLFVBQVUsRUFBRTtBQUFBO0FBQUEsYUFBU0MsTUFBVCxFQUFpQkM7QUFBSztBQUF0QixJQUFvQztBQUM5QyxXQUFPLEtBQUtDLGtCQUFMLENBQXdCRixNQUF4QixFQUFnQ0MsSUFBaEMsQ0FBUDtBQUNELEdBTDRCO0FBTTdCRSxFQUFBQSxhQUFhLEVBQUU7QUFBQTtBQUFBLGdCQUFTRixJQUFULEVBQWU7QUFDNUIsV0FBTyxDQUNMLEtBQUtHLFNBQUwsQ0FBZSxrQkFBZixDQURLLEVBRUwsV0FGSyxFQUdMQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUwsSUFBZixDQUhLLEVBSUwsR0FKSyxDQUFQO0FBTUQsR0FiNEI7QUFlN0JNLEVBQUFBLFlBQVksRUFBRTtBQUFBO0FBQUEsaUJBQVc7QUFDdkIsUUFBTUMsUUFBUTtBQUFHQztBQUFBQTtBQUFBQTtBQUFBQSxxQkFBakI7QUFBQSxRQUNFQyxRQUFRO0FBQUdDO0FBQUFBO0FBQUFBO0FBQUFBLHFCQUFpQkgsUUFBakIsQ0FEYjtBQUVBLFdBQU8sQ0FBQ0EsUUFBRCxFQUFXRSxRQUFYLENBQVA7QUFDRCxHQW5CNEI7QUFxQjdCRSxFQUFBQSxjQUFjLEVBQUU7QUFBQTtBQUFBLGlCQUFTQyxNQUFULEVBQWlCQyxRQUFqQixFQUEyQkMsUUFBM0IsRUFBcUM7QUFDbkQ7QUFDQSxRQUFJO0FBQUM7QUFBQTtBQUFBQztBQUFBQTtBQUFBQTtBQUFBQSxhQUFRSCxNQUFSLENBQUwsRUFBc0I7QUFDcEJBLE1BQUFBLE1BQU0sR0FBRyxDQUFDQSxNQUFELENBQVQ7QUFDRDs7QUFDREEsSUFBQUEsTUFBTSxHQUFHLEtBQUtBLE1BQUwsQ0FBWUksSUFBWixDQUFpQkosTUFBakIsRUFBeUJDLFFBQXpCLENBQVQ7O0FBRUEsUUFBSSxLQUFLSSxXQUFMLENBQWlCQyxRQUFyQixFQUErQjtBQUM3QixhQUFPLENBQUMsU0FBRCxFQUFZTixNQUFaLEVBQW9CLEdBQXBCLENBQVA7QUFDRCxLQUZELE1BRU8sSUFBSUUsUUFBSixFQUFjO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGFBQU8sQ0FBQyxZQUFELEVBQWVGLE1BQWYsRUFBdUIsR0FBdkIsQ0FBUDtBQUNELEtBTE0sTUFLQTtBQUNMQSxNQUFBQSxNQUFNLENBQUNELGNBQVAsR0FBd0IsSUFBeEI7QUFDQSxhQUFPQyxNQUFQO0FBQ0Q7QUFDRixHQXZDNEI7QUF5QzdCTyxFQUFBQSxnQkFBZ0IsRUFBRTtBQUFBO0FBQUEscUJBQVc7QUFDM0IsV0FBTyxLQUFLQyxZQUFMLENBQWtCLEVBQWxCLENBQVA7QUFDRCxHQTNDNEI7QUE0QzdCO0FBQ0FuQixFQUFBQSxrQkFBa0IsRUFBRTtBQUFBO0FBQUEscUJBQVNGLE1BQVQsRUFBaUJDLElBQWpCLEVBQXVCO0FBQ3pDLFNBQUtxQiw0QkFBTCxHQUFvQyxJQUFwQztBQUNBLFdBQU8sQ0FBQyxpQkFBRCxFQUFvQnRCLE1BQXBCLEVBQTRCLEdBQTVCLEVBQWlDSyxJQUFJLENBQUNDLFNBQUwsQ0FBZUwsSUFBZixDQUFqQyxFQUF1RCxHQUF2RCxDQUFQO0FBQ0QsR0FoRDRCO0FBa0Q3QnFCLEVBQUFBLDRCQUE0QixFQUFFLEtBbEREO0FBb0Q3QkMsRUFBQUEsT0FBTyxFQUFFO0FBQUE7QUFBQSxVQUFTTCxXQUFULEVBQXNCTSxPQUF0QixFQUErQkMsT0FBL0IsRUFBd0NDLFFBQXhDLEVBQWtEO0FBQ3pELFNBQUtSLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsU0FBS00sT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0csWUFBTCxHQUFvQixLQUFLSCxPQUFMLENBQWFHLFlBQWpDO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixLQUFLSixPQUFMLENBQWFJLFFBQTdCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixDQUFDSCxRQUFuQjtBQUVBLFNBQUt6QixJQUFMLEdBQVksS0FBS2lCLFdBQUwsQ0FBaUJqQixJQUE3QjtBQUNBLFNBQUs2QixPQUFMLEdBQWUsQ0FBQyxDQUFDTCxPQUFqQjtBQUNBLFNBQUtBLE9BQUwsR0FBZUEsT0FBTyxJQUFJO0FBQ3hCTSxNQUFBQSxVQUFVLEVBQUUsRUFEWTtBQUV4QkMsTUFBQUEsUUFBUSxFQUFFLEVBRmM7QUFHeEJDLE1BQUFBLFlBQVksRUFBRTtBQUhVLEtBQTFCO0FBTUEsU0FBS0MsUUFBTDtBQUVBLFNBQUtDLFNBQUwsR0FBaUIsQ0FBakI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLEVBQWY7QUFDQSxTQUFLQyxTQUFMLEdBQWlCO0FBQUVDLE1BQUFBLElBQUksRUFBRTtBQUFSLEtBQWpCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLEVBQWQ7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFFQSxTQUFLQyxlQUFMLENBQXFCMUIsV0FBckIsRUFBa0NNLE9BQWxDO0FBRUEsU0FBS3FCLFNBQUwsR0FDRSxLQUFLQSxTQUFMLElBQ0EzQixXQUFXLENBQUMyQixTQURaLElBRUEzQixXQUFXLENBQUM0QixhQUZaLElBR0EsS0FBS3RCLE9BQUwsQ0FBYXVCLE1BSmY7QUFLQSxTQUFLQyxjQUFMLEdBQXNCLEtBQUtBLGNBQUwsSUFBdUI5QixXQUFXLENBQUM4QixjQUF6RDtBQUVBLFFBQUlDLE9BQU8sR0FBRy9CLFdBQVcsQ0FBQytCLE9BQTFCO0FBQUEsUUFDRUMsTUFERjtBQUFBLFFBRUVDLFFBRkY7QUFBQSxRQUdFQyxDQUhGO0FBQUEsUUFJRUMsQ0FKRjs7QUFNQSxTQUFLRCxDQUFDLEdBQUcsQ0FBSixFQUFPQyxDQUFDLEdBQUdKLE9BQU8sQ0FBQ0ssTUFBeEIsRUFBZ0NGLENBQUMsR0FBR0MsQ0FBcEMsRUFBdUNELENBQUMsRUFBeEMsRUFBNEM7QUFDMUNGLE1BQUFBLE1BQU0sR0FBR0QsT0FBTyxDQUFDRyxDQUFELENBQWhCO0FBRUEsV0FBS3ZDLE1BQUwsQ0FBWTBDLGVBQVosR0FBOEJMLE1BQU0sQ0FBQ00sR0FBckM7QUFDQUwsTUFBQUEsUUFBUSxHQUFHQSxRQUFRLElBQUlELE1BQU0sQ0FBQ00sR0FBOUI7QUFDQSxXQUFLTixNQUFNLENBQUNBLE1BQVosRUFBb0JPLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDUCxNQUFNLENBQUNRLElBQXZDO0FBQ0QsS0EvQ3dELENBaUR6RDs7O0FBQ0EsU0FBSzdDLE1BQUwsQ0FBWTBDLGVBQVosR0FBOEJKLFFBQTlCO0FBQ0EsU0FBS1EsVUFBTCxDQUFnQixFQUFoQjtBQUVBOztBQUNBLFFBQUksS0FBS3hCLFNBQUwsSUFBa0IsS0FBS08sV0FBTCxDQUFpQlksTUFBbkMsSUFBNkMsS0FBS2IsWUFBTCxDQUFrQmEsTUFBbkUsRUFBMkU7QUFDekUsWUFBTTtBQUFJTTtBQUFBQTtBQUFBQTtBQUFBQSxnQkFBSixDQUFjLDhDQUFkLENBQU47QUFDRDs7QUFFRCxRQUFJLENBQUMsS0FBSzdCLFVBQUwsQ0FBZ0I4QixPQUFoQixFQUFMLEVBQWdDO0FBQzlCLFdBQUtmLGFBQUwsR0FBcUIsSUFBckI7QUFFQSxXQUFLZixVQUFMLENBQWdCK0IsT0FBaEIsQ0FBd0IsQ0FDdEIseUNBRHNCLEVBRXRCLEtBQUtDLG9DQUFMLEVBRnNCLEVBR3RCLEtBSHNCLENBQXhCO0FBS0EsV0FBS2hDLFVBQUwsQ0FBZ0JpQyxJQUFoQixDQUFxQixZQUFyQjs7QUFFQSxVQUFJdEMsUUFBSixFQUFjO0FBQ1osYUFBS0ssVUFBTCxHQUFrQmtDLFFBQVEsQ0FBQ1IsS0FBVCxDQUFlLElBQWYsRUFBcUIsQ0FDckMsSUFEcUMsRUFFckMsT0FGcUMsRUFHckMsV0FIcUMsRUFJckMsUUFKcUMsRUFLckMsTUFMcUMsRUFNckMsYUFOcUMsRUFPckMsUUFQcUMsRUFRckMsS0FBSzFCLFVBQUwsQ0FBZ0JtQyxLQUFoQixFQVJxQyxDQUFyQixDQUFsQjtBQVVELE9BWEQsTUFXTztBQUNMLGFBQUtuQyxVQUFMLENBQWdCK0IsT0FBaEIsQ0FDRSx1RUFERjtBQUdBLGFBQUsvQixVQUFMLENBQWdCaUMsSUFBaEIsQ0FBcUIsS0FBckI7QUFDQSxhQUFLakMsVUFBTCxHQUFrQixLQUFLQSxVQUFMLENBQWdCbUMsS0FBaEIsRUFBbEI7QUFDRDtBQUNGLEtBNUJELE1BNEJPO0FBQ0wsV0FBS25DLFVBQUwsR0FBa0JvQyxTQUFsQjtBQUNEOztBQUVELFFBQUlDLEVBQUUsR0FBRyxLQUFLQyxxQkFBTCxDQUEyQjNDLFFBQTNCLENBQVQ7O0FBQ0EsUUFBSSxDQUFDLEtBQUtJLE9BQVYsRUFBbUI7QUFDakIsVUFBSXdDLEdBQUcsR0FBRztBQUNSQyxRQUFBQSxRQUFRLEVBQUUsS0FBS2hFLFlBQUwsRUFERjtBQUVSaUUsUUFBQUEsSUFBSSxFQUFFSjtBQUZFLE9BQVY7O0FBS0EsVUFBSSxLQUFLckMsVUFBVCxFQUFxQjtBQUNuQnVDLFFBQUFBLEdBQUcsQ0FBQ0csTUFBSixHQUFhLEtBQUsxQyxVQUFsQixDQURtQixDQUNXOztBQUM5QnVDLFFBQUFBLEdBQUcsQ0FBQ3hCLGFBQUosR0FBb0IsSUFBcEI7QUFDRDs7QUFUZ0I7QUFBQSwwQkFXYyxLQUFLckIsT0FYbkI7QUFBQSxVQVdYTyxRQVhXLGlCQVdYQSxRQVhXO0FBQUEsVUFXREQsVUFYQyxpQkFXREEsVUFYQzs7QUFZakIsV0FBS3FCLENBQUMsR0FBRyxDQUFKLEVBQU9DLENBQUMsR0FBR3JCLFFBQVEsQ0FBQ3NCLE1BQXpCLEVBQWlDRixDQUFDLEdBQUdDLENBQXJDLEVBQXdDRCxDQUFDLEVBQXpDLEVBQTZDO0FBQzNDLFlBQUlwQixRQUFRLENBQUNvQixDQUFELENBQVosRUFBaUI7QUFDZmtCLFVBQUFBLEdBQUcsQ0FBQ2xCLENBQUQsQ0FBSCxHQUFTcEIsUUFBUSxDQUFDb0IsQ0FBRCxDQUFqQjs7QUFDQSxjQUFJckIsVUFBVSxDQUFDcUIsQ0FBRCxDQUFkLEVBQW1CO0FBQ2pCa0IsWUFBQUEsR0FBRyxDQUFDbEIsQ0FBQyxHQUFHLElBQUwsQ0FBSCxHQUFnQnJCLFVBQVUsQ0FBQ3FCLENBQUQsQ0FBMUI7QUFDQWtCLFlBQUFBLEdBQUcsQ0FBQ3hCLGFBQUosR0FBb0IsSUFBcEI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsVUFBSSxLQUFLNUIsV0FBTCxDQUFpQndELFVBQXJCLEVBQWlDO0FBQy9CSixRQUFBQSxHQUFHLENBQUNJLFVBQUosR0FBaUIsSUFBakI7QUFDRDs7QUFDRCxVQUFJLEtBQUtsRCxPQUFMLENBQWFtRCxJQUFqQixFQUF1QjtBQUNyQkwsUUFBQUEsR0FBRyxDQUFDTSxPQUFKLEdBQWMsSUFBZDtBQUNEOztBQUNELFVBQUksS0FBSy9CLFNBQVQsRUFBb0I7QUFDbEJ5QixRQUFBQSxHQUFHLENBQUN6QixTQUFKLEdBQWdCLElBQWhCO0FBQ0Q7O0FBQ0QsVUFBSSxLQUFLRyxjQUFULEVBQXlCO0FBQ3ZCc0IsUUFBQUEsR0FBRyxDQUFDdEIsY0FBSixHQUFxQixJQUFyQjtBQUNEOztBQUNELFVBQUksS0FBS3hCLE9BQUwsQ0FBYXVCLE1BQWpCLEVBQXlCO0FBQ3ZCdUIsUUFBQUEsR0FBRyxDQUFDdkIsTUFBSixHQUFhLElBQWI7QUFDRDs7QUFFRCxVQUFJLENBQUNyQixRQUFMLEVBQWU7QUFDYjRDLFFBQUFBLEdBQUcsQ0FBQ0MsUUFBSixHQUFlbEUsSUFBSSxDQUFDQyxTQUFMLENBQWVnRSxHQUFHLENBQUNDLFFBQW5CLENBQWY7QUFFQSxhQUFLMUQsTUFBTCxDQUFZMEMsZUFBWixHQUE4QjtBQUFFc0IsVUFBQUEsS0FBSyxFQUFFO0FBQUVDLFlBQUFBLElBQUksRUFBRSxDQUFSO0FBQVdDLFlBQUFBLE1BQU0sRUFBRTtBQUFuQjtBQUFULFNBQTlCO0FBQ0FULFFBQUFBLEdBQUcsR0FBRyxLQUFLVSxhQUFMLENBQW1CVixHQUFuQixDQUFOOztBQUVBLFlBQUk5QyxPQUFPLENBQUN5RCxPQUFaLEVBQXFCO0FBQ25CWCxVQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ1kscUJBQUosQ0FBMEI7QUFBRUMsWUFBQUEsSUFBSSxFQUFFM0QsT0FBTyxDQUFDNEQ7QUFBaEIsV0FBMUIsQ0FBTjtBQUNBZCxVQUFBQSxHQUFHLENBQUNlLEdBQUosR0FBVWYsR0FBRyxDQUFDZSxHQUFKLElBQVdmLEdBQUcsQ0FBQ2UsR0FBSixDQUFRQyxRQUFSLEVBQXJCO0FBQ0QsU0FIRCxNQUdPO0FBQ0xoQixVQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ2dCLFFBQUosRUFBTjtBQUNEO0FBQ0YsT0FaRCxNQVlPO0FBQ0xoQixRQUFBQSxHQUFHLENBQUNpQixlQUFKLEdBQXNCLEtBQUsvRCxPQUEzQjtBQUNEOztBQUVELGFBQU84QyxHQUFQO0FBQ0QsS0F2REQsTUF1RE87QUFDTCxhQUFPRixFQUFQO0FBQ0Q7QUFDRixHQXpNNEI7QUEyTTdCbEMsRUFBQUEsUUFBUSxFQUFFO0FBQUE7QUFBQSxhQUFXO0FBQ25CO0FBQ0E7QUFDQSxTQUFLc0QsV0FBTCxHQUFtQixDQUFuQjtBQUNBLFNBQUszRSxNQUFMLEdBQWM7QUFBSTRFO0FBQUFBO0FBQUFBO0FBQUFBLGNBQUosQ0FBWSxLQUFLakUsT0FBTCxDQUFheUQsT0FBekIsQ0FBZDtBQUNBLFNBQUtsRCxVQUFMLEdBQWtCO0FBQUkwRDtBQUFBQTtBQUFBQTtBQUFBQSxjQUFKLENBQVksS0FBS2pFLE9BQUwsQ0FBYXlELE9BQXpCLENBQWxCO0FBQ0QsR0FqTjRCO0FBbU43QlosRUFBQUEscUJBQXFCLEVBQUU7QUFBQTtBQUFBLHdCQUFTM0MsUUFBVCxFQUFtQjtBQUFBO0FBQUE7O0FBQ3hDLFFBQUlnRSxlQUFlLEdBQUcsRUFBdEI7QUFFQSxRQUFJQyxNQUFNLEdBQUcsS0FBS3ZELFNBQUwsQ0FBZXdELE1BQWYsQ0FBc0IsS0FBS3RELFNBQUwsQ0FBZUMsSUFBckMsQ0FBYjs7QUFDQSxRQUFJb0QsTUFBTSxDQUFDckMsTUFBUCxHQUFnQixDQUFwQixFQUF1QjtBQUNyQm9DLE1BQUFBLGVBQWUsSUFBSSxPQUFPQyxNQUFNLENBQUNFLElBQVAsQ0FBWSxJQUFaLENBQTFCO0FBQ0QsS0FOdUMsQ0FReEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxRQUFJQyxVQUFVLEdBQUcsQ0FBakI7QUFDQUMsSUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBSzNELE9BQWpCLEVBQTBCNEQsT0FBMUIsQ0FBa0MsVUFBQUMsS0FBSyxFQUFJO0FBQ3pDLFVBQUlDLElBQUksR0FBRyxLQUFJLENBQUM5RCxPQUFMLENBQWE2RCxLQUFiLENBQVg7O0FBQ0EsVUFBSUMsSUFBSSxDQUFDQyxRQUFMLElBQWlCRCxJQUFJLENBQUNFLGNBQUwsR0FBc0IsQ0FBM0MsRUFBOEM7QUFDNUNYLFFBQUFBLGVBQWUsSUFBSSxZQUFZLEVBQUVJLFVBQWQsR0FBMkIsR0FBM0IsR0FBaUNJLEtBQXBEO0FBQ0FDLFFBQUFBLElBQUksQ0FBQ0MsUUFBTCxDQUFjLENBQWQsSUFBbUIsVUFBVU4sVUFBN0I7QUFDRDtBQUNGLEtBTkQ7O0FBUUEsUUFBSSxLQUFLeEUsNEJBQVQsRUFBdUM7QUFDckNvRSxNQUFBQSxlQUFlLElBQUksT0FBTyxLQUFLM0Isb0NBQUwsRUFBMUI7QUFDRDs7QUFFRCxRQUFJdUMsTUFBTSxHQUFHLENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBd0IsU0FBeEIsRUFBbUMsVUFBbkMsRUFBK0MsTUFBL0MsQ0FBYjs7QUFFQSxRQUFJLEtBQUt0RCxjQUFMLElBQXVCLEtBQUtILFNBQWhDLEVBQTJDO0FBQ3pDeUQsTUFBQUEsTUFBTSxDQUFDdEMsSUFBUCxDQUFZLGFBQVo7QUFDRDs7QUFDRCxRQUFJLEtBQUtuQixTQUFULEVBQW9CO0FBQ2xCeUQsTUFBQUEsTUFBTSxDQUFDdEMsSUFBUCxDQUFZLFFBQVo7QUFDRCxLQWxDdUMsQ0FvQ3hDOzs7QUFDQSxRQUFJbkQsTUFBTSxHQUFHLEtBQUswRixXQUFMLENBQWlCYixlQUFqQixDQUFiOztBQUVBLFFBQUloRSxRQUFKLEVBQWM7QUFDWjRFLE1BQUFBLE1BQU0sQ0FBQ3RDLElBQVAsQ0FBWW5ELE1BQVo7QUFFQSxhQUFPb0QsUUFBUSxDQUFDUixLQUFULENBQWUsSUFBZixFQUFxQjZDLE1BQXJCLENBQVA7QUFDRCxLQUpELE1BSU87QUFDTCxhQUFPLEtBQUt6RixNQUFMLENBQVlJLElBQVosQ0FBaUIsQ0FDdEIsV0FEc0IsRUFFdEJxRixNQUFNLENBQUNULElBQVAsQ0FBWSxHQUFaLENBRnNCLEVBR3RCLFNBSHNCLEVBSXRCaEYsTUFKc0IsRUFLdEIsR0FMc0IsQ0FBakIsQ0FBUDtBQU9EO0FBQ0YsR0F2UTRCO0FBd1E3QjBGLEVBQUFBLFdBQVcsRUFBRTtBQUFBO0FBQUEsY0FBU2IsZUFBVCxFQUEwQjtBQUNyQyxRQUFJdkUsUUFBUSxHQUFHLEtBQUtELFdBQUwsQ0FBaUJDLFFBQWhDO0FBQUEsUUFDRXFGLFVBQVUsR0FBRyxDQUFDLEtBQUtDLFdBRHJCO0FBQUEsUUFFRUMsV0FGRjtBQUFBLFFBR0VDLFVBSEY7QUFBQSxRQUlFQyxXQUpGO0FBQUEsUUFLRUMsU0FMRjtBQU1BLFNBQUtoRyxNQUFMLENBQVlpRyxJQUFaLENBQWlCLFVBQUFoQyxJQUFJLEVBQUk7QUFDdkIsVUFBSUEsSUFBSSxDQUFDbEUsY0FBVCxFQUF5QjtBQUN2QixZQUFJZ0csV0FBSixFQUFpQjtBQUNmOUIsVUFBQUEsSUFBSSxDQUFDaEIsT0FBTCxDQUFhLE1BQWI7QUFDRCxTQUZELE1BRU87QUFDTDhDLFVBQUFBLFdBQVcsR0FBRzlCLElBQWQ7QUFDRDs7QUFDRCtCLFFBQUFBLFNBQVMsR0FBRy9CLElBQVo7QUFDRCxPQVBELE1BT087QUFDTCxZQUFJOEIsV0FBSixFQUFpQjtBQUNmLGNBQUksQ0FBQ0QsVUFBTCxFQUFpQjtBQUNmRCxZQUFBQSxXQUFXLEdBQUcsSUFBZDtBQUNELFdBRkQsTUFFTztBQUNMRSxZQUFBQSxXQUFXLENBQUM5QyxPQUFaLENBQW9CLFlBQXBCO0FBQ0Q7O0FBQ0QrQyxVQUFBQSxTQUFTLENBQUNFLEdBQVYsQ0FBYyxHQUFkO0FBQ0FILFVBQUFBLFdBQVcsR0FBR0MsU0FBUyxHQUFHMUMsU0FBMUI7QUFDRDs7QUFFRHdDLFFBQUFBLFVBQVUsR0FBRyxJQUFiOztBQUNBLFlBQUksQ0FBQ3hGLFFBQUwsRUFBZTtBQUNicUYsVUFBQUEsVUFBVSxHQUFHLEtBQWI7QUFDRDtBQUNGO0FBQ0YsS0F4QkQ7O0FBMEJBLFFBQUlBLFVBQUosRUFBZ0I7QUFDZCxVQUFJSSxXQUFKLEVBQWlCO0FBQ2ZBLFFBQUFBLFdBQVcsQ0FBQzlDLE9BQVosQ0FBb0IsU0FBcEI7QUFDQStDLFFBQUFBLFNBQVMsQ0FBQ0UsR0FBVixDQUFjLEdBQWQ7QUFDRCxPQUhELE1BR08sSUFBSSxDQUFDSixVQUFMLEVBQWlCO0FBQ3RCLGFBQUs5RixNQUFMLENBQVltRCxJQUFaLENBQWlCLFlBQWpCO0FBQ0Q7QUFDRixLQVBELE1BT087QUFDTDBCLE1BQUFBLGVBQWUsSUFDYixpQkFBaUJnQixXQUFXLEdBQUcsRUFBSCxHQUFRLEtBQUt0RixnQkFBTCxFQUFwQyxDQURGOztBQUdBLFVBQUl3RixXQUFKLEVBQWlCO0FBQ2ZBLFFBQUFBLFdBQVcsQ0FBQzlDLE9BQVosQ0FBb0Isa0JBQXBCO0FBQ0ErQyxRQUFBQSxTQUFTLENBQUNFLEdBQVYsQ0FBYyxHQUFkO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBS2xHLE1BQUwsQ0FBWW1ELElBQVosQ0FBaUIsZ0JBQWpCO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJMEIsZUFBSixFQUFxQjtBQUNuQixXQUFLN0UsTUFBTCxDQUFZaUQsT0FBWixDQUNFLFNBQVM0QixlQUFlLENBQUNzQixTQUFoQixDQUEwQixDQUExQixDQUFULElBQXlDTixXQUFXLEdBQUcsRUFBSCxHQUFRLEtBQTVELENBREY7QUFHRDs7QUFFRCxXQUFPLEtBQUs3RixNQUFMLENBQVlxRCxLQUFaLEVBQVA7QUFDRCxHQW5VNEI7QUFxVTdCSCxFQUFBQSxvQ0FBb0MsRUFBRTtBQUFBO0FBQUEseUNBQVc7QUFDL0MsV0FBTztBQUFBO0FBQUEsbVFBT0xrRCxJQVBLO0FBQVA7QUFRRCxHQTlVNEI7QUFnVjdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxFQUFBQSxVQUFVLEVBQUU7QUFBQTtBQUFBLGFBQVNqSCxJQUFULEVBQWU7QUFDekIsUUFBSWtILGtCQUFrQixHQUFHLEtBQUsvRyxTQUFMLENBQ3JCLG9DQURxQixDQUF6QjtBQUFBLFFBR0VrRyxNQUFNLEdBQUcsQ0FBQyxLQUFLYyxXQUFMLENBQWlCLENBQWpCLENBQUQsQ0FIWDtBQUlBLFNBQUtDLGVBQUwsQ0FBcUJwSCxJQUFyQixFQUEyQixDQUEzQixFQUE4QnFHLE1BQTlCO0FBRUEsUUFBSWdCLFNBQVMsR0FBRyxLQUFLQyxRQUFMLEVBQWhCO0FBQ0FqQixJQUFBQSxNQUFNLENBQUNrQixNQUFQLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQkYsU0FBcEI7QUFFQSxTQUFLdEQsSUFBTCxDQUFVLEtBQUtuRCxNQUFMLENBQVk0RyxZQUFaLENBQXlCTixrQkFBekIsRUFBNkMsTUFBN0MsRUFBcURiLE1BQXJELENBQVY7QUFDRCxHQXBXNEI7QUFzVzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBb0IsRUFBQUEsbUJBQW1CLEVBQUU7QUFBQTtBQUFBLHdCQUFXO0FBQzlCO0FBQ0EsUUFBSVAsa0JBQWtCLEdBQUcsS0FBSy9HLFNBQUwsQ0FDckIsb0NBRHFCLENBQXpCO0FBQUEsUUFHRWtHLE1BQU0sR0FBRyxDQUFDLEtBQUtjLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBRCxDQUhYO0FBSUEsU0FBS0MsZUFBTCxDQUFxQixFQUFyQixFQUF5QixDQUF6QixFQUE0QmYsTUFBNUIsRUFBb0MsSUFBcEM7QUFFQSxTQUFLcUIsV0FBTDtBQUVBLFFBQUlDLE9BQU8sR0FBRyxLQUFLQyxRQUFMLEVBQWQ7QUFDQXZCLElBQUFBLE1BQU0sQ0FBQ2tCLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CSSxPQUFwQjtBQUVBLFNBQUtqRSxVQUFMLENBQWdCLENBQ2QsT0FEYyxFQUVkLEtBQUttRSxVQUZTLEVBR2QsTUFIYyxFQUlkRixPQUpjLEVBS2QsS0FMYyxFQU1kLEtBQUsvRyxNQUFMLENBQVk0RyxZQUFaLENBQXlCTixrQkFBekIsRUFBNkMsTUFBN0MsRUFBcURiLE1BQXJELENBTmMsRUFPZCxHQVBjLENBQWhCO0FBU0QsR0FsWTRCO0FBb1k3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQXlCLEVBQUFBLGFBQWEsRUFBRTtBQUFBO0FBQUEsZ0JBQVNDLE9BQVQsRUFBa0I7QUFDL0IsUUFBSSxLQUFLQyxjQUFULEVBQXlCO0FBQ3ZCRCxNQUFBQSxPQUFPLEdBQUcsS0FBS0MsY0FBTCxHQUFzQkQsT0FBaEM7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLRSxlQUFMLEdBQXVCLEtBQUtySCxNQUFMLENBQVkwQyxlQUFuQztBQUNEOztBQUVELFNBQUswRSxjQUFMLEdBQXNCRCxPQUF0QjtBQUNELEdBbFo0QjtBQW9aN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FHLEVBQUFBLE1BQU0sRUFBRTtBQUFBO0FBQUEsV0FBVztBQUNqQixRQUFJLEtBQUtDLFFBQUwsRUFBSixFQUFxQjtBQUNuQixXQUFLQyxZQUFMLENBQWtCLFVBQUFULE9BQU87QUFBQTtBQUFBO0FBQUEsZUFBSSxDQUFDLGFBQUQsRUFBZ0JBLE9BQWhCLEVBQXlCLE9BQXpCLENBQUo7QUFBQSxPQUF6QjtBQUVBLFdBQUtqRSxVQUFMLENBQWdCLEtBQUsvQyxjQUFMLENBQW9CLEtBQUsyRyxRQUFMLEVBQXBCLENBQWhCO0FBQ0QsS0FKRCxNQUlPO0FBQ0wsVUFBSWUsS0FBSyxHQUFHLEtBQUtmLFFBQUwsRUFBWjtBQUNBLFdBQUs1RCxVQUFMLENBQWdCLENBQ2QsTUFEYyxFQUVkMkUsS0FGYyxFQUdkLGNBSGMsRUFJZCxLQUFLMUgsY0FBTCxDQUFvQjBILEtBQXBCLEVBQTJCbkUsU0FBM0IsRUFBc0MsSUFBdEMsQ0FKYyxFQUtkLElBTGMsQ0FBaEI7O0FBT0EsVUFBSSxLQUFLakQsV0FBTCxDQUFpQkMsUUFBckIsRUFBK0I7QUFDN0IsYUFBS3dDLFVBQUwsQ0FBZ0IsQ0FDZCxTQURjLEVBRWQsS0FBSy9DLGNBQUwsQ0FBb0IsSUFBcEIsRUFBMEJ1RCxTQUExQixFQUFxQyxJQUFyQyxDQUZjLEVBR2QsSUFIYyxDQUFoQjtBQUtEO0FBQ0Y7QUFDRixHQW5iNEI7QUFxYjdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBb0UsRUFBQUEsYUFBYSxFQUFFO0FBQUE7QUFBQSxrQkFBVztBQUN4QixTQUFLNUUsVUFBTCxDQUNFLEtBQUsvQyxjQUFMLENBQW9CLENBQ2xCLEtBQUtSLFNBQUwsQ0FBZSw0QkFBZixDQURrQixFQUVsQixHQUZrQixFQUdsQixLQUFLbUgsUUFBTCxFQUhrQixFQUlsQixHQUprQixDQUFwQixDQURGO0FBUUQsR0FwYzRCO0FBc2M3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBaUIsRUFBQUEsVUFBVSxFQUFFO0FBQUE7QUFBQSxhQUFTQyxLQUFULEVBQWdCO0FBQzFCLFNBQUtqRCxXQUFMLEdBQW1CaUQsS0FBbkI7QUFDRCxHQS9jNEI7QUFpZDdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxFQUFBQSxXQUFXLEVBQUU7QUFBQTtBQUFBLGdCQUFXO0FBQ3RCLFNBQUtDLGdCQUFMLENBQXNCLEtBQUt2QixXQUFMLENBQWlCLEtBQUs1QixXQUF0QixDQUF0QjtBQUNELEdBemQ0QjtBQTJkN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQW9ELEVBQUFBLGVBQWUsRUFBRTtBQUFBO0FBQUEsa0JBQVNDLEtBQVQsRUFBZ0JDLEtBQWhCLEVBQXVCQyxNQUF2QixFQUErQkMsTUFBL0IsRUFBdUM7QUFDdEQsUUFBSTVGLENBQUMsR0FBRyxDQUFSOztBQUVBLFFBQUksQ0FBQzRGLE1BQUQsSUFBVyxLQUFLeEgsT0FBTCxDQUFhdUIsTUFBeEIsSUFBa0MsQ0FBQyxLQUFLeUMsV0FBNUMsRUFBeUQ7QUFDdkQ7QUFDQTtBQUNBLFdBQUt4QixJQUFMLENBQVUsS0FBSzdELGFBQUwsQ0FBbUIwSSxLQUFLLENBQUN6RixDQUFDLEVBQUYsQ0FBeEIsQ0FBVjtBQUNELEtBSkQsTUFJTztBQUNMLFdBQUtzRixXQUFMO0FBQ0Q7O0FBRUQsU0FBS08sV0FBTCxDQUFpQixTQUFqQixFQUE0QkosS0FBNUIsRUFBbUN6RixDQUFuQyxFQUFzQzBGLEtBQXRDLEVBQTZDQyxNQUE3QztBQUNELEdBOWU0QjtBQWdmN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUcsRUFBQUEsZ0JBQWdCLEVBQUU7QUFBQTtBQUFBLG1CQUFTQyxZQUFULEVBQXVCTixLQUF2QixFQUE4QjtBQUM5QyxTQUFLN0YsY0FBTCxHQUFzQixJQUF0QjtBQUVBLFNBQUtnQixJQUFMLENBQVUsQ0FBQyxjQUFELEVBQWlCbUYsWUFBWSxDQUFDLENBQUQsQ0FBN0IsRUFBa0MsSUFBbEMsRUFBd0NBLFlBQVksQ0FBQyxDQUFELENBQXBELEVBQXlELEdBQXpELENBQVY7QUFDQSxTQUFLRixXQUFMLENBQWlCLFNBQWpCLEVBQTRCSixLQUE1QixFQUFtQyxDQUFuQztBQUNELEdBNWY0QjtBQThmN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FPLEVBQUFBLFVBQVUsRUFBRTtBQUFBO0FBQUEsYUFBU1gsS0FBVCxFQUFnQkksS0FBaEIsRUFBdUJFLE1BQXZCLEVBQStCO0FBQ3pDLFFBQUksQ0FBQ04sS0FBTCxFQUFZO0FBQ1YsV0FBS0UsZ0JBQUwsQ0FBc0IsTUFBdEI7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLQSxnQkFBTCxDQUFzQiwwQkFBMEJGLEtBQTFCLEdBQWtDLEdBQXhEO0FBQ0Q7O0FBRUQsU0FBS1EsV0FBTCxDQUFpQixNQUFqQixFQUF5QkosS0FBekIsRUFBZ0MsQ0FBaEMsRUFBbUMsSUFBbkMsRUFBeUNFLE1BQXpDO0FBQ0QsR0E1Z0I0QjtBQThnQjdCRSxFQUFBQSxXQUFXLEVBQUU7QUFBQTtBQUFBLGNBQVNJLElBQVQsRUFBZVIsS0FBZixFQUFzQnpGLENBQXRCLEVBQXlCMEYsS0FBekIsRUFBZ0NDLE1BQWhDLEVBQXdDO0FBQUE7QUFBQTs7QUFDbkQsUUFBSSxLQUFLdkgsT0FBTCxDQUFhdUgsTUFBYixJQUF1QixLQUFLdkgsT0FBTCxDQUFhOEgsYUFBeEMsRUFBdUQ7QUFDckQsV0FBS3RGLElBQUwsQ0FBVXVGLFlBQVksQ0FBQyxLQUFLL0gsT0FBTCxDQUFhdUgsTUFBYixJQUF1QkEsTUFBeEIsRUFBZ0MsSUFBaEMsRUFBc0NGLEtBQXRDLEVBQTZDUSxJQUE3QyxDQUF0QjtBQUNBO0FBQ0Q7O0FBRUQsUUFBSUcsR0FBRyxHQUFHWCxLQUFLLENBQUN2RixNQUFoQjs7QUFDQSxXQUFPRixDQUFDLEdBQUdvRyxHQUFYLEVBQWdCcEcsQ0FBQyxFQUFqQixFQUFxQjtBQUNuQjtBQUNBLFdBQUtpRixZQUFMLENBQWtCLFVBQUFULE9BQU8sRUFBSTtBQUMzQixZQUFJNkIsTUFBTSxHQUFHLE1BQUksQ0FBQzFKLFVBQUwsQ0FBZ0I2SCxPQUFoQixFQUF5QmlCLEtBQUssQ0FBQ3pGLENBQUQsQ0FBOUIsRUFBbUNpRyxJQUFuQyxDQUFiLENBRDJCLENBRTNCO0FBQ0E7OztBQUNBLFlBQUksQ0FBQ1AsS0FBTCxFQUFZO0FBQ1YsaUJBQU8sQ0FBQyxhQUFELEVBQWdCVyxNQUFoQixFQUF3QixLQUF4QixFQUErQjdCLE9BQS9CLENBQVA7QUFDRCxTQUZELE1BRU87QUFDTDtBQUNBLGlCQUFPLENBQUMsTUFBRCxFQUFTNkIsTUFBVCxDQUFQO0FBQ0Q7QUFDRixPQVZEO0FBV0E7QUFDRDtBQUNGLEdBcGlCNEI7QUFzaUI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxFQUFBQSxxQkFBcUIsRUFBRTtBQUFBO0FBQUEsMEJBQVc7QUFDaEMsU0FBSzFGLElBQUwsQ0FBVSxDQUNSLEtBQUs1RCxTQUFMLENBQWUsa0JBQWYsQ0FEUSxFQUVSLEdBRlEsRUFHUixLQUFLbUgsUUFBTCxFQUhRLEVBSVIsSUFKUSxFQUtSLEtBQUtILFdBQUwsQ0FBaUIsQ0FBakIsQ0FMUSxFQU1SLEdBTlEsQ0FBVjtBQVFELEdBdGpCNEI7QUF3akI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0F1QyxFQUFBQSxlQUFlLEVBQUU7QUFBQTtBQUFBLGtCQUFTQyxNQUFULEVBQWlCUCxJQUFqQixFQUF1QjtBQUN0QyxTQUFLWCxXQUFMO0FBQ0EsU0FBS21CLFVBQUwsQ0FBZ0JSLElBQWhCLEVBRnNDLENBSXRDO0FBQ0E7O0FBQ0EsUUFBSUEsSUFBSSxLQUFLLGVBQWIsRUFBOEI7QUFDNUIsVUFBSSxPQUFPTyxNQUFQLEtBQWtCLFFBQXRCLEVBQWdDO0FBQzlCLGFBQUtDLFVBQUwsQ0FBZ0JELE1BQWhCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBS2pCLGdCQUFMLENBQXNCaUIsTUFBdEI7QUFDRDtBQUNGO0FBQ0YsR0E3a0I0QjtBQStrQjdCRSxFQUFBQSxTQUFTLEVBQUU7QUFBQTtBQUFBLFlBQVNDLFNBQVQsRUFBb0I7QUFDN0IsUUFBSSxLQUFLbkksUUFBVCxFQUFtQjtBQUNqQixXQUFLb0MsSUFBTCxDQUFVLElBQVYsRUFEaUIsQ0FDQTtBQUNsQjs7QUFDRCxRQUFJLEtBQUtyQyxZQUFULEVBQXVCO0FBQ3JCLFdBQUtxQyxJQUFMLENBQVUsSUFBVixFQURxQixDQUNKOztBQUNqQixXQUFLQSxJQUFMLENBQVUsSUFBVixFQUZxQixDQUVKO0FBQ2xCOztBQUNELFNBQUsyRSxnQkFBTCxDQUFzQm9CLFNBQVMsR0FBRyxXQUFILEdBQWlCLElBQWhEO0FBQ0QsR0F4bEI0QjtBQXlsQjdCQyxFQUFBQSxRQUFRLEVBQUU7QUFBQTtBQUFBLGFBQVc7QUFDbkIsUUFBSSxLQUFLQyxJQUFULEVBQWU7QUFDYixXQUFLekgsTUFBTCxDQUFZd0IsSUFBWixDQUFpQixLQUFLaUcsSUFBdEI7QUFDRDs7QUFDRCxTQUFLQSxJQUFMLEdBQVk7QUFBRUMsTUFBQUEsTUFBTSxFQUFFLEVBQVY7QUFBY0MsTUFBQUEsS0FBSyxFQUFFLEVBQXJCO0FBQXlCQyxNQUFBQSxRQUFRLEVBQUUsRUFBbkM7QUFBdUNDLE1BQUFBLEdBQUcsRUFBRTtBQUE1QyxLQUFaO0FBQ0QsR0E5bEI0QjtBQStsQjdCQyxFQUFBQSxPQUFPLEVBQUU7QUFBQTtBQUFBLFlBQVc7QUFDbEIsUUFBSUwsSUFBSSxHQUFHLEtBQUtBLElBQWhCO0FBQ0EsU0FBS0EsSUFBTCxHQUFZLEtBQUt6SCxNQUFMLENBQVkrSCxHQUFaLEVBQVo7O0FBRUEsUUFBSSxLQUFLM0ksUUFBVCxFQUFtQjtBQUNqQixXQUFLb0MsSUFBTCxDQUFVLEtBQUtnQixhQUFMLENBQW1CaUYsSUFBSSxDQUFDSSxHQUF4QixDQUFWO0FBQ0Q7O0FBQ0QsUUFBSSxLQUFLMUksWUFBVCxFQUF1QjtBQUNyQixXQUFLcUMsSUFBTCxDQUFVLEtBQUtnQixhQUFMLENBQW1CaUYsSUFBSSxDQUFDRyxRQUF4QixDQUFWO0FBQ0EsV0FBS3BHLElBQUwsQ0FBVSxLQUFLZ0IsYUFBTCxDQUFtQmlGLElBQUksQ0FBQ0UsS0FBeEIsQ0FBVjtBQUNEOztBQUVELFNBQUtuRyxJQUFMLENBQVUsS0FBS2dCLGFBQUwsQ0FBbUJpRixJQUFJLENBQUNDLE1BQXhCLENBQVY7QUFDRCxHQTVtQjRCO0FBOG1CN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FMLEVBQUFBLFVBQVUsRUFBRTtBQUFBO0FBQUEsYUFBU0QsTUFBVCxFQUFpQjtBQUMzQixTQUFLakIsZ0JBQUwsQ0FBc0IsS0FBS3RILFlBQUwsQ0FBa0J1SSxNQUFsQixDQUF0QjtBQUNELEdBdG5CNEI7QUF3bkI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FZLEVBQUFBLFdBQVcsRUFBRTtBQUFBO0FBQUEsY0FBUzVLLEtBQVQsRUFBZ0I7QUFDM0IsU0FBSytJLGdCQUFMLENBQXNCL0ksS0FBdEI7QUFDRCxHQWxvQjRCO0FBb29CN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBNkssRUFBQUEsV0FBVyxFQUFFO0FBQUE7QUFBQSxjQUFTQyxJQUFULEVBQWU7QUFDMUIsUUFBSUEsSUFBSSxJQUFJLElBQVosRUFBa0I7QUFDaEIsV0FBSy9CLGdCQUFMLENBQXNCLEtBQUtnQyxpQkFBTCxDQUF1QkQsSUFBdkIsQ0FBdEI7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLL0IsZ0JBQUwsQ0FBc0IsSUFBdEI7QUFDRDtBQUNGLEdBbHBCNEI7O0FBQUE7QUFvcEI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBaUMsRUFBQUEsaUJBM3BCNkIsNkJBMnBCWEMsU0EzcEJXLEVBMnBCQTVLLElBM3BCQSxFQTJwQk07QUFDakMsUUFBSTZLLGNBQWMsR0FBRyxLQUFLL0ssVUFBTCxDQUFnQixZQUFoQixFQUE4QkUsSUFBOUIsRUFBb0MsV0FBcEMsQ0FBckI7QUFBQSxRQUNFdUIsT0FBTyxHQUFHLEtBQUs2RixlQUFMLENBQXFCcEgsSUFBckIsRUFBMkI0SyxTQUEzQixDQURaO0FBR0EsU0FBSzlJLFVBQUwsQ0FBZ0JpQyxJQUFoQixDQUFxQixDQUNuQixPQURtQixFQUVuQixLQUFLakMsVUFBTCxDQUFnQjBGLFlBQWhCLENBQTZCcUQsY0FBN0IsRUFBNkMsRUFBN0MsRUFBaUQsQ0FDL0MsSUFEK0MsRUFFL0MsT0FGK0MsRUFHL0MsV0FIK0MsRUFJL0N0SixPQUorQyxDQUFqRCxDQUZtQixFQVFuQixTQVJtQixDQUFyQjtBQVVELEdBenFCNEI7QUEycUI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQXVKLEVBQUFBLFlBQVksRUFBRTtBQUFBO0FBQUEsZUFBU0YsU0FBVCxFQUFvQjVLLElBQXBCLEVBQTBCa0IsUUFBMUIsRUFBb0M7QUFDaEQsUUFBSTZKLFNBQVMsR0FBRyxLQUFLekQsUUFBTCxFQUFoQjtBQUFBLFFBQ0UwRCxNQUFNLEdBQUcsS0FBS0MsV0FBTCxDQUFpQkwsU0FBakIsRUFBNEI1SyxJQUE1QixDQURYO0FBR0EsUUFBSWtMLHFCQUFxQixHQUFHLEVBQTVCOztBQUVBLFFBQUloSyxRQUFKLEVBQWM7QUFDWjtBQUNBZ0ssTUFBQUEscUJBQXFCLENBQUNuSCxJQUF0QixDQUEyQmlILE1BQU0sQ0FBQ2hMLElBQWxDO0FBQ0QsS0FUK0MsQ0FVaEQ7OztBQUNBa0wsSUFBQUEscUJBQXFCLENBQUNuSCxJQUF0QixDQUEyQmdILFNBQTNCOztBQUNBLFFBQUksQ0FBQyxLQUFLeEosT0FBTCxDQUFhdUgsTUFBbEIsRUFBMEI7QUFDeEJvQyxNQUFBQSxxQkFBcUIsQ0FBQ25ILElBQXRCLENBQ0UsS0FBSzVELFNBQUwsQ0FBZSwrQkFBZixDQURGO0FBR0Q7O0FBRUQsUUFBSWdMLGtCQUFrQixHQUFHLENBQ3ZCLEdBRHVCLEVBRXZCLEtBQUtDLGdCQUFMLENBQXNCRixxQkFBdEIsRUFBNkMsSUFBN0MsQ0FGdUIsRUFHdkIsR0FIdUIsQ0FBekI7QUFLQSxRQUFJMUQsWUFBWSxHQUFHLEtBQUs1RyxNQUFMLENBQVk0RyxZQUFaLENBQ2pCMkQsa0JBRGlCLEVBRWpCLE1BRmlCLEVBR2pCSCxNQUFNLENBQUNLLFVBSFUsQ0FBbkI7QUFLQSxTQUFLdEgsSUFBTCxDQUFVeUQsWUFBVjtBQUNELEdBanRCNEI7QUFtdEI3QjRELEVBQUFBLGdCQUFnQixFQUFFO0FBQUE7QUFBQSxtQkFBU0UsS0FBVCxFQUFnQkMsU0FBaEIsRUFBMkI7QUFDM0MsUUFBSUMsTUFBTSxHQUFHLEVBQWI7QUFDQUEsSUFBQUEsTUFBTSxDQUFDekgsSUFBUCxDQUFZdUgsS0FBSyxDQUFDLENBQUQsQ0FBakI7O0FBQ0EsU0FBSyxJQUFJbkksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR21JLEtBQUssQ0FBQ2pJLE1BQTFCLEVBQWtDRixDQUFDLEVBQW5DLEVBQXVDO0FBQ3JDcUksTUFBQUEsTUFBTSxDQUFDekgsSUFBUCxDQUFZd0gsU0FBWixFQUF1QkQsS0FBSyxDQUFDbkksQ0FBRCxDQUE1QjtBQUNEOztBQUNELFdBQU9xSSxNQUFQO0FBQ0QsR0ExdEI0QjtBQTJ0QjdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLEVBQUFBLGlCQUFpQixFQUFFO0FBQUE7QUFBQSxvQkFBU2IsU0FBVCxFQUFvQjVLLElBQXBCLEVBQTBCO0FBQzNDLFFBQUlnTCxNQUFNLEdBQUcsS0FBS0MsV0FBTCxDQUFpQkwsU0FBakIsRUFBNEI1SyxJQUE1QixDQUFiO0FBQ0EsU0FBSytELElBQUwsQ0FBVSxLQUFLbkQsTUFBTCxDQUFZNEcsWUFBWixDQUF5QndELE1BQU0sQ0FBQ2hMLElBQWhDLEVBQXNDLE1BQXRDLEVBQThDZ0wsTUFBTSxDQUFDSyxVQUFyRCxDQUFWO0FBQ0QsR0FydUI0QjtBQXV1QjdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBSyxFQUFBQSxlQUFlLEVBQUU7QUFBQTtBQUFBLGtCQUFTMUwsSUFBVCxFQUFlMkwsVUFBZixFQUEyQjtBQUMxQyxTQUFLQyxXQUFMLENBQWlCLFFBQWpCO0FBRUEsUUFBSWIsU0FBUyxHQUFHLEtBQUt6RCxRQUFMLEVBQWhCO0FBRUEsU0FBS3VDLFNBQUw7QUFDQSxRQUFJbUIsTUFBTSxHQUFHLEtBQUtDLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0JqTCxJQUFwQixFQUEwQjJMLFVBQTFCLENBQWI7QUFFQSxRQUFJRSxVQUFVLEdBQUksS0FBS2hFLFVBQUwsR0FBa0IsS0FBSy9ILFVBQUwsQ0FDbEMsU0FEa0MsRUFFbENFLElBRmtDLEVBR2xDLFFBSGtDLENBQXBDO0FBTUEsUUFBSXdKLE1BQU0sR0FBRyxDQUFDLEdBQUQsRUFBTSxZQUFOLEVBQW9CcUMsVUFBcEIsRUFBZ0MsTUFBaEMsRUFBd0NkLFNBQXhDLEVBQW1ELEdBQW5ELENBQWI7O0FBQ0EsUUFBSSxDQUFDLEtBQUt4SixPQUFMLENBQWF1SCxNQUFsQixFQUEwQjtBQUN4QlUsTUFBQUEsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZLFlBQVo7QUFDQUEsTUFBQUEsTUFBTSxDQUFDekYsSUFBUCxDQUNFLHNCQURGLEVBRUUsS0FBSzVELFNBQUwsQ0FBZSwrQkFBZixDQUZGO0FBSUQ7O0FBRUQsU0FBSzRELElBQUwsQ0FBVSxDQUNSLEdBRFEsRUFFUnlGLE1BRlEsRUFHUndCLE1BQU0sQ0FBQ2MsVUFBUCxHQUFvQixDQUFDLEtBQUQsRUFBUWQsTUFBTSxDQUFDYyxVQUFmLENBQXBCLEdBQWlELEVBSHpDLEVBSVIsSUFKUSxFQUtSLHFCQUxRLEVBTVIsS0FBSzNMLFNBQUwsQ0FBZSxZQUFmLENBTlEsRUFPUixLQVBRLEVBUVIsS0FBS1MsTUFBTCxDQUFZNEcsWUFBWixDQUF5QixRQUF6QixFQUFtQyxNQUFuQyxFQUEyQ3dELE1BQU0sQ0FBQ0ssVUFBbEQsQ0FSUSxFQVNSLGFBVFEsQ0FBVjtBQVdELEdBcnhCNEI7QUF1eEI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBVSxFQUFBQSxhQUFhLEVBQUU7QUFBQTtBQUFBLGdCQUFTQyxTQUFULEVBQW9CaE0sSUFBcEIsRUFBMEJpTSxNQUExQixFQUFrQztBQUMvQyxRQUFJNUYsTUFBTSxHQUFHLEVBQWI7QUFBQSxRQUNFOUUsT0FBTyxHQUFHLEtBQUsySyxXQUFMLENBQWlCbE0sSUFBakIsRUFBdUIsQ0FBdkIsRUFBMEJxRyxNQUExQixDQURaOztBQUdBLFFBQUkyRixTQUFKLEVBQWU7QUFDYmhNLE1BQUFBLElBQUksR0FBRyxLQUFLc0gsUUFBTCxFQUFQO0FBQ0EsYUFBTy9GLE9BQU8sQ0FBQ3ZCLElBQWY7QUFDRDs7QUFFRCxRQUFJaU0sTUFBSixFQUFZO0FBQ1YxSyxNQUFBQSxPQUFPLENBQUMwSyxNQUFSLEdBQWlCN0wsSUFBSSxDQUFDQyxTQUFMLENBQWU0TCxNQUFmLENBQWpCO0FBQ0Q7O0FBQ0QxSyxJQUFBQSxPQUFPLENBQUM0SyxPQUFSLEdBQWtCLFNBQWxCO0FBQ0E1SyxJQUFBQSxPQUFPLENBQUM2SyxRQUFSLEdBQW1CLFVBQW5CO0FBQ0E3SyxJQUFBQSxPQUFPLENBQUNPLFVBQVIsR0FBcUIsc0JBQXJCOztBQUVBLFFBQUksQ0FBQ2tLLFNBQUwsRUFBZ0I7QUFDZDNGLE1BQUFBLE1BQU0sQ0FBQ2dHLE9BQVAsQ0FBZSxLQUFLdk0sVUFBTCxDQUFnQixVQUFoQixFQUE0QkUsSUFBNUIsRUFBa0MsU0FBbEMsQ0FBZjtBQUNELEtBRkQsTUFFTztBQUNMcUcsTUFBQUEsTUFBTSxDQUFDZ0csT0FBUCxDQUFlck0sSUFBZjtBQUNEOztBQUVELFFBQUksS0FBS3VCLE9BQUwsQ0FBYXVCLE1BQWpCLEVBQXlCO0FBQ3ZCdkIsTUFBQUEsT0FBTyxDQUFDK0ssTUFBUixHQUFpQixRQUFqQjtBQUNEOztBQUNEL0ssSUFBQUEsT0FBTyxHQUFHLEtBQUt3RCxhQUFMLENBQW1CeEQsT0FBbkIsQ0FBVjtBQUNBOEUsSUFBQUEsTUFBTSxDQUFDdEMsSUFBUCxDQUFZeEMsT0FBWjtBQUVBLFNBQUt3QyxJQUFMLENBQVUsS0FBS25ELE1BQUwsQ0FBWTRHLFlBQVosQ0FBeUIseUJBQXpCLEVBQW9ELEVBQXBELEVBQXdEbkIsTUFBeEQsQ0FBVjtBQUNELEdBM3pCNEI7QUE2ekI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQWtHLEVBQUFBLFlBQVksRUFBRTtBQUFBO0FBQUEsZUFBU0MsR0FBVCxFQUFjO0FBQzFCLFFBQUk3TSxLQUFLLEdBQUcsS0FBSzJILFFBQUwsRUFBWjtBQUFBLFFBQ0U5RixPQURGO0FBQUEsUUFFRTRILElBRkY7QUFBQSxRQUdFcUQsRUFIRjs7QUFLQSxRQUFJLEtBQUs5SyxRQUFULEVBQW1CO0FBQ2pCOEssTUFBQUEsRUFBRSxHQUFHLEtBQUtuRixRQUFMLEVBQUw7QUFDRDs7QUFDRCxRQUFJLEtBQUs1RixZQUFULEVBQXVCO0FBQ3JCMEgsTUFBQUEsSUFBSSxHQUFHLEtBQUs5QixRQUFMLEVBQVA7QUFDQTlGLE1BQUFBLE9BQU8sR0FBRyxLQUFLOEYsUUFBTCxFQUFWO0FBQ0Q7O0FBRUQsUUFBSTBDLElBQUksR0FBRyxLQUFLQSxJQUFoQjs7QUFDQSxRQUFJeEksT0FBSixFQUFhO0FBQ1h3SSxNQUFBQSxJQUFJLENBQUNHLFFBQUwsQ0FBY3FDLEdBQWQsSUFBcUJoTCxPQUFyQjtBQUNEOztBQUNELFFBQUk0SCxJQUFKLEVBQVU7QUFDUlksTUFBQUEsSUFBSSxDQUFDRSxLQUFMLENBQVdzQyxHQUFYLElBQWtCcEQsSUFBbEI7QUFDRDs7QUFDRCxRQUFJcUQsRUFBSixFQUFRO0FBQ056QyxNQUFBQSxJQUFJLENBQUNJLEdBQUwsQ0FBU29DLEdBQVQsSUFBZ0JDLEVBQWhCO0FBQ0Q7O0FBQ0R6QyxJQUFBQSxJQUFJLENBQUNDLE1BQUwsQ0FBWXVDLEdBQVosSUFBbUI3TSxLQUFuQjtBQUNELEdBNTFCNEI7QUE4MUI3QitNLEVBQUFBLE1BQU0sRUFBRTtBQUFBO0FBQUEsU0FBU3RELElBQVQsRUFBZXBKLElBQWYsRUFBcUIyTSxLQUFyQixFQUE0QjtBQUNsQyxRQUFJdkQsSUFBSSxLQUFLLFlBQWIsRUFBMkI7QUFDekIsV0FBS1YsZ0JBQUwsQ0FDRSxpQkFDRTFJLElBQUksQ0FBQyxDQUFELENBRE4sR0FFRSxTQUZGLEdBR0VBLElBQUksQ0FBQyxDQUFELENBSE4sR0FJRSxHQUpGLElBS0cyTSxLQUFLLEdBQUcsUUFBUXZNLElBQUksQ0FBQ0MsU0FBTCxDQUFlLE1BQU1zTSxLQUFyQixDQUFYLEdBQXlDLEVBTGpELENBREY7QUFRRCxLQVRELE1BU08sSUFBSXZELElBQUksS0FBSyxnQkFBYixFQUErQjtBQUNwQyxXQUFLUSxVQUFMLENBQWdCNUosSUFBaEI7QUFDRCxLQUZNLE1BRUEsSUFBSW9KLElBQUksS0FBSyxlQUFiLEVBQThCO0FBQ25DLFdBQUtWLGdCQUFMLENBQXNCLE1BQXRCO0FBQ0QsS0FGTSxNQUVBO0FBQ0wsV0FBS0EsZ0JBQUwsQ0FBc0IsTUFBdEI7QUFDRDtBQUNGLEdBLzJCNEI7QUFpM0I3QjtBQUVBcEUsRUFBQUEsUUFBUSxFQUFFMUUsa0JBbjNCbUI7QUFxM0I3QitDLEVBQUFBLGVBQWUsRUFBRTtBQUFBO0FBQUEsa0JBQVMxQixXQUFULEVBQXNCTSxPQUF0QixFQUErQjtBQUM5QyxRQUFJNEUsUUFBUSxHQUFHbEYsV0FBVyxDQUFDa0YsUUFBM0I7QUFBQSxRQUNFd0csS0FERjtBQUFBLFFBRUVySSxRQUZGOztBQUlBLFNBQUssSUFBSW5CLENBQUMsR0FBRyxDQUFSLEVBQVdDLENBQUMsR0FBRytDLFFBQVEsQ0FBQzlDLE1BQTdCLEVBQXFDRixDQUFDLEdBQUdDLENBQXpDLEVBQTRDRCxDQUFDLEVBQTdDLEVBQWlEO0FBQy9Dd0osTUFBQUEsS0FBSyxHQUFHeEcsUUFBUSxDQUFDaEQsQ0FBRCxDQUFoQjtBQUNBbUIsTUFBQUEsUUFBUSxHQUFHLElBQUksS0FBS0EsUUFBVCxFQUFYLENBRitDLENBRWY7O0FBRWhDLFVBQUlzSSxRQUFRLEdBQUcsS0FBS0Msb0JBQUwsQ0FBMEJGLEtBQTFCLENBQWY7O0FBRUEsVUFBSUMsUUFBUSxJQUFJLElBQWhCLEVBQXNCO0FBQ3BCLGFBQUtwTCxPQUFMLENBQWFPLFFBQWIsQ0FBc0JnQyxJQUF0QixDQUEyQixFQUEzQixFQURvQixDQUNZOztBQUNoQyxZQUFJK0ksS0FBSyxHQUFHLEtBQUt0TCxPQUFMLENBQWFPLFFBQWIsQ0FBc0JzQixNQUFsQztBQUNBc0osUUFBQUEsS0FBSyxDQUFDRyxLQUFOLEdBQWNBLEtBQWQ7QUFDQUgsUUFBQUEsS0FBSyxDQUFDM00sSUFBTixHQUFhLFlBQVk4TSxLQUF6QjtBQUNBLGFBQUt0TCxPQUFMLENBQWFPLFFBQWIsQ0FBc0IrSyxLQUF0QixJQUErQnhJLFFBQVEsQ0FBQ2hELE9BQVQsQ0FDN0JxTCxLQUQ2QixFQUU3QnBMLE9BRjZCLEVBRzdCLEtBQUtDLE9BSHdCLEVBSTdCLENBQUMsS0FBS0ksVUFKdUIsQ0FBL0I7QUFNQSxhQUFLSixPQUFMLENBQWFNLFVBQWIsQ0FBd0JnTCxLQUF4QixJQUFpQ3hJLFFBQVEsQ0FBQ3hDLFVBQTFDO0FBQ0EsYUFBS04sT0FBTCxDQUFhUSxZQUFiLENBQTBCOEssS0FBMUIsSUFBbUNILEtBQW5DO0FBRUEsYUFBSy9KLFNBQUwsR0FBaUIsS0FBS0EsU0FBTCxJQUFrQjBCLFFBQVEsQ0FBQzFCLFNBQTVDO0FBQ0EsYUFBS0csY0FBTCxHQUFzQixLQUFLQSxjQUFMLElBQXVCdUIsUUFBUSxDQUFDdkIsY0FBdEQ7QUFDQTRKLFFBQUFBLEtBQUssQ0FBQy9KLFNBQU4sR0FBa0IsS0FBS0EsU0FBdkI7QUFDQStKLFFBQUFBLEtBQUssQ0FBQzVKLGNBQU4sR0FBdUIsS0FBS0EsY0FBNUI7QUFDRCxPQWxCRCxNQWtCTztBQUNMNEosUUFBQUEsS0FBSyxDQUFDRyxLQUFOLEdBQWNGLFFBQVEsQ0FBQ0UsS0FBdkI7QUFDQUgsUUFBQUEsS0FBSyxDQUFDM00sSUFBTixHQUFhLFlBQVk0TSxRQUFRLENBQUNFLEtBQWxDO0FBRUEsYUFBS2xLLFNBQUwsR0FBaUIsS0FBS0EsU0FBTCxJQUFrQmdLLFFBQVEsQ0FBQ2hLLFNBQTVDO0FBQ0EsYUFBS0csY0FBTCxHQUFzQixLQUFLQSxjQUFMLElBQXVCNkosUUFBUSxDQUFDN0osY0FBdEQ7QUFDRDtBQUNGO0FBQ0YsR0ExNUI0QjtBQTI1QjdCOEosRUFBQUEsb0JBQW9CLEVBQUU7QUFBQTtBQUFBLHVCQUFTRixLQUFULEVBQWdCO0FBQ3BDLFNBQUssSUFBSXhKLENBQUMsR0FBRyxDQUFSLEVBQVdvRyxHQUFHLEdBQUcsS0FBSy9ILE9BQUwsQ0FBYVEsWUFBYixDQUEwQnFCLE1BQWhELEVBQXdERixDQUFDLEdBQUdvRyxHQUE1RCxFQUFpRXBHLENBQUMsRUFBbEUsRUFBc0U7QUFDcEUsVUFBSWxDLFdBQVcsR0FBRyxLQUFLTyxPQUFMLENBQWFRLFlBQWIsQ0FBMEJtQixDQUExQixDQUFsQjs7QUFDQSxVQUFJbEMsV0FBVyxJQUFJQSxXQUFXLENBQUM4TCxNQUFaLENBQW1CSixLQUFuQixDQUFuQixFQUE4QztBQUM1QyxlQUFPMUwsV0FBUDtBQUNEO0FBQ0Y7QUFDRixHQWw2QjRCO0FBbzZCN0J5SixFQUFBQSxpQkFBaUIsRUFBRTtBQUFBO0FBQUEsb0JBQVNELElBQVQsRUFBZTtBQUNoQyxRQUFJa0MsS0FBSyxHQUFHLEtBQUsxTCxXQUFMLENBQWlCa0YsUUFBakIsQ0FBMEJzRSxJQUExQixDQUFaO0FBQUEsUUFDRXVDLGFBQWEsR0FBRyxDQUFDTCxLQUFLLENBQUNHLEtBQVAsRUFBYyxNQUFkLEVBQXNCSCxLQUFLLENBQUNqSyxXQUE1QixDQURsQjs7QUFHQSxRQUFJLEtBQUtLLGNBQUwsSUFBdUIsS0FBS0gsU0FBaEMsRUFBMkM7QUFDekNvSyxNQUFBQSxhQUFhLENBQUNqSixJQUFkLENBQW1CLGFBQW5CO0FBQ0Q7O0FBQ0QsUUFBSSxLQUFLbkIsU0FBVCxFQUFvQjtBQUNsQm9LLE1BQUFBLGFBQWEsQ0FBQ2pKLElBQWQsQ0FBbUIsUUFBbkI7QUFDRDs7QUFFRCxXQUFPLHVCQUF1QmlKLGFBQWEsQ0FBQ3BILElBQWQsQ0FBbUIsSUFBbkIsQ0FBdkIsR0FBa0QsR0FBekQ7QUFDRCxHQWg3QjRCO0FBazdCN0JnRyxFQUFBQSxXQUFXLEVBQUU7QUFBQTtBQUFBLGNBQVM1TCxJQUFULEVBQWU7QUFDMUIsUUFBSSxDQUFDLEtBQUtxQyxTQUFMLENBQWVyQyxJQUFmLENBQUwsRUFBMkI7QUFDekIsV0FBS3FDLFNBQUwsQ0FBZXJDLElBQWYsSUFBdUIsSUFBdkI7QUFDQSxXQUFLcUMsU0FBTCxDQUFlQyxJQUFmLENBQW9CeUIsSUFBcEIsQ0FBeUIvRCxJQUF6QjtBQUNEO0FBQ0YsR0F2N0I0QjtBQXk3QjdCK0QsRUFBQUEsSUFBSSxFQUFFO0FBQUE7QUFBQSxPQUFTa0osSUFBVCxFQUFlO0FBQ25CLFFBQUksRUFBRUEsSUFBSSxZQUFZdk4sT0FBbEIsQ0FBSixFQUFnQztBQUM5QnVOLE1BQUFBLElBQUksR0FBRyxLQUFLck0sTUFBTCxDQUFZSSxJQUFaLENBQWlCaU0sSUFBakIsQ0FBUDtBQUNEOztBQUVELFNBQUt4SyxXQUFMLENBQWlCc0IsSUFBakIsQ0FBc0JrSixJQUF0QjtBQUNBLFdBQU9BLElBQVA7QUFDRCxHQWg4QjRCO0FBazhCN0J2RSxFQUFBQSxnQkFBZ0IsRUFBRTtBQUFBO0FBQUEsbUJBQVN3RSxJQUFULEVBQWU7QUFDL0IsU0FBS25KLElBQUwsQ0FBVSxJQUFJckUsT0FBSixDQUFZd04sSUFBWixDQUFWO0FBQ0QsR0FwOEI0QjtBQXM4QjdCeEosRUFBQUEsVUFBVSxFQUFFO0FBQUE7QUFBQSxhQUFTOUMsTUFBVCxFQUFpQjtBQUMzQixRQUFJLEtBQUtvSCxjQUFULEVBQXlCO0FBQ3ZCLFdBQUtwSCxNQUFMLENBQVltRCxJQUFaLENBQ0UsS0FBS3BELGNBQUwsQ0FDRSxLQUFLQyxNQUFMLENBQVlRLFlBQVosQ0FBeUIsS0FBSzRHLGNBQTlCLENBREYsRUFFRSxLQUFLQyxlQUZQLENBREY7QUFNQSxXQUFLRCxjQUFMLEdBQXNCOUQsU0FBdEI7QUFDRDs7QUFFRCxRQUFJdEQsTUFBSixFQUFZO0FBQ1YsV0FBS0EsTUFBTCxDQUFZbUQsSUFBWixDQUFpQm5ELE1BQWpCO0FBQ0Q7QUFDRixHQXA5QjRCO0FBczlCN0J3SCxFQUFBQSxZQUFZLEVBQUU7QUFBQTtBQUFBLGVBQVMrRSxRQUFULEVBQW1CO0FBQy9CLFFBQUlDLE1BQU0sR0FBRyxDQUFDLEdBQUQsQ0FBYjtBQUFBLFFBQ0VDLEtBREY7QUFBQSxRQUVFQyxZQUZGO0FBQUEsUUFHRUMsV0FIRjtBQUtBOztBQUNBLFFBQUksQ0FBQyxLQUFLcEYsUUFBTCxFQUFMLEVBQXNCO0FBQ3BCLFlBQU07QUFBSXhFO0FBQUFBO0FBQUFBO0FBQUFBLGdCQUFKLENBQWMsNEJBQWQsQ0FBTjtBQUNELEtBVDhCLENBVy9COzs7QUFDQSxRQUFJNkosR0FBRyxHQUFHLEtBQUtsRyxRQUFMLENBQWMsSUFBZCxDQUFWOztBQUVBLFFBQUlrRyxHQUFHLFlBQVk5TixPQUFuQixFQUE0QjtBQUMxQjtBQUNBMk4sTUFBQUEsS0FBSyxHQUFHLENBQUNHLEdBQUcsQ0FBQzdOLEtBQUwsQ0FBUjtBQUNBeU4sTUFBQUEsTUFBTSxHQUFHLENBQUMsR0FBRCxFQUFNQyxLQUFOLENBQVQ7QUFDQUUsTUFBQUEsV0FBVyxHQUFHLElBQWQ7QUFDRCxLQUxELE1BS087QUFDTDtBQUNBRCxNQUFBQSxZQUFZLEdBQUcsSUFBZjtBQUNBLFVBQUl0TixJQUFJLEdBQUcsS0FBS3lOLFNBQUwsRUFBWDtBQUVBTCxNQUFBQSxNQUFNLEdBQUcsQ0FBQyxJQUFELEVBQU8sS0FBS3JKLElBQUwsQ0FBVS9ELElBQVYsQ0FBUCxFQUF3QixLQUF4QixFQUErQndOLEdBQS9CLEVBQW9DLEdBQXBDLENBQVQ7QUFDQUgsTUFBQUEsS0FBSyxHQUFHLEtBQUt6RixRQUFMLEVBQVI7QUFDRDs7QUFFRCxRQUFJc0YsSUFBSSxHQUFHQyxRQUFRLENBQUNPLElBQVQsQ0FBYyxJQUFkLEVBQW9CTCxLQUFwQixDQUFYOztBQUVBLFFBQUksQ0FBQ0UsV0FBTCxFQUFrQjtBQUNoQixXQUFLakcsUUFBTDtBQUNEOztBQUNELFFBQUlnRyxZQUFKLEVBQWtCO0FBQ2hCLFdBQUtwTCxTQUFMO0FBQ0Q7O0FBQ0QsU0FBSzZCLElBQUwsQ0FBVXFKLE1BQU0sQ0FBQ3pILE1BQVAsQ0FBY3VILElBQWQsRUFBb0IsR0FBcEIsQ0FBVjtBQUNELEdBMy9CNEI7QUE2L0I3Qk8sRUFBQUEsU0FBUyxFQUFFO0FBQUE7QUFBQSxjQUFXO0FBQ3BCLFNBQUt2TCxTQUFMOztBQUNBLFFBQUksS0FBS0EsU0FBTCxHQUFpQixLQUFLQyxTQUFMLENBQWVrQixNQUFwQyxFQUE0QztBQUMxQyxXQUFLbEIsU0FBTCxDQUFlNEIsSUFBZixDQUFvQixVQUFVLEtBQUs3QixTQUFuQztBQUNEOztBQUNELFdBQU8sS0FBS3lMLFlBQUwsRUFBUDtBQUNELEdBbmdDNEI7QUFvZ0M3QkEsRUFBQUEsWUFBWSxFQUFFO0FBQUE7QUFBQSxpQkFBVztBQUN2QixXQUFPLFVBQVUsS0FBS3pMLFNBQXRCO0FBQ0QsR0F0Z0M0QjtBQXVnQzdCd0YsRUFBQUEsV0FBVyxFQUFFO0FBQUE7QUFBQSxnQkFBVztBQUN0QixRQUFJakYsV0FBVyxHQUFHLEtBQUtBLFdBQXZCO0FBQ0EsU0FBS0EsV0FBTCxHQUFtQixFQUFuQjs7QUFDQSxTQUFLLElBQUlVLENBQUMsR0FBRyxDQUFSLEVBQVdvRyxHQUFHLEdBQUc5RyxXQUFXLENBQUNZLE1BQWxDLEVBQTBDRixDQUFDLEdBQUdvRyxHQUE5QyxFQUFtRHBHLENBQUMsRUFBcEQsRUFBd0Q7QUFDdEQsVUFBSXlLLEtBQUssR0FBR25MLFdBQVcsQ0FBQ1UsQ0FBRCxDQUF2QjtBQUNBOztBQUNBLFVBQUl5SyxLQUFLLFlBQVlsTyxPQUFyQixFQUE4QjtBQUM1QixhQUFLOEMsWUFBTCxDQUFrQnVCLElBQWxCLENBQXVCNkosS0FBdkI7QUFDRCxPQUZELE1BRU87QUFDTCxZQUFJUCxLQUFLLEdBQUcsS0FBS0ksU0FBTCxFQUFaO0FBQ0EsYUFBSy9KLFVBQUwsQ0FBZ0IsQ0FBQzJKLEtBQUQsRUFBUSxLQUFSLEVBQWVPLEtBQWYsRUFBc0IsR0FBdEIsQ0FBaEI7QUFDQSxhQUFLcEwsWUFBTCxDQUFrQnVCLElBQWxCLENBQXVCc0osS0FBdkI7QUFDRDtBQUNGO0FBQ0YsR0FyaEM0QjtBQXNoQzdCbEYsRUFBQUEsUUFBUSxFQUFFO0FBQUE7QUFBQSxhQUFXO0FBQ25CLFdBQU8sS0FBSzFGLFdBQUwsQ0FBaUJZLE1BQXhCO0FBQ0QsR0F4aEM0QjtBQTBoQzdCaUUsRUFBQUEsUUFBUSxFQUFFO0FBQUE7QUFBQSxXQUFTdUcsT0FBVCxFQUFrQjtBQUMxQixRQUFJQyxNQUFNLEdBQUcsS0FBSzNGLFFBQUwsRUFBYjtBQUFBLFFBQ0UrRSxJQUFJLEdBQUcsQ0FBQ1ksTUFBTSxHQUFHLEtBQUtyTCxXQUFSLEdBQXNCLEtBQUtELFlBQWxDLEVBQWdEOEgsR0FBaEQsRUFEVDs7QUFHQSxRQUFJLENBQUN1RCxPQUFELElBQVlYLElBQUksWUFBWXhOLE9BQWhDLEVBQXlDO0FBQ3ZDLGFBQU93TixJQUFJLENBQUN2TixLQUFaO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsVUFBSSxDQUFDbU8sTUFBTCxFQUFhO0FBQ1g7QUFDQSxZQUFJLENBQUMsS0FBSzVMLFNBQVYsRUFBcUI7QUFDbkIsZ0JBQU07QUFBSXlCO0FBQUFBO0FBQUFBO0FBQUFBLG9CQUFKLENBQWMsbUJBQWQsQ0FBTjtBQUNEOztBQUNELGFBQUt6QixTQUFMO0FBQ0Q7O0FBQ0QsYUFBT2dMLElBQVA7QUFDRDtBQUNGLEdBMWlDNEI7QUE0aUM3QnRGLEVBQUFBLFFBQVEsRUFBRTtBQUFBO0FBQUEsYUFBVztBQUNuQixRQUFJeUYsS0FBSyxHQUFHLEtBQUtsRixRQUFMLEtBQWtCLEtBQUsxRixXQUF2QixHQUFxQyxLQUFLRCxZQUF0RDtBQUFBLFFBQ0UwSyxJQUFJLEdBQUdHLEtBQUssQ0FBQ0EsS0FBSyxDQUFDaEssTUFBTixHQUFlLENBQWhCLENBRGQ7QUFHQTs7QUFDQSxRQUFJNkosSUFBSSxZQUFZeE4sT0FBcEIsRUFBNkI7QUFDM0IsYUFBT3dOLElBQUksQ0FBQ3ZOLEtBQVo7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPdU4sSUFBUDtBQUNEO0FBQ0YsR0F0akM0QjtBQXdqQzdCL0YsRUFBQUEsV0FBVyxFQUFFO0FBQUE7QUFBQSxjQUFTM0YsT0FBVCxFQUFrQjtBQUM3QixRQUFJLEtBQUtvQixTQUFMLElBQWtCcEIsT0FBdEIsRUFBK0I7QUFDN0IsYUFBTyxZQUFZQSxPQUFaLEdBQXNCLEdBQTdCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxVQUFVQSxPQUFqQjtBQUNEO0FBQ0YsR0E5akM0QjtBQWdrQzdCSixFQUFBQSxZQUFZLEVBQUU7QUFBQTtBQUFBLGVBQVMyTSxHQUFULEVBQWM7QUFDMUIsV0FBTyxLQUFLbk4sTUFBTCxDQUFZUSxZQUFaLENBQXlCMk0sR0FBekIsQ0FBUDtBQUNELEdBbGtDNEI7QUFva0M3QmhKLEVBQUFBLGFBQWEsRUFBRTtBQUFBO0FBQUEsZ0JBQVNpSixHQUFULEVBQWM7QUFDM0IsV0FBTyxLQUFLcE4sTUFBTCxDQUFZbUUsYUFBWixDQUEwQmlKLEdBQTFCLENBQVA7QUFDRCxHQXRrQzRCO0FBd2tDN0I3TixFQUFBQSxTQUFTLEVBQUU7QUFBQTtBQUFBLFlBQVNILElBQVQsRUFBZTtBQUN4QixRQUFJcUUsR0FBRyxHQUFHLEtBQUtqQyxPQUFMLENBQWFwQyxJQUFiLENBQVY7O0FBQ0EsUUFBSXFFLEdBQUosRUFBUztBQUNQQSxNQUFBQSxHQUFHLENBQUMrQixjQUFKO0FBQ0EsYUFBTy9CLEdBQVA7QUFDRDs7QUFFREEsSUFBQUEsR0FBRyxHQUFHLEtBQUtqQyxPQUFMLENBQWFwQyxJQUFiLElBQXFCLEtBQUtZLE1BQUwsQ0FBWUksSUFBWixDQUFpQmhCLElBQWpCLENBQTNCO0FBQ0FxRSxJQUFBQSxHQUFHLENBQUNsRSxTQUFKLEdBQWdCLElBQWhCO0FBQ0FrRSxJQUFBQSxHQUFHLENBQUMrQixjQUFKLEdBQXFCLENBQXJCO0FBRUEsV0FBTy9CLEdBQVA7QUFDRCxHQXBsQzRCO0FBc2xDN0I0RyxFQUFBQSxXQUFXLEVBQUU7QUFBQTtBQUFBLGNBQVNMLFNBQVQsRUFBb0I1SyxJQUFwQixFQUEwQmlPLFdBQTFCLEVBQXVDO0FBQ2xELFFBQUk1SCxNQUFNLEdBQUcsRUFBYjtBQUFBLFFBQ0V5RixVQUFVLEdBQUcsS0FBSzFFLGVBQUwsQ0FBcUJwSCxJQUFyQixFQUEyQjRLLFNBQTNCLEVBQXNDdkUsTUFBdEMsRUFBOEM0SCxXQUE5QyxDQURmO0FBRUEsUUFBSUMsV0FBVyxHQUFHLEtBQUtwTyxVQUFMLENBQWdCLFNBQWhCLEVBQTJCRSxJQUEzQixFQUFpQyxRQUFqQyxDQUFsQjtBQUFBLFFBQ0VtTyxXQUFXLEdBQUcsS0FBS2hPLFNBQUw7QUFBQTtBQUFBLGNBQ1QsS0FBS2dILFdBQUwsQ0FBaUIsQ0FBakIsQ0FEUyx3QkFDd0IsS0FBS0EsV0FBTCxDQUNsQyxDQURrQyxDQUR4QixzQ0FEaEI7QUFPQSxXQUFPO0FBQ0xkLE1BQUFBLE1BQU0sRUFBRUEsTUFESDtBQUVMeUYsTUFBQUEsVUFBVSxFQUFFQSxVQUZQO0FBR0w5TCxNQUFBQSxJQUFJLEVBQUVrTyxXQUhEO0FBSUw3QyxNQUFBQSxVQUFVLEVBQUUsQ0FBQzhDLFdBQUQsRUFBY3hJLE1BQWQsQ0FBcUJVLE1BQXJCO0FBSlAsS0FBUDtBQU1ELEdBdG1DNEI7QUF3bUM3QjZGLEVBQUFBLFdBQVcsRUFBRTtBQUFBO0FBQUEsY0FBU2xCLE1BQVQsRUFBaUJKLFNBQWpCLEVBQTRCdkUsTUFBNUIsRUFBb0M7QUFDL0MsUUFBSTlFLE9BQU8sR0FBRyxFQUFkO0FBQUEsUUFDRTRJLFFBQVEsR0FBRyxFQURiO0FBQUEsUUFFRUQsS0FBSyxHQUFHLEVBRlY7QUFBQSxRQUdFRSxHQUFHLEdBQUcsRUFIUjtBQUFBLFFBSUVnRSxVQUFVLEdBQUcsQ0FBQy9ILE1BSmhCO0FBQUEsUUFLRWdJLEtBTEY7O0FBT0EsUUFBSUQsVUFBSixFQUFnQjtBQUNkL0gsTUFBQUEsTUFBTSxHQUFHLEVBQVQ7QUFDRDs7QUFFRDlFLElBQUFBLE9BQU8sQ0FBQ3ZCLElBQVIsR0FBZSxLQUFLb0IsWUFBTCxDQUFrQjRKLE1BQWxCLENBQWY7QUFDQXpKLElBQUFBLE9BQU8sQ0FBQ3lJLElBQVIsR0FBZSxLQUFLMUMsUUFBTCxFQUFmOztBQUVBLFFBQUksS0FBSzNGLFFBQVQsRUFBbUI7QUFDakJKLE1BQUFBLE9BQU8sQ0FBQytNLE9BQVIsR0FBa0IsS0FBS2hILFFBQUwsRUFBbEI7QUFDRDs7QUFDRCxRQUFJLEtBQUs1RixZQUFULEVBQXVCO0FBQ3JCSCxNQUFBQSxPQUFPLENBQUNnTixTQUFSLEdBQW9CLEtBQUtqSCxRQUFMLEVBQXBCO0FBQ0EvRixNQUFBQSxPQUFPLENBQUNpTixZQUFSLEdBQXVCLEtBQUtsSCxRQUFMLEVBQXZCO0FBQ0Q7O0FBRUQsUUFBSW1ILE9BQU8sR0FBRyxLQUFLbkgsUUFBTCxFQUFkO0FBQUEsUUFDRW9ILE9BQU8sR0FBRyxLQUFLcEgsUUFBTCxFQURaLENBdkIrQyxDQTBCL0M7QUFDQTs7QUFDQSxRQUFJb0gsT0FBTyxJQUFJRCxPQUFmLEVBQXdCO0FBQ3RCbE4sTUFBQUEsT0FBTyxDQUFDNEMsRUFBUixHQUFhdUssT0FBTyxJQUFJLGdCQUF4QjtBQUNBbk4sTUFBQUEsT0FBTyxDQUFDa04sT0FBUixHQUFrQkEsT0FBTyxJQUFJLGdCQUE3QjtBQUNELEtBL0I4QyxDQWlDL0M7QUFDQTs7O0FBQ0EsUUFBSXRMLENBQUMsR0FBR3lILFNBQVI7O0FBQ0EsV0FBT3pILENBQUMsRUFBUixFQUFZO0FBQ1ZrTCxNQUFBQSxLQUFLLEdBQUcsS0FBSy9HLFFBQUwsRUFBUjtBQUNBakIsTUFBQUEsTUFBTSxDQUFDbEQsQ0FBRCxDQUFOLEdBQVlrTCxLQUFaOztBQUVBLFVBQUksS0FBSzFNLFFBQVQsRUFBbUI7QUFDakJ5SSxRQUFBQSxHQUFHLENBQUNqSCxDQUFELENBQUgsR0FBUyxLQUFLbUUsUUFBTCxFQUFUO0FBQ0Q7O0FBQ0QsVUFBSSxLQUFLNUYsWUFBVCxFQUF1QjtBQUNyQndJLFFBQUFBLEtBQUssQ0FBQy9HLENBQUQsQ0FBTCxHQUFXLEtBQUttRSxRQUFMLEVBQVg7QUFDQTZDLFFBQUFBLFFBQVEsQ0FBQ2hILENBQUQsQ0FBUixHQUFjLEtBQUttRSxRQUFMLEVBQWQ7QUFDRDtBQUNGOztBQUVELFFBQUk4RyxVQUFKLEVBQWdCO0FBQ2Q3TSxNQUFBQSxPQUFPLENBQUNrQyxJQUFSLEdBQWUsS0FBSzdDLE1BQUwsQ0FBWStOLGFBQVosQ0FBMEJ0SSxNQUExQixDQUFmO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLMUUsUUFBVCxFQUFtQjtBQUNqQkosTUFBQUEsT0FBTyxDQUFDNkksR0FBUixHQUFjLEtBQUt4SixNQUFMLENBQVkrTixhQUFaLENBQTBCdkUsR0FBMUIsQ0FBZDtBQUNEOztBQUNELFFBQUksS0FBSzFJLFlBQVQsRUFBdUI7QUFDckJILE1BQUFBLE9BQU8sQ0FBQzJJLEtBQVIsR0FBZ0IsS0FBS3RKLE1BQUwsQ0FBWStOLGFBQVosQ0FBMEJ6RSxLQUExQixDQUFoQjtBQUNBM0ksTUFBQUEsT0FBTyxDQUFDNEksUUFBUixHQUFtQixLQUFLdkosTUFBTCxDQUFZK04sYUFBWixDQUEwQnhFLFFBQTFCLENBQW5CO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLNUksT0FBTCxDQUFhbUQsSUFBakIsRUFBdUI7QUFDckJuRCxNQUFBQSxPQUFPLENBQUNtRCxJQUFSLEdBQWUsTUFBZjtBQUNEOztBQUNELFFBQUksS0FBSzNCLGNBQVQsRUFBeUI7QUFDdkJ4QixNQUFBQSxPQUFPLENBQUNtQixXQUFSLEdBQXNCLGFBQXRCO0FBQ0Q7O0FBQ0QsV0FBT25CLE9BQVA7QUFDRCxHQTVxQzRCO0FBOHFDN0I2RixFQUFBQSxlQUFlLEVBQUU7QUFBQTtBQUFBLGtCQUFTNEQsTUFBVCxFQUFpQkosU0FBakIsRUFBNEJ2RSxNQUE1QixFQUFvQ3VGLFdBQXBDLEVBQWlEO0FBQ2hFLFFBQUlySyxPQUFPLEdBQUcsS0FBSzJLLFdBQUwsQ0FBaUJsQixNQUFqQixFQUF5QkosU0FBekIsRUFBb0N2RSxNQUFwQyxDQUFkO0FBQ0E5RSxJQUFBQSxPQUFPLENBQUNnQyxHQUFSLEdBQWNuRCxJQUFJLENBQUNDLFNBQUwsQ0FBZSxLQUFLTyxNQUFMLENBQVkwQyxlQUEzQixDQUFkO0FBQ0EvQixJQUFBQSxPQUFPLEdBQUcsS0FBS3dELGFBQUwsQ0FBbUJ4RCxPQUFuQixDQUFWOztBQUNBLFFBQUlxSyxXQUFKLEVBQWlCO0FBQ2YsV0FBS0EsV0FBTCxDQUFpQixTQUFqQjtBQUNBdkYsTUFBQUEsTUFBTSxDQUFDdEMsSUFBUCxDQUFZLFNBQVo7QUFDQSxhQUFPLENBQUMsVUFBRCxFQUFheEMsT0FBYixDQUFQO0FBQ0QsS0FKRCxNQUlPLElBQUk4RSxNQUFKLEVBQVk7QUFDakJBLE1BQUFBLE1BQU0sQ0FBQ3RDLElBQVAsQ0FBWXhDLE9BQVo7QUFDQSxhQUFPLEVBQVA7QUFDRCxLQUhNLE1BR0E7QUFDTCxhQUFPQSxPQUFQO0FBQ0Q7QUFDRjtBQTVyQzRCLENBQS9COztBQStyQ0EsQ0FBQyxZQUFXO0FBQ1YsTUFBTXFOLGFBQWEsR0FBRyxDQUNwQix1QkFDQSwyQkFEQSxHQUVBLHlCQUZBLEdBR0EsOEJBSEEsR0FJQSxtQkFKQSxHQUtBLGdCQUxBLEdBTUEsdUJBTkEsR0FPQSwwQkFQQSxHQVFBLGtDQVJBLEdBU0EsMEJBVEEsR0FVQSxpQ0FWQSxHQVdBLDZCQVhBLEdBWUEsK0JBWkEsR0FhQSx5Q0FiQSxHQWNBLHVDQWRBLEdBZUEsa0JBaEJvQixFQWlCcEJDLEtBakJvQixDQWlCZCxHQWpCYyxDQUF0QjtBQW1CQSxNQUFNQyxhQUFhLEdBQUlsUCxrQkFBa0IsQ0FBQ21QLGNBQW5CLEdBQW9DLEVBQTNEOztBQUVBLE9BQUssSUFBSTVMLENBQUMsR0FBRyxDQUFSLEVBQVdDLENBQUMsR0FBR3dMLGFBQWEsQ0FBQ3ZMLE1BQWxDLEVBQTBDRixDQUFDLEdBQUdDLENBQTlDLEVBQWlERCxDQUFDLEVBQWxELEVBQXNEO0FBQ3BEMkwsSUFBQUEsYUFBYSxDQUFDRixhQUFhLENBQUN6TCxDQUFELENBQWQsQ0FBYixHQUFrQyxJQUFsQztBQUNEO0FBQ0YsQ0F6QkQ7QUEyQkE7QUFDQTtBQUNBOzs7QUFDQXZELGtCQUFrQixDQUFDb1AsNkJBQW5CLEdBQW1ELFVBQVNoUCxJQUFULEVBQWU7QUFDaEUsU0FDRSxDQUFDSixrQkFBa0IsQ0FBQ21QLGNBQW5CLENBQWtDL08sSUFBbEMsQ0FBRCxJQUNBLDZCQUE2QmlQLElBQTdCLENBQWtDalAsSUFBbEMsQ0FGRjtBQUlELENBTEQ7O0FBT0EsU0FBU3NKLFlBQVQsQ0FBc0I0RixlQUF0QixFQUF1QzVLLFFBQXZDLEVBQWlEc0UsS0FBakQsRUFBd0RRLElBQXhELEVBQThEO0FBQzVELE1BQUlpRSxLQUFLLEdBQUcvSSxRQUFRLENBQUNnRCxRQUFULEVBQVo7QUFBQSxNQUNFbkUsQ0FBQyxHQUFHLENBRE47QUFBQSxNQUVFb0csR0FBRyxHQUFHWCxLQUFLLENBQUN2RixNQUZkOztBQUdBLE1BQUk2TCxlQUFKLEVBQXFCO0FBQ25CM0YsSUFBQUEsR0FBRztBQUNKOztBQUVELFNBQU9wRyxDQUFDLEdBQUdvRyxHQUFYLEVBQWdCcEcsQ0FBQyxFQUFqQixFQUFxQjtBQUNuQmtLLElBQUFBLEtBQUssR0FBRy9JLFFBQVEsQ0FBQ3hFLFVBQVQsQ0FBb0J1TixLQUFwQixFQUEyQnpFLEtBQUssQ0FBQ3pGLENBQUQsQ0FBaEMsRUFBcUNpRyxJQUFyQyxDQUFSO0FBQ0Q7O0FBRUQsTUFBSThGLGVBQUosRUFBcUI7QUFDbkIsV0FBTyxDQUNMNUssUUFBUSxDQUFDbkUsU0FBVCxDQUFtQixrQkFBbkIsQ0FESyxFQUVMLEdBRkssRUFHTGtOLEtBSEssRUFJTCxJQUpLLEVBS0wvSSxRQUFRLENBQUNsRCxZQUFULENBQXNCd0gsS0FBSyxDQUFDekYsQ0FBRCxDQUEzQixDQUxLLEVBTUwsSUFOSyxFQU9ML0MsSUFBSSxDQUFDQyxTQUFMLENBQWVpRSxRQUFRLENBQUMxRCxNQUFULENBQWdCMEMsZUFBL0IsQ0FQSyxFQVFMLElBUkssQ0FBUDtBQVVELEdBWEQsTUFXTztBQUNMLFdBQU8rSixLQUFQO0FBQ0Q7QUFDRjs7O2VBRWN6TixrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENPTVBJTEVSX1JFVklTSU9OLCBSRVZJU0lPTl9DSEFOR0VTIH0gZnJvbSAnLi4vYmFzZSc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4uL2V4Y2VwdGlvbic7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IENvZGVHZW4gZnJvbSAnLi9jb2RlLWdlbic7XG5cbmZ1bmN0aW9uIExpdGVyYWwodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBKYXZhU2NyaXB0Q29tcGlsZXIoKSB7fVxuXG5KYXZhU2NyaXB0Q29tcGlsZXIucHJvdG90eXBlID0ge1xuICAvLyBQVUJMSUMgQVBJOiBZb3UgY2FuIG92ZXJyaWRlIHRoZXNlIG1ldGhvZHMgaW4gYSBzdWJjbGFzcyB0byBwcm92aWRlXG4gIC8vIGFsdGVybmF0aXZlIGNvbXBpbGVkIGZvcm1zIGZvciBuYW1lIGxvb2t1cCBhbmQgYnVmZmVyaW5nIHNlbWFudGljc1xuICBuYW1lTG9va3VwOiBmdW5jdGlvbihwYXJlbnQsIG5hbWUgLyosICB0eXBlICovKSB7XG4gICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxOYW1lTG9va3VwKHBhcmVudCwgbmFtZSk7XG4gIH0sXG4gIGRlcHRoZWRMb29rdXA6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgdGhpcy5hbGlhc2FibGUoJ2NvbnRhaW5lci5sb29rdXAnKSxcbiAgICAgICcoZGVwdGhzLCAnLFxuICAgICAgSlNPTi5zdHJpbmdpZnkobmFtZSksXG4gICAgICAnKSdcbiAgICBdO1xuICB9LFxuXG4gIGNvbXBpbGVySW5mbzogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTixcbiAgICAgIHZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tyZXZpc2lvbl07XG4gICAgcmV0dXJuIFtyZXZpc2lvbiwgdmVyc2lvbnNdO1xuICB9LFxuXG4gIGFwcGVuZFRvQnVmZmVyOiBmdW5jdGlvbihzb3VyY2UsIGxvY2F0aW9uLCBleHBsaWNpdCkge1xuICAgIC8vIEZvcmNlIGEgc291cmNlIGFzIHRoaXMgc2ltcGxpZmllcyB0aGUgbWVyZ2UgbG9naWMuXG4gICAgaWYgKCFpc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIHNvdXJjZSA9IFtzb3VyY2VdO1xuICAgIH1cbiAgICBzb3VyY2UgPSB0aGlzLnNvdXJjZS53cmFwKHNvdXJjZSwgbG9jYXRpb24pO1xuXG4gICAgaWYgKHRoaXMuZW52aXJvbm1lbnQuaXNTaW1wbGUpIHtcbiAgICAgIHJldHVybiBbJ3JldHVybiAnLCBzb3VyY2UsICc7J107XG4gICAgfSBlbHNlIGlmIChleHBsaWNpdCkge1xuICAgICAgLy8gVGhpcyBpcyBhIGNhc2Ugd2hlcmUgdGhlIGJ1ZmZlciBvcGVyYXRpb24gb2NjdXJzIGFzIGEgY2hpbGQgb2YgYW5vdGhlclxuICAgICAgLy8gY29uc3RydWN0LCBnZW5lcmFsbHkgYnJhY2VzLiBXZSBoYXZlIHRvIGV4cGxpY2l0bHkgb3V0cHV0IHRoZXNlIGJ1ZmZlclxuICAgICAgLy8gb3BlcmF0aW9ucyB0byBlbnN1cmUgdGhhdCB0aGUgZW1pdHRlZCBjb2RlIGdvZXMgaW4gdGhlIGNvcnJlY3QgbG9jYXRpb24uXG4gICAgICByZXR1cm4gWydidWZmZXIgKz0gJywgc291cmNlLCAnOyddO1xuICAgIH0gZWxzZSB7XG4gICAgICBzb3VyY2UuYXBwZW5kVG9CdWZmZXIgPSB0cnVlO1xuICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZUJ1ZmZlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVvdGVkU3RyaW5nKCcnKTtcbiAgfSxcbiAgLy8gRU5EIFBVQkxJQyBBUElcbiAgaW50ZXJuYWxOYW1lTG9va3VwOiBmdW5jdGlvbihwYXJlbnQsIG5hbWUpIHtcbiAgICB0aGlzLmxvb2t1cFByb3BlcnR5RnVuY3Rpb25Jc1VzZWQgPSB0cnVlO1xuICAgIHJldHVybiBbJ2xvb2t1cFByb3BlcnR5KCcsIHBhcmVudCwgJywnLCBKU09OLnN0cmluZ2lmeShuYW1lKSwgJyknXTtcbiAgfSxcblxuICBsb29rdXBQcm9wZXJ0eUZ1bmN0aW9uSXNVc2VkOiBmYWxzZSxcblxuICBjb21waWxlOiBmdW5jdGlvbihlbnZpcm9ubWVudCwgb3B0aW9ucywgY29udGV4dCwgYXNPYmplY3QpIHtcbiAgICB0aGlzLmVudmlyb25tZW50ID0gZW52aXJvbm1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnN0cmluZ1BhcmFtcyA9IHRoaXMub3B0aW9ucy5zdHJpbmdQYXJhbXM7XG4gICAgdGhpcy50cmFja0lkcyA9IHRoaXMub3B0aW9ucy50cmFja0lkcztcbiAgICB0aGlzLnByZWNvbXBpbGUgPSAhYXNPYmplY3Q7XG5cbiAgICB0aGlzLm5hbWUgPSB0aGlzLmVudmlyb25tZW50Lm5hbWU7XG4gICAgdGhpcy5pc0NoaWxkID0gISFjb250ZXh0O1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQgfHwge1xuICAgICAgZGVjb3JhdG9yczogW10sXG4gICAgICBwcm9ncmFtczogW10sXG4gICAgICBlbnZpcm9ubWVudHM6IFtdXG4gICAgfTtcblxuICAgIHRoaXMucHJlYW1ibGUoKTtcblxuICAgIHRoaXMuc3RhY2tTbG90ID0gMDtcbiAgICB0aGlzLnN0YWNrVmFycyA9IFtdO1xuICAgIHRoaXMuYWxpYXNlcyA9IHt9O1xuICAgIHRoaXMucmVnaXN0ZXJzID0geyBsaXN0OiBbXSB9O1xuICAgIHRoaXMuaGFzaGVzID0gW107XG4gICAgdGhpcy5jb21waWxlU3RhY2sgPSBbXTtcbiAgICB0aGlzLmlubGluZVN0YWNrID0gW107XG4gICAgdGhpcy5ibG9ja1BhcmFtcyA9IFtdO1xuXG4gICAgdGhpcy5jb21waWxlQ2hpbGRyZW4oZW52aXJvbm1lbnQsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy51c2VEZXB0aHMgPVxuICAgICAgdGhpcy51c2VEZXB0aHMgfHxcbiAgICAgIGVudmlyb25tZW50LnVzZURlcHRocyB8fFxuICAgICAgZW52aXJvbm1lbnQudXNlRGVjb3JhdG9ycyB8fFxuICAgICAgdGhpcy5vcHRpb25zLmNvbXBhdDtcbiAgICB0aGlzLnVzZUJsb2NrUGFyYW1zID0gdGhpcy51c2VCbG9ja1BhcmFtcyB8fCBlbnZpcm9ubWVudC51c2VCbG9ja1BhcmFtcztcblxuICAgIGxldCBvcGNvZGVzID0gZW52aXJvbm1lbnQub3Bjb2RlcyxcbiAgICAgIG9wY29kZSxcbiAgICAgIGZpcnN0TG9jLFxuICAgICAgaSxcbiAgICAgIGw7XG5cbiAgICBmb3IgKGkgPSAwLCBsID0gb3Bjb2Rlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIG9wY29kZSA9IG9wY29kZXNbaV07XG5cbiAgICAgIHRoaXMuc291cmNlLmN1cnJlbnRMb2NhdGlvbiA9IG9wY29kZS5sb2M7XG4gICAgICBmaXJzdExvYyA9IGZpcnN0TG9jIHx8IG9wY29kZS5sb2M7XG4gICAgICB0aGlzW29wY29kZS5vcGNvZGVdLmFwcGx5KHRoaXMsIG9wY29kZS5hcmdzKTtcbiAgICB9XG5cbiAgICAvLyBGbHVzaCBhbnkgdHJhaWxpbmcgY29udGVudCB0aGF0IG1pZ2h0IGJlIHBlbmRpbmcuXG4gICAgdGhpcy5zb3VyY2UuY3VycmVudExvY2F0aW9uID0gZmlyc3RMb2M7XG4gICAgdGhpcy5wdXNoU291cmNlKCcnKTtcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuc3RhY2tTbG90IHx8IHRoaXMuaW5saW5lU3RhY2subGVuZ3RoIHx8IHRoaXMuY29tcGlsZVN0YWNrLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignQ29tcGlsZSBjb21wbGV0ZWQgd2l0aCBjb250ZW50IGxlZnQgb24gc3RhY2snKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZGVjb3JhdG9ycy5pc0VtcHR5KCkpIHtcbiAgICAgIHRoaXMudXNlRGVjb3JhdG9ycyA9IHRydWU7XG5cbiAgICAgIHRoaXMuZGVjb3JhdG9ycy5wcmVwZW5kKFtcbiAgICAgICAgJ3ZhciBkZWNvcmF0b3JzID0gY29udGFpbmVyLmRlY29yYXRvcnMsICcsXG4gICAgICAgIHRoaXMubG9va3VwUHJvcGVydHlGdW5jdGlvblZhckRlY2xhcmF0aW9uKCksXG4gICAgICAgICc7XFxuJ1xuICAgICAgXSk7XG4gICAgICB0aGlzLmRlY29yYXRvcnMucHVzaCgncmV0dXJuIGZuOycpO1xuXG4gICAgICBpZiAoYXNPYmplY3QpIHtcbiAgICAgICAgdGhpcy5kZWNvcmF0b3JzID0gRnVuY3Rpb24uYXBwbHkodGhpcywgW1xuICAgICAgICAgICdmbicsXG4gICAgICAgICAgJ3Byb3BzJyxcbiAgICAgICAgICAnY29udGFpbmVyJyxcbiAgICAgICAgICAnZGVwdGgwJyxcbiAgICAgICAgICAnZGF0YScsXG4gICAgICAgICAgJ2Jsb2NrUGFyYW1zJyxcbiAgICAgICAgICAnZGVwdGhzJyxcbiAgICAgICAgICB0aGlzLmRlY29yYXRvcnMubWVyZ2UoKVxuICAgICAgICBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVjb3JhdG9ycy5wcmVwZW5kKFxuICAgICAgICAgICdmdW5jdGlvbihmbiwgcHJvcHMsIGNvbnRhaW5lciwgZGVwdGgwLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XFxuJ1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmRlY29yYXRvcnMucHVzaCgnfVxcbicpO1xuICAgICAgICB0aGlzLmRlY29yYXRvcnMgPSB0aGlzLmRlY29yYXRvcnMubWVyZ2UoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWNvcmF0b3JzID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGxldCBmbiA9IHRoaXMuY3JlYXRlRnVuY3Rpb25Db250ZXh0KGFzT2JqZWN0KTtcbiAgICBpZiAoIXRoaXMuaXNDaGlsZCkge1xuICAgICAgbGV0IHJldCA9IHtcbiAgICAgICAgY29tcGlsZXI6IHRoaXMuY29tcGlsZXJJbmZvKCksXG4gICAgICAgIG1haW46IGZuXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5kZWNvcmF0b3JzKSB7XG4gICAgICAgIHJldC5tYWluX2QgPSB0aGlzLmRlY29yYXRvcnM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXG4gICAgICAgIHJldC51c2VEZWNvcmF0b3JzID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHsgcHJvZ3JhbXMsIGRlY29yYXRvcnMgfSA9IHRoaXMuY29udGV4dDtcbiAgICAgIGZvciAoaSA9IDAsIGwgPSBwcm9ncmFtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKHByb2dyYW1zW2ldKSB7XG4gICAgICAgICAgcmV0W2ldID0gcHJvZ3JhbXNbaV07XG4gICAgICAgICAgaWYgKGRlY29yYXRvcnNbaV0pIHtcbiAgICAgICAgICAgIHJldFtpICsgJ19kJ10gPSBkZWNvcmF0b3JzW2ldO1xuICAgICAgICAgICAgcmV0LnVzZURlY29yYXRvcnMgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5lbnZpcm9ubWVudC51c2VQYXJ0aWFsKSB7XG4gICAgICAgIHJldC51c2VQYXJ0aWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGF0YSkge1xuICAgICAgICByZXQudXNlRGF0YSA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy51c2VEZXB0aHMpIHtcbiAgICAgICAgcmV0LnVzZURlcHRocyA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy51c2VCbG9ja1BhcmFtcykge1xuICAgICAgICByZXQudXNlQmxvY2tQYXJhbXMgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXQpIHtcbiAgICAgICAgcmV0LmNvbXBhdCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghYXNPYmplY3QpIHtcbiAgICAgICAgcmV0LmNvbXBpbGVyID0gSlNPTi5zdHJpbmdpZnkocmV0LmNvbXBpbGVyKTtcblxuICAgICAgICB0aGlzLnNvdXJjZS5jdXJyZW50TG9jYXRpb24gPSB7IHN0YXJ0OiB7IGxpbmU6IDEsIGNvbHVtbjogMCB9IH07XG4gICAgICAgIHJldCA9IHRoaXMub2JqZWN0TGl0ZXJhbChyZXQpO1xuXG4gICAgICAgIGlmIChvcHRpb25zLnNyY05hbWUpIHtcbiAgICAgICAgICByZXQgPSByZXQudG9TdHJpbmdXaXRoU291cmNlTWFwKHsgZmlsZTogb3B0aW9ucy5kZXN0TmFtZSB9KTtcbiAgICAgICAgICByZXQubWFwID0gcmV0Lm1hcCAmJiByZXQubWFwLnRvU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0ID0gcmV0LnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldC5jb21waWxlck9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcHJlYW1ibGU6IGZ1bmN0aW9uKCkge1xuICAgIC8vIHRyYWNrIHRoZSBsYXN0IGNvbnRleHQgcHVzaGVkIGludG8gcGxhY2UgdG8gYWxsb3cgc2tpcHBpbmcgdGhlXG4gICAgLy8gZ2V0Q29udGV4dCBvcGNvZGUgd2hlbiBpdCB3b3VsZCBiZSBhIG5vb3BcbiAgICB0aGlzLmxhc3RDb250ZXh0ID0gMDtcbiAgICB0aGlzLnNvdXJjZSA9IG5ldyBDb2RlR2VuKHRoaXMub3B0aW9ucy5zcmNOYW1lKTtcbiAgICB0aGlzLmRlY29yYXRvcnMgPSBuZXcgQ29kZUdlbih0aGlzLm9wdGlvbnMuc3JjTmFtZSk7XG4gIH0sXG5cbiAgY3JlYXRlRnVuY3Rpb25Db250ZXh0OiBmdW5jdGlvbihhc09iamVjdCkge1xuICAgIGxldCB2YXJEZWNsYXJhdGlvbnMgPSAnJztcblxuICAgIGxldCBsb2NhbHMgPSB0aGlzLnN0YWNrVmFycy5jb25jYXQodGhpcy5yZWdpc3RlcnMubGlzdCk7XG4gICAgaWYgKGxvY2Fscy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXJEZWNsYXJhdGlvbnMgKz0gJywgJyArIGxvY2Fscy5qb2luKCcsICcpO1xuICAgIH1cblxuICAgIC8vIEdlbmVyYXRlIG1pbmltaXplciBhbGlhcyBtYXBwaW5nc1xuICAgIC8vXG4gICAgLy8gV2hlbiB1c2luZyB0cnVlIFNvdXJjZU5vZGVzLCB0aGlzIHdpbGwgdXBkYXRlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBnaXZlbiBhbGlhc1xuICAgIC8vIGFzIHRoZSBzb3VyY2Ugbm9kZXMgYXJlIHJldXNlZCBpbiBzaXR1LiBGb3IgdGhlIG5vbi1zb3VyY2Ugbm9kZSBjb21waWxhdGlvbiBtb2RlLFxuICAgIC8vIGFsaWFzZXMgd2lsbCBub3QgYmUgdXNlZCwgYnV0IHRoaXMgY2FzZSBpcyBhbHJlYWR5IGJlaW5nIHJ1biBvbiB0aGUgY2xpZW50IGFuZFxuICAgIC8vIHdlIGFyZW4ndCBjb25jZXJuIGFib3V0IG1pbmltaXppbmcgdGhlIHRlbXBsYXRlIHNpemUuXG4gICAgbGV0IGFsaWFzQ291bnQgPSAwO1xuICAgIE9iamVjdC5rZXlzKHRoaXMuYWxpYXNlcykuZm9yRWFjaChhbGlhcyA9PiB7XG4gICAgICBsZXQgbm9kZSA9IHRoaXMuYWxpYXNlc1thbGlhc107XG4gICAgICBpZiAobm9kZS5jaGlsZHJlbiAmJiBub2RlLnJlZmVyZW5jZUNvdW50ID4gMSkge1xuICAgICAgICB2YXJEZWNsYXJhdGlvbnMgKz0gJywgYWxpYXMnICsgKythbGlhc0NvdW50ICsgJz0nICsgYWxpYXM7XG4gICAgICAgIG5vZGUuY2hpbGRyZW5bMF0gPSAnYWxpYXMnICsgYWxpYXNDb3VudDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmxvb2t1cFByb3BlcnR5RnVuY3Rpb25Jc1VzZWQpIHtcbiAgICAgIHZhckRlY2xhcmF0aW9ucyArPSAnLCAnICsgdGhpcy5sb29rdXBQcm9wZXJ0eUZ1bmN0aW9uVmFyRGVjbGFyYXRpb24oKTtcbiAgICB9XG5cbiAgICBsZXQgcGFyYW1zID0gWydjb250YWluZXInLCAnZGVwdGgwJywgJ2hlbHBlcnMnLCAncGFydGlhbHMnLCAnZGF0YSddO1xuXG4gICAgaWYgKHRoaXMudXNlQmxvY2tQYXJhbXMgfHwgdGhpcy51c2VEZXB0aHMpIHtcbiAgICAgIHBhcmFtcy5wdXNoKCdibG9ja1BhcmFtcycpO1xuICAgIH1cbiAgICBpZiAodGhpcy51c2VEZXB0aHMpIHtcbiAgICAgIHBhcmFtcy5wdXNoKCdkZXB0aHMnKTtcbiAgICB9XG5cbiAgICAvLyBQZXJmb3JtIGEgc2Vjb25kIHBhc3Mgb3ZlciB0aGUgb3V0cHV0IHRvIG1lcmdlIGNvbnRlbnQgd2hlbiBwb3NzaWJsZVxuICAgIGxldCBzb3VyY2UgPSB0aGlzLm1lcmdlU291cmNlKHZhckRlY2xhcmF0aW9ucyk7XG5cbiAgICBpZiAoYXNPYmplY3QpIHtcbiAgICAgIHBhcmFtcy5wdXNoKHNvdXJjZSk7XG5cbiAgICAgIHJldHVybiBGdW5jdGlvbi5hcHBseSh0aGlzLCBwYXJhbXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2Uud3JhcChbXG4gICAgICAgICdmdW5jdGlvbignLFxuICAgICAgICBwYXJhbXMuam9pbignLCcpLFxuICAgICAgICAnKSB7XFxuICAnLFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgICd9J1xuICAgICAgXSk7XG4gICAgfVxuICB9LFxuICBtZXJnZVNvdXJjZTogZnVuY3Rpb24odmFyRGVjbGFyYXRpb25zKSB7XG4gICAgbGV0IGlzU2ltcGxlID0gdGhpcy5lbnZpcm9ubWVudC5pc1NpbXBsZSxcbiAgICAgIGFwcGVuZE9ubHkgPSAhdGhpcy5mb3JjZUJ1ZmZlcixcbiAgICAgIGFwcGVuZEZpcnN0LFxuICAgICAgc291cmNlU2VlbixcbiAgICAgIGJ1ZmZlclN0YXJ0LFxuICAgICAgYnVmZmVyRW5kO1xuICAgIHRoaXMuc291cmNlLmVhY2gobGluZSA9PiB7XG4gICAgICBpZiAobGluZS5hcHBlbmRUb0J1ZmZlcikge1xuICAgICAgICBpZiAoYnVmZmVyU3RhcnQpIHtcbiAgICAgICAgICBsaW5lLnByZXBlbmQoJyAgKyAnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWZmZXJTdGFydCA9IGxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyRW5kID0gbGluZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChidWZmZXJTdGFydCkge1xuICAgICAgICAgIGlmICghc291cmNlU2Vlbikge1xuICAgICAgICAgICAgYXBwZW5kRmlyc3QgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWZmZXJTdGFydC5wcmVwZW5kKCdidWZmZXIgKz0gJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJ1ZmZlckVuZC5hZGQoJzsnKTtcbiAgICAgICAgICBidWZmZXJTdGFydCA9IGJ1ZmZlckVuZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNvdXJjZVNlZW4gPSB0cnVlO1xuICAgICAgICBpZiAoIWlzU2ltcGxlKSB7XG4gICAgICAgICAgYXBwZW5kT25seSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoYXBwZW5kT25seSkge1xuICAgICAgaWYgKGJ1ZmZlclN0YXJ0KSB7XG4gICAgICAgIGJ1ZmZlclN0YXJ0LnByZXBlbmQoJ3JldHVybiAnKTtcbiAgICAgICAgYnVmZmVyRW5kLmFkZCgnOycpO1xuICAgICAgfSBlbHNlIGlmICghc291cmNlU2Vlbikge1xuICAgICAgICB0aGlzLnNvdXJjZS5wdXNoKCdyZXR1cm4gXCJcIjsnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyRGVjbGFyYXRpb25zICs9XG4gICAgICAgICcsIGJ1ZmZlciA9ICcgKyAoYXBwZW5kRmlyc3QgPyAnJyA6IHRoaXMuaW5pdGlhbGl6ZUJ1ZmZlcigpKTtcblxuICAgICAgaWYgKGJ1ZmZlclN0YXJ0KSB7XG4gICAgICAgIGJ1ZmZlclN0YXJ0LnByZXBlbmQoJ3JldHVybiBidWZmZXIgKyAnKTtcbiAgICAgICAgYnVmZmVyRW5kLmFkZCgnOycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zb3VyY2UucHVzaCgncmV0dXJuIGJ1ZmZlcjsnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodmFyRGVjbGFyYXRpb25zKSB7XG4gICAgICB0aGlzLnNvdXJjZS5wcmVwZW5kKFxuICAgICAgICAndmFyICcgKyB2YXJEZWNsYXJhdGlvbnMuc3Vic3RyaW5nKDIpICsgKGFwcGVuZEZpcnN0ID8gJycgOiAnO1xcbicpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5tZXJnZSgpO1xuICB9LFxuXG4gIGxvb2t1cFByb3BlcnR5RnVuY3Rpb25WYXJEZWNsYXJhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGBcbiAgICAgIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gICAgYC50cmltKCk7XG4gIH0sXG5cbiAgLy8gW2Jsb2NrVmFsdWVdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHZhbHVlXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogcmV0dXJuIHZhbHVlIG9mIGJsb2NrSGVscGVyTWlzc2luZ1xuICAvL1xuICAvLyBUaGUgcHVycG9zZSBvZiB0aGlzIG9wY29kZSBpcyB0byB0YWtlIGEgYmxvY2sgb2YgdGhlIGZvcm1cbiAgLy8gYHt7I3RoaXMuZm9vfX0uLi57ey90aGlzLmZvb319YCwgcmVzb2x2ZSB0aGUgdmFsdWUgb2YgYGZvb2AsIGFuZFxuICAvLyByZXBsYWNlIGl0IG9uIHRoZSBzdGFjayB3aXRoIHRoZSByZXN1bHQgb2YgcHJvcGVybHlcbiAgLy8gaW52b2tpbmcgYmxvY2tIZWxwZXJNaXNzaW5nLlxuICBibG9ja1ZhbHVlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgbGV0IGJsb2NrSGVscGVyTWlzc2luZyA9IHRoaXMuYWxpYXNhYmxlKFxuICAgICAgICAnY29udGFpbmVyLmhvb2tzLmJsb2NrSGVscGVyTWlzc2luZydcbiAgICAgICksXG4gICAgICBwYXJhbXMgPSBbdGhpcy5jb250ZXh0TmFtZSgwKV07XG4gICAgdGhpcy5zZXR1cEhlbHBlckFyZ3MobmFtZSwgMCwgcGFyYW1zKTtcblxuICAgIGxldCBibG9ja05hbWUgPSB0aGlzLnBvcFN0YWNrKCk7XG4gICAgcGFyYW1zLnNwbGljZSgxLCAwLCBibG9ja05hbWUpO1xuXG4gICAgdGhpcy5wdXNoKHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbChibG9ja0hlbHBlck1pc3NpbmcsICdjYWxsJywgcGFyYW1zKSk7XG4gIH0sXG5cbiAgLy8gW2FtYmlndW91c0Jsb2NrVmFsdWVdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHZhbHVlXG4gIC8vIENvbXBpbGVyIHZhbHVlLCBiZWZvcmU6IGxhc3RIZWxwZXI9dmFsdWUgb2YgbGFzdCBmb3VuZCBoZWxwZXIsIGlmIGFueVxuICAvLyBPbiBzdGFjaywgYWZ0ZXIsIGlmIG5vIGxhc3RIZWxwZXI6IHNhbWUgYXMgW2Jsb2NrVmFsdWVdXG4gIC8vIE9uIHN0YWNrLCBhZnRlciwgaWYgbGFzdEhlbHBlcjogdmFsdWVcbiAgYW1iaWd1b3VzQmxvY2tWYWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgLy8gV2UncmUgYmVpbmcgYSBiaXQgY2hlZWt5IGFuZCByZXVzaW5nIHRoZSBvcHRpb25zIHZhbHVlIGZyb20gdGhlIHByaW9yIGV4ZWNcbiAgICBsZXQgYmxvY2tIZWxwZXJNaXNzaW5nID0gdGhpcy5hbGlhc2FibGUoXG4gICAgICAgICdjb250YWluZXIuaG9va3MuYmxvY2tIZWxwZXJNaXNzaW5nJ1xuICAgICAgKSxcbiAgICAgIHBhcmFtcyA9IFt0aGlzLmNvbnRleHROYW1lKDApXTtcbiAgICB0aGlzLnNldHVwSGVscGVyQXJncygnJywgMCwgcGFyYW1zLCB0cnVlKTtcblxuICAgIHRoaXMuZmx1c2hJbmxpbmUoKTtcblxuICAgIGxldCBjdXJyZW50ID0gdGhpcy50b3BTdGFjaygpO1xuICAgIHBhcmFtcy5zcGxpY2UoMSwgMCwgY3VycmVudCk7XG5cbiAgICB0aGlzLnB1c2hTb3VyY2UoW1xuICAgICAgJ2lmICghJyxcbiAgICAgIHRoaXMubGFzdEhlbHBlcixcbiAgICAgICcpIHsgJyxcbiAgICAgIGN1cnJlbnQsXG4gICAgICAnID0gJyxcbiAgICAgIHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbChibG9ja0hlbHBlck1pc3NpbmcsICdjYWxsJywgcGFyYW1zKSxcbiAgICAgICd9J1xuICAgIF0pO1xuICB9LFxuXG4gIC8vIFthcHBlbmRDb250ZW50XVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cbiAgLy9cbiAgLy8gQXBwZW5kcyB0aGUgc3RyaW5nIHZhbHVlIG9mIGBjb250ZW50YCB0byB0aGUgY3VycmVudCBidWZmZXJcbiAgYXBwZW5kQ29udGVudDogZnVuY3Rpb24oY29udGVudCkge1xuICAgIGlmICh0aGlzLnBlbmRpbmdDb250ZW50KSB7XG4gICAgICBjb250ZW50ID0gdGhpcy5wZW5kaW5nQ29udGVudCArIGNvbnRlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGVuZGluZ0xvY2F0aW9uID0gdGhpcy5zb3VyY2UuY3VycmVudExvY2F0aW9uO1xuICAgIH1cblxuICAgIHRoaXMucGVuZGluZ0NvbnRlbnQgPSBjb250ZW50O1xuICB9LFxuXG4gIC8vIFthcHBlbmRdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IHZhbHVlLCAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cbiAgLy9cbiAgLy8gQ29lcmNlcyBgdmFsdWVgIHRvIGEgU3RyaW5nIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBjdXJyZW50IGJ1ZmZlci5cbiAgLy9cbiAgLy8gSWYgYHZhbHVlYCBpcyB0cnV0aHksIG9yIDAsIGl0IGlzIGNvZXJjZWQgaW50byBhIHN0cmluZyBhbmQgYXBwZW5kZWRcbiAgLy8gT3RoZXJ3aXNlLCB0aGUgZW1wdHkgc3RyaW5nIGlzIGFwcGVuZGVkXG4gIGFwcGVuZDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaXNJbmxpbmUoKSkge1xuICAgICAgdGhpcy5yZXBsYWNlU3RhY2soY3VycmVudCA9PiBbJyAhPSBudWxsID8gJywgY3VycmVudCwgJyA6IFwiXCInXSk7XG5cbiAgICAgIHRoaXMucHVzaFNvdXJjZSh0aGlzLmFwcGVuZFRvQnVmZmVyKHRoaXMucG9wU3RhY2soKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbG9jYWwgPSB0aGlzLnBvcFN0YWNrKCk7XG4gICAgICB0aGlzLnB1c2hTb3VyY2UoW1xuICAgICAgICAnaWYgKCcsXG4gICAgICAgIGxvY2FsLFxuICAgICAgICAnICE9IG51bGwpIHsgJyxcbiAgICAgICAgdGhpcy5hcHBlbmRUb0J1ZmZlcihsb2NhbCwgdW5kZWZpbmVkLCB0cnVlKSxcbiAgICAgICAgJyB9J1xuICAgICAgXSk7XG4gICAgICBpZiAodGhpcy5lbnZpcm9ubWVudC5pc1NpbXBsZSkge1xuICAgICAgICB0aGlzLnB1c2hTb3VyY2UoW1xuICAgICAgICAgICdlbHNlIHsgJyxcbiAgICAgICAgICB0aGlzLmFwcGVuZFRvQnVmZmVyKFwiJydcIiwgdW5kZWZpbmVkLCB0cnVlKSxcbiAgICAgICAgICAnIH0nXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvLyBbYXBwZW5kRXNjYXBlZF1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogdmFsdWUsIC4uLlxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IC4uLlxuICAvL1xuICAvLyBFc2NhcGUgYHZhbHVlYCBhbmQgYXBwZW5kIGl0IHRvIHRoZSBidWZmZXJcbiAgYXBwZW5kRXNjYXBlZDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wdXNoU291cmNlKFxuICAgICAgdGhpcy5hcHBlbmRUb0J1ZmZlcihbXG4gICAgICAgIHRoaXMuYWxpYXNhYmxlKCdjb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbicpLFxuICAgICAgICAnKCcsXG4gICAgICAgIHRoaXMucG9wU3RhY2soKSxcbiAgICAgICAgJyknXG4gICAgICBdKVxuICAgICk7XG4gIH0sXG5cbiAgLy8gW2dldENvbnRleHRdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IC4uLlxuICAvLyBDb21waWxlciB2YWx1ZSwgYWZ0ZXI6IGxhc3RDb250ZXh0PWRlcHRoXG4gIC8vXG4gIC8vIFNldCB0aGUgdmFsdWUgb2YgdGhlIGBsYXN0Q29udGV4dGAgY29tcGlsZXIgdmFsdWUgdG8gdGhlIGRlcHRoXG4gIGdldENvbnRleHQ6IGZ1bmN0aW9uKGRlcHRoKSB7XG4gICAgdGhpcy5sYXN0Q29udGV4dCA9IGRlcHRoO1xuICB9LFxuXG4gIC8vIFtwdXNoQ29udGV4dF1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogY3VycmVudENvbnRleHQsIC4uLlxuICAvL1xuICAvLyBQdXNoZXMgdGhlIHZhbHVlIG9mIHRoZSBjdXJyZW50IGNvbnRleHQgb250byB0aGUgc3RhY2suXG4gIHB1c2hDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwodGhpcy5jb250ZXh0TmFtZSh0aGlzLmxhc3RDb250ZXh0KSk7XG4gIH0sXG5cbiAgLy8gW2xvb2t1cE9uQ29udGV4dF1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogY3VycmVudENvbnRleHRbbmFtZV0sIC4uLlxuICAvL1xuICAvLyBMb29rcyB1cCB0aGUgdmFsdWUgb2YgYG5hbWVgIG9uIHRoZSBjdXJyZW50IGNvbnRleHQgYW5kIHB1c2hlc1xuICAvLyBpdCBvbnRvIHRoZSBzdGFjay5cbiAgbG9va3VwT25Db250ZXh0OiBmdW5jdGlvbihwYXJ0cywgZmFsc3ksIHN0cmljdCwgc2NvcGVkKSB7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgaWYgKCFzY29wZWQgJiYgdGhpcy5vcHRpb25zLmNvbXBhdCAmJiAhdGhpcy5sYXN0Q29udGV4dCkge1xuICAgICAgLy8gVGhlIGRlcHRoZWQgcXVlcnkgaXMgZXhwZWN0ZWQgdG8gaGFuZGxlIHRoZSB1bmRlZmluZWQgbG9naWMgZm9yIHRoZSByb290IGxldmVsIHRoYXRcbiAgICAgIC8vIGlzIGltcGxlbWVudGVkIGJlbG93LCBzbyB3ZSBldmFsdWF0ZSB0aGF0IGRpcmVjdGx5IGluIGNvbXBhdCBtb2RlXG4gICAgICB0aGlzLnB1c2godGhpcy5kZXB0aGVkTG9va3VwKHBhcnRzW2krK10pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdXNoQ29udGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMucmVzb2x2ZVBhdGgoJ2NvbnRleHQnLCBwYXJ0cywgaSwgZmFsc3ksIHN0cmljdCk7XG4gIH0sXG5cbiAgLy8gW2xvb2t1cEJsb2NrUGFyYW1dXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IGJsb2NrUGFyYW1bbmFtZV0sIC4uLlxuICAvL1xuICAvLyBMb29rcyB1cCB0aGUgdmFsdWUgb2YgYHBhcnRzYCBvbiB0aGUgZ2l2ZW4gYmxvY2sgcGFyYW0gYW5kIHB1c2hlc1xuICAvLyBpdCBvbnRvIHRoZSBzdGFjay5cbiAgbG9va3VwQmxvY2tQYXJhbTogZnVuY3Rpb24oYmxvY2tQYXJhbUlkLCBwYXJ0cykge1xuICAgIHRoaXMudXNlQmxvY2tQYXJhbXMgPSB0cnVlO1xuXG4gICAgdGhpcy5wdXNoKFsnYmxvY2tQYXJhbXNbJywgYmxvY2tQYXJhbUlkWzBdLCAnXVsnLCBibG9ja1BhcmFtSWRbMV0sICddJ10pO1xuICAgIHRoaXMucmVzb2x2ZVBhdGgoJ2NvbnRleHQnLCBwYXJ0cywgMSk7XG4gIH0sXG5cbiAgLy8gW2xvb2t1cERhdGFdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IGRhdGEsIC4uLlxuICAvL1xuICAvLyBQdXNoIHRoZSBkYXRhIGxvb2t1cCBvcGVyYXRvclxuICBsb29rdXBEYXRhOiBmdW5jdGlvbihkZXB0aCwgcGFydHMsIHN0cmljdCkge1xuICAgIGlmICghZGVwdGgpIHtcbiAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgnZGF0YScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoJ2NvbnRhaW5lci5kYXRhKGRhdGEsICcgKyBkZXB0aCArICcpJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNvbHZlUGF0aCgnZGF0YScsIHBhcnRzLCAwLCB0cnVlLCBzdHJpY3QpO1xuICB9LFxuXG4gIHJlc29sdmVQYXRoOiBmdW5jdGlvbih0eXBlLCBwYXJ0cywgaSwgZmFsc3ksIHN0cmljdCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaWN0IHx8IHRoaXMub3B0aW9ucy5hc3N1bWVPYmplY3RzKSB7XG4gICAgICB0aGlzLnB1c2goc3RyaWN0TG9va3VwKHRoaXMub3B0aW9ucy5zdHJpY3QgJiYgc3RyaWN0LCB0aGlzLCBwYXJ0cywgdHlwZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBsZW4gPSBwYXJ0cy5sZW5ndGg7XG4gICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tbG9vcC1mdW5jICovXG4gICAgICB0aGlzLnJlcGxhY2VTdGFjayhjdXJyZW50ID0+IHtcbiAgICAgICAgbGV0IGxvb2t1cCA9IHRoaXMubmFtZUxvb2t1cChjdXJyZW50LCBwYXJ0c1tpXSwgdHlwZSk7XG4gICAgICAgIC8vIFdlIHdhbnQgdG8gZW5zdXJlIHRoYXQgemVybyBhbmQgZmFsc2UgYXJlIGhhbmRsZWQgcHJvcGVybHkgaWYgdGhlIGNvbnRleHQgKGZhbHN5IGZsYWcpXG4gICAgICAgIC8vIG5lZWRzIHRvIGhhdmUgdGhlIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRoZXNlIHZhbHVlcy5cbiAgICAgICAgaWYgKCFmYWxzeSkge1xuICAgICAgICAgIHJldHVybiBbJyAhPSBudWxsID8gJywgbG9va3VwLCAnIDogJywgY3VycmVudF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIGNhbiB1c2UgZ2VuZXJpYyBmYWxzeSBoYW5kbGluZ1xuICAgICAgICAgIHJldHVybiBbJyAmJiAnLCBsb29rdXBdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tbG9vcC1mdW5jICovXG4gICAgfVxuICB9LFxuXG4gIC8vIFtyZXNvbHZlUG9zc2libGVMYW1iZGFdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IHZhbHVlLCAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXNvbHZlZCB2YWx1ZSwgLi4uXG4gIC8vXG4gIC8vIElmIHRoZSBgdmFsdWVgIGlzIGEgbGFtYmRhLCByZXBsYWNlIGl0IG9uIHRoZSBzdGFjayBieVxuICAvLyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBsYW1iZGFcbiAgcmVzb2x2ZVBvc3NpYmxlTGFtYmRhOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnB1c2goW1xuICAgICAgdGhpcy5hbGlhc2FibGUoJ2NvbnRhaW5lci5sYW1iZGEnKSxcbiAgICAgICcoJyxcbiAgICAgIHRoaXMucG9wU3RhY2soKSxcbiAgICAgICcsICcsXG4gICAgICB0aGlzLmNvbnRleHROYW1lKDApLFxuICAgICAgJyknXG4gICAgXSk7XG4gIH0sXG5cbiAgLy8gW3B1c2hTdHJpbmdQYXJhbV1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogc3RyaW5nLCBjdXJyZW50Q29udGV4dCwgLi4uXG4gIC8vXG4gIC8vIFRoaXMgb3Bjb2RlIGlzIGRlc2lnbmVkIGZvciB1c2UgaW4gc3RyaW5nIG1vZGUsIHdoaWNoXG4gIC8vIHByb3ZpZGVzIHRoZSBzdHJpbmcgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgYWxvbmcgd2l0aCBpdHNcbiAgLy8gZGVwdGggcmF0aGVyIHRoYW4gcmVzb2x2aW5nIGl0IGltbWVkaWF0ZWx5LlxuICBwdXNoU3RyaW5nUGFyYW06IGZ1bmN0aW9uKHN0cmluZywgdHlwZSkge1xuICAgIHRoaXMucHVzaENvbnRleHQoKTtcbiAgICB0aGlzLnB1c2hTdHJpbmcodHlwZSk7XG5cbiAgICAvLyBJZiBpdCdzIGEgc3ViZXhwcmVzc2lvbiwgdGhlIHN0cmluZyByZXN1bHRcbiAgICAvLyB3aWxsIGJlIHB1c2hlZCBhZnRlciB0aGlzIG9wY29kZS5cbiAgICBpZiAodHlwZSAhPT0gJ1N1YkV4cHJlc3Npb24nKSB7XG4gICAgICBpZiAodHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5wdXNoU3RyaW5nKHN0cmluZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoc3RyaW5nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZW1wdHlIYXNoOiBmdW5jdGlvbihvbWl0RW1wdHkpIHtcbiAgICBpZiAodGhpcy50cmFja0lkcykge1xuICAgICAgdGhpcy5wdXNoKCd7fScpOyAvLyBoYXNoSWRzXG4gICAgfVxuICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuICAgICAgdGhpcy5wdXNoKCd7fScpOyAvLyBoYXNoQ29udGV4dHNcbiAgICAgIHRoaXMucHVzaCgne30nKTsgLy8gaGFzaFR5cGVzXG4gICAgfVxuICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbChvbWl0RW1wdHkgPyAndW5kZWZpbmVkJyA6ICd7fScpO1xuICB9LFxuICBwdXNoSGFzaDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaGFzaCkge1xuICAgICAgdGhpcy5oYXNoZXMucHVzaCh0aGlzLmhhc2gpO1xuICAgIH1cbiAgICB0aGlzLmhhc2ggPSB7IHZhbHVlczoge30sIHR5cGVzOiBbXSwgY29udGV4dHM6IFtdLCBpZHM6IFtdIH07XG4gIH0sXG4gIHBvcEhhc2g6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBoYXNoID0gdGhpcy5oYXNoO1xuICAgIHRoaXMuaGFzaCA9IHRoaXMuaGFzaGVzLnBvcCgpO1xuXG4gICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcbiAgICAgIHRoaXMucHVzaCh0aGlzLm9iamVjdExpdGVyYWwoaGFzaC5pZHMpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG4gICAgICB0aGlzLnB1c2godGhpcy5vYmplY3RMaXRlcmFsKGhhc2guY29udGV4dHMpKTtcbiAgICAgIHRoaXMucHVzaCh0aGlzLm9iamVjdExpdGVyYWwoaGFzaC50eXBlcykpO1xuICAgIH1cblxuICAgIHRoaXMucHVzaCh0aGlzLm9iamVjdExpdGVyYWwoaGFzaC52YWx1ZXMpKTtcbiAgfSxcblxuICAvLyBbcHVzaFN0cmluZ11cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogcXVvdGVkU3RyaW5nKHN0cmluZyksIC4uLlxuICAvL1xuICAvLyBQdXNoIGEgcXVvdGVkIHZlcnNpb24gb2YgYHN0cmluZ2Agb250byB0aGUgc3RhY2tcbiAgcHVzaFN0cmluZzogZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKHRoaXMucXVvdGVkU3RyaW5nKHN0cmluZykpO1xuICB9LFxuXG4gIC8vIFtwdXNoTGl0ZXJhbF1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogdmFsdWUsIC4uLlxuICAvL1xuICAvLyBQdXNoZXMgYSB2YWx1ZSBvbnRvIHRoZSBzdGFjay4gVGhpcyBvcGVyYXRpb24gcHJldmVudHNcbiAgLy8gdGhlIGNvbXBpbGVyIGZyb20gY3JlYXRpbmcgYSB0ZW1wb3JhcnkgdmFyaWFibGUgdG8gaG9sZFxuICAvLyBpdC5cbiAgcHVzaExpdGVyYWw6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKHZhbHVlKTtcbiAgfSxcblxuICAvLyBbcHVzaFByb2dyYW1dXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHByb2dyYW0oZ3VpZCksIC4uLlxuICAvL1xuICAvLyBQdXNoIGEgcHJvZ3JhbSBleHByZXNzaW9uIG9udG8gdGhlIHN0YWNrLiBUaGlzIHRha2VzXG4gIC8vIGEgY29tcGlsZS10aW1lIGd1aWQgYW5kIGNvbnZlcnRzIGl0IGludG8gYSBydW50aW1lLWFjY2Vzc2libGVcbiAgLy8gZXhwcmVzc2lvbi5cbiAgcHVzaFByb2dyYW06IGZ1bmN0aW9uKGd1aWQpIHtcbiAgICBpZiAoZ3VpZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwodGhpcy5wcm9ncmFtRXhwcmVzc2lvbihndWlkKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbChudWxsKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gW3JlZ2lzdGVyRGVjb3JhdG9yXVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBwcm9ncmFtLCBwYXJhbXMuLi4sIC4uLlxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IC4uLlxuICAvL1xuICAvLyBQb3BzIG9mZiB0aGUgZGVjb3JhdG9yJ3MgcGFyYW1ldGVycywgaW52b2tlcyB0aGUgZGVjb3JhdG9yLFxuICAvLyBhbmQgaW5zZXJ0cyB0aGUgZGVjb3JhdG9yIGludG8gdGhlIGRlY29yYXRvcnMgbGlzdC5cbiAgcmVnaXN0ZXJEZWNvcmF0b3IocGFyYW1TaXplLCBuYW1lKSB7XG4gICAgbGV0IGZvdW5kRGVjb3JhdG9yID0gdGhpcy5uYW1lTG9va3VwKCdkZWNvcmF0b3JzJywgbmFtZSwgJ2RlY29yYXRvcicpLFxuICAgICAgb3B0aW9ucyA9IHRoaXMuc2V0dXBIZWxwZXJBcmdzKG5hbWUsIHBhcmFtU2l6ZSk7XG5cbiAgICB0aGlzLmRlY29yYXRvcnMucHVzaChbXG4gICAgICAnZm4gPSAnLFxuICAgICAgdGhpcy5kZWNvcmF0b3JzLmZ1bmN0aW9uQ2FsbChmb3VuZERlY29yYXRvciwgJycsIFtcbiAgICAgICAgJ2ZuJyxcbiAgICAgICAgJ3Byb3BzJyxcbiAgICAgICAgJ2NvbnRhaW5lcicsXG4gICAgICAgIG9wdGlvbnNcbiAgICAgIF0pLFxuICAgICAgJyB8fCBmbjsnXG4gICAgXSk7XG4gIH0sXG5cbiAgLy8gW2ludm9rZUhlbHBlcl1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgaW52ZXJzZSwgcHJvZ3JhbSwgcGFyYW1zLi4uLCAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXN1bHQgb2YgaGVscGVyIGludm9jYXRpb25cbiAgLy9cbiAgLy8gUG9wcyBvZmYgdGhlIGhlbHBlcidzIHBhcmFtZXRlcnMsIGludm9rZXMgdGhlIGhlbHBlcixcbiAgLy8gYW5kIHB1c2hlcyB0aGUgaGVscGVyJ3MgcmV0dXJuIHZhbHVlIG9udG8gdGhlIHN0YWNrLlxuICAvL1xuICAvLyBJZiB0aGUgaGVscGVyIGlzIG5vdCBmb3VuZCwgYGhlbHBlck1pc3NpbmdgIGlzIGNhbGxlZC5cbiAgaW52b2tlSGVscGVyOiBmdW5jdGlvbihwYXJhbVNpemUsIG5hbWUsIGlzU2ltcGxlKSB7XG4gICAgbGV0IG5vbkhlbHBlciA9IHRoaXMucG9wU3RhY2soKSxcbiAgICAgIGhlbHBlciA9IHRoaXMuc2V0dXBIZWxwZXIocGFyYW1TaXplLCBuYW1lKTtcblxuICAgIGxldCBwb3NzaWJsZUZ1bmN0aW9uQ2FsbHMgPSBbXTtcblxuICAgIGlmIChpc1NpbXBsZSkge1xuICAgICAgLy8gZGlyZWN0IGNhbGwgdG8gaGVscGVyXG4gICAgICBwb3NzaWJsZUZ1bmN0aW9uQ2FsbHMucHVzaChoZWxwZXIubmFtZSk7XG4gICAgfVxuICAgIC8vIGNhbGwgYSBmdW5jdGlvbiBmcm9tIHRoZSBpbnB1dCBvYmplY3RcbiAgICBwb3NzaWJsZUZ1bmN0aW9uQ2FsbHMucHVzaChub25IZWxwZXIpO1xuICAgIGlmICghdGhpcy5vcHRpb25zLnN0cmljdCkge1xuICAgICAgcG9zc2libGVGdW5jdGlvbkNhbGxzLnB1c2goXG4gICAgICAgIHRoaXMuYWxpYXNhYmxlKCdjb250YWluZXIuaG9va3MuaGVscGVyTWlzc2luZycpXG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCBmdW5jdGlvbkxvb2t1cENvZGUgPSBbXG4gICAgICAnKCcsXG4gICAgICB0aGlzLml0ZW1zU2VwYXJhdGVkQnkocG9zc2libGVGdW5jdGlvbkNhbGxzLCAnfHwnKSxcbiAgICAgICcpJ1xuICAgIF07XG4gICAgbGV0IGZ1bmN0aW9uQ2FsbCA9IHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbChcbiAgICAgIGZ1bmN0aW9uTG9va3VwQ29kZSxcbiAgICAgICdjYWxsJyxcbiAgICAgIGhlbHBlci5jYWxsUGFyYW1zXG4gICAgKTtcbiAgICB0aGlzLnB1c2goZnVuY3Rpb25DYWxsKTtcbiAgfSxcblxuICBpdGVtc1NlcGFyYXRlZEJ5OiBmdW5jdGlvbihpdGVtcywgc2VwYXJhdG9yKSB7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIHJlc3VsdC5wdXNoKGl0ZW1zWzBdKTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHQucHVzaChzZXBhcmF0b3IsIGl0ZW1zW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgLy8gW2ludm9rZUtub3duSGVscGVyXVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBpbnZlcnNlLCBwcm9ncmFtLCBwYXJhbXMuLi4sIC4uLlxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHJlc3VsdCBvZiBoZWxwZXIgaW52b2NhdGlvblxuICAvL1xuICAvLyBUaGlzIG9wZXJhdGlvbiBpcyB1c2VkIHdoZW4gdGhlIGhlbHBlciBpcyBrbm93biB0byBleGlzdCxcbiAgLy8gc28gYSBgaGVscGVyTWlzc2luZ2AgZmFsbGJhY2sgaXMgbm90IHJlcXVpcmVkLlxuICBpbnZva2VLbm93bkhlbHBlcjogZnVuY3Rpb24ocGFyYW1TaXplLCBuYW1lKSB7XG4gICAgbGV0IGhlbHBlciA9IHRoaXMuc2V0dXBIZWxwZXIocGFyYW1TaXplLCBuYW1lKTtcbiAgICB0aGlzLnB1c2godGhpcy5zb3VyY2UuZnVuY3Rpb25DYWxsKGhlbHBlci5uYW1lLCAnY2FsbCcsIGhlbHBlci5jYWxsUGFyYW1zKSk7XG4gIH0sXG5cbiAgLy8gW2ludm9rZUFtYmlndW91c11cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgaW52ZXJzZSwgcHJvZ3JhbSwgcGFyYW1zLi4uLCAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXN1bHQgb2YgZGlzYW1iaWd1YXRpb25cbiAgLy9cbiAgLy8gVGhpcyBvcGVyYXRpb24gaXMgdXNlZCB3aGVuIGFuIGV4cHJlc3Npb24gbGlrZSBge3tmb299fWBcbiAgLy8gaXMgcHJvdmlkZWQsIGJ1dCB3ZSBkb24ndCBrbm93IGF0IGNvbXBpbGUtdGltZSB3aGV0aGVyIGl0XG4gIC8vIGlzIGEgaGVscGVyIG9yIGEgcGF0aC5cbiAgLy9cbiAgLy8gVGhpcyBvcGVyYXRpb24gZW1pdHMgbW9yZSBjb2RlIHRoYW4gdGhlIG90aGVyIG9wdGlvbnMsXG4gIC8vIGFuZCBjYW4gYmUgYXZvaWRlZCBieSBwYXNzaW5nIHRoZSBga25vd25IZWxwZXJzYCBhbmRcbiAgLy8gYGtub3duSGVscGVyc09ubHlgIGZsYWdzIGF0IGNvbXBpbGUtdGltZS5cbiAgaW52b2tlQW1iaWd1b3VzOiBmdW5jdGlvbihuYW1lLCBoZWxwZXJDYWxsKSB7XG4gICAgdGhpcy51c2VSZWdpc3RlcignaGVscGVyJyk7XG5cbiAgICBsZXQgbm9uSGVscGVyID0gdGhpcy5wb3BTdGFjaygpO1xuXG4gICAgdGhpcy5lbXB0eUhhc2goKTtcbiAgICBsZXQgaGVscGVyID0gdGhpcy5zZXR1cEhlbHBlcigwLCBuYW1lLCBoZWxwZXJDYWxsKTtcblxuICAgIGxldCBoZWxwZXJOYW1lID0gKHRoaXMubGFzdEhlbHBlciA9IHRoaXMubmFtZUxvb2t1cChcbiAgICAgICdoZWxwZXJzJyxcbiAgICAgIG5hbWUsXG4gICAgICAnaGVscGVyJ1xuICAgICkpO1xuXG4gICAgbGV0IGxvb2t1cCA9IFsnKCcsICcoaGVscGVyID0gJywgaGVscGVyTmFtZSwgJyB8fCAnLCBub25IZWxwZXIsICcpJ107XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICBsb29rdXBbMF0gPSAnKGhlbHBlciA9ICc7XG4gICAgICBsb29rdXAucHVzaChcbiAgICAgICAgJyAhPSBudWxsID8gaGVscGVyIDogJyxcbiAgICAgICAgdGhpcy5hbGlhc2FibGUoJ2NvbnRhaW5lci5ob29rcy5oZWxwZXJNaXNzaW5nJylcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5wdXNoKFtcbiAgICAgICcoJyxcbiAgICAgIGxvb2t1cCxcbiAgICAgIGhlbHBlci5wYXJhbXNJbml0ID8gWycpLCgnLCBoZWxwZXIucGFyYW1zSW5pdF0gOiBbXSxcbiAgICAgICcpLCcsXG4gICAgICAnKHR5cGVvZiBoZWxwZXIgPT09ICcsXG4gICAgICB0aGlzLmFsaWFzYWJsZSgnXCJmdW5jdGlvblwiJyksXG4gICAgICAnID8gJyxcbiAgICAgIHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbCgnaGVscGVyJywgJ2NhbGwnLCBoZWxwZXIuY2FsbFBhcmFtcyksXG4gICAgICAnIDogaGVscGVyKSknXG4gICAgXSk7XG4gIH0sXG5cbiAgLy8gW2ludm9rZVBhcnRpYWxdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGNvbnRleHQsIC4uLlxuICAvLyBPbiBzdGFjayBhZnRlcjogcmVzdWx0IG9mIHBhcnRpYWwgaW52b2NhdGlvblxuICAvL1xuICAvLyBUaGlzIG9wZXJhdGlvbiBwb3BzIG9mZiBhIGNvbnRleHQsIGludm9rZXMgYSBwYXJ0aWFsIHdpdGggdGhhdCBjb250ZXh0LFxuICAvLyBhbmQgcHVzaGVzIHRoZSByZXN1bHQgb2YgdGhlIGludm9jYXRpb24gYmFjay5cbiAgaW52b2tlUGFydGlhbDogZnVuY3Rpb24oaXNEeW5hbWljLCBuYW1lLCBpbmRlbnQpIHtcbiAgICBsZXQgcGFyYW1zID0gW10sXG4gICAgICBvcHRpb25zID0gdGhpcy5zZXR1cFBhcmFtcyhuYW1lLCAxLCBwYXJhbXMpO1xuXG4gICAgaWYgKGlzRHluYW1pYykge1xuICAgICAgbmFtZSA9IHRoaXMucG9wU3RhY2soKTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zLm5hbWU7XG4gICAgfVxuXG4gICAgaWYgKGluZGVudCkge1xuICAgICAgb3B0aW9ucy5pbmRlbnQgPSBKU09OLnN0cmluZ2lmeShpbmRlbnQpO1xuICAgIH1cbiAgICBvcHRpb25zLmhlbHBlcnMgPSAnaGVscGVycyc7XG4gICAgb3B0aW9ucy5wYXJ0aWFscyA9ICdwYXJ0aWFscyc7XG4gICAgb3B0aW9ucy5kZWNvcmF0b3JzID0gJ2NvbnRhaW5lci5kZWNvcmF0b3JzJztcblxuICAgIGlmICghaXNEeW5hbWljKSB7XG4gICAgICBwYXJhbXMudW5zaGlmdCh0aGlzLm5hbWVMb29rdXAoJ3BhcnRpYWxzJywgbmFtZSwgJ3BhcnRpYWwnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtcy51bnNoaWZ0KG5hbWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGF0KSB7XG4gICAgICBvcHRpb25zLmRlcHRocyA9ICdkZXB0aHMnO1xuICAgIH1cbiAgICBvcHRpb25zID0gdGhpcy5vYmplY3RMaXRlcmFsKG9wdGlvbnMpO1xuICAgIHBhcmFtcy5wdXNoKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5wdXNoKHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbCgnY29udGFpbmVyLmludm9rZVBhcnRpYWwnLCAnJywgcGFyYW1zKSk7XG4gIH0sXG5cbiAgLy8gW2Fzc2lnblRvSGFzaF1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogdmFsdWUsIC4uLiwgaGFzaCwgLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uLCBoYXNoLCAuLi5cbiAgLy9cbiAgLy8gUG9wcyBhIHZhbHVlIG9mZiB0aGUgc3RhY2sgYW5kIGFzc2lnbnMgaXQgdG8gdGhlIGN1cnJlbnQgaGFzaFxuICBhc3NpZ25Ub0hhc2g6IGZ1bmN0aW9uKGtleSkge1xuICAgIGxldCB2YWx1ZSA9IHRoaXMucG9wU3RhY2soKSxcbiAgICAgIGNvbnRleHQsXG4gICAgICB0eXBlLFxuICAgICAgaWQ7XG5cbiAgICBpZiAodGhpcy50cmFja0lkcykge1xuICAgICAgaWQgPSB0aGlzLnBvcFN0YWNrKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuICAgICAgdHlwZSA9IHRoaXMucG9wU3RhY2soKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzLnBvcFN0YWNrKCk7XG4gICAgfVxuXG4gICAgbGV0IGhhc2ggPSB0aGlzLmhhc2g7XG4gICAgaWYgKGNvbnRleHQpIHtcbiAgICAgIGhhc2guY29udGV4dHNba2V5XSA9IGNvbnRleHQ7XG4gICAgfVxuICAgIGlmICh0eXBlKSB7XG4gICAgICBoYXNoLnR5cGVzW2tleV0gPSB0eXBlO1xuICAgIH1cbiAgICBpZiAoaWQpIHtcbiAgICAgIGhhc2guaWRzW2tleV0gPSBpZDtcbiAgICB9XG4gICAgaGFzaC52YWx1ZXNba2V5XSA9IHZhbHVlO1xuICB9LFxuXG4gIHB1c2hJZDogZnVuY3Rpb24odHlwZSwgbmFtZSwgY2hpbGQpIHtcbiAgICBpZiAodHlwZSA9PT0gJ0Jsb2NrUGFyYW0nKSB7XG4gICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoXG4gICAgICAgICdibG9ja1BhcmFtc1snICtcbiAgICAgICAgICBuYW1lWzBdICtcbiAgICAgICAgICAnXS5wYXRoWycgK1xuICAgICAgICAgIG5hbWVbMV0gK1xuICAgICAgICAgICddJyArXG4gICAgICAgICAgKGNoaWxkID8gJyArICcgKyBKU09OLnN0cmluZ2lmeSgnLicgKyBjaGlsZCkgOiAnJylcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnUGF0aEV4cHJlc3Npb24nKSB7XG4gICAgICB0aGlzLnB1c2hTdHJpbmcobmFtZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnU3ViRXhwcmVzc2lvbicpIHtcbiAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgndHJ1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoJ251bGwnKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gSEVMUEVSU1xuXG4gIGNvbXBpbGVyOiBKYXZhU2NyaXB0Q29tcGlsZXIsXG5cbiAgY29tcGlsZUNoaWxkcmVuOiBmdW5jdGlvbihlbnZpcm9ubWVudCwgb3B0aW9ucykge1xuICAgIGxldCBjaGlsZHJlbiA9IGVudmlyb25tZW50LmNoaWxkcmVuLFxuICAgICAgY2hpbGQsXG4gICAgICBjb21waWxlcjtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgY29tcGlsZXIgPSBuZXcgdGhpcy5jb21waWxlcigpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5ldy1jYXBcblxuICAgICAgbGV0IGV4aXN0aW5nID0gdGhpcy5tYXRjaEV4aXN0aW5nUHJvZ3JhbShjaGlsZCk7XG5cbiAgICAgIGlmIChleGlzdGluZyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5wcm9ncmFtcy5wdXNoKCcnKTsgLy8gUGxhY2Vob2xkZXIgdG8gcHJldmVudCBuYW1lIGNvbmZsaWN0cyBmb3IgbmVzdGVkIGNoaWxkcmVuXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuY29udGV4dC5wcm9ncmFtcy5sZW5ndGg7XG4gICAgICAgIGNoaWxkLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGNoaWxkLm5hbWUgPSAncHJvZ3JhbScgKyBpbmRleDtcbiAgICAgICAgdGhpcy5jb250ZXh0LnByb2dyYW1zW2luZGV4XSA9IGNvbXBpbGVyLmNvbXBpbGUoXG4gICAgICAgICAgY2hpbGQsXG4gICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICB0aGlzLmNvbnRleHQsXG4gICAgICAgICAgIXRoaXMucHJlY29tcGlsZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmNvbnRleHQuZGVjb3JhdG9yc1tpbmRleF0gPSBjb21waWxlci5kZWNvcmF0b3JzO1xuICAgICAgICB0aGlzLmNvbnRleHQuZW52aXJvbm1lbnRzW2luZGV4XSA9IGNoaWxkO1xuXG4gICAgICAgIHRoaXMudXNlRGVwdGhzID0gdGhpcy51c2VEZXB0aHMgfHwgY29tcGlsZXIudXNlRGVwdGhzO1xuICAgICAgICB0aGlzLnVzZUJsb2NrUGFyYW1zID0gdGhpcy51c2VCbG9ja1BhcmFtcyB8fCBjb21waWxlci51c2VCbG9ja1BhcmFtcztcbiAgICAgICAgY2hpbGQudXNlRGVwdGhzID0gdGhpcy51c2VEZXB0aHM7XG4gICAgICAgIGNoaWxkLnVzZUJsb2NrUGFyYW1zID0gdGhpcy51c2VCbG9ja1BhcmFtcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkLmluZGV4ID0gZXhpc3RpbmcuaW5kZXg7XG4gICAgICAgIGNoaWxkLm5hbWUgPSAncHJvZ3JhbScgKyBleGlzdGluZy5pbmRleDtcblxuICAgICAgICB0aGlzLnVzZURlcHRocyA9IHRoaXMudXNlRGVwdGhzIHx8IGV4aXN0aW5nLnVzZURlcHRocztcbiAgICAgICAgdGhpcy51c2VCbG9ja1BhcmFtcyA9IHRoaXMudXNlQmxvY2tQYXJhbXMgfHwgZXhpc3RpbmcudXNlQmxvY2tQYXJhbXM7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtYXRjaEV4aXN0aW5nUHJvZ3JhbTogZnVuY3Rpb24oY2hpbGQpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5jb250ZXh0LmVudmlyb25tZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IGVudmlyb25tZW50ID0gdGhpcy5jb250ZXh0LmVudmlyb25tZW50c1tpXTtcbiAgICAgIGlmIChlbnZpcm9ubWVudCAmJiBlbnZpcm9ubWVudC5lcXVhbHMoY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiBlbnZpcm9ubWVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcHJvZ3JhbUV4cHJlc3Npb246IGZ1bmN0aW9uKGd1aWQpIHtcbiAgICBsZXQgY2hpbGQgPSB0aGlzLmVudmlyb25tZW50LmNoaWxkcmVuW2d1aWRdLFxuICAgICAgcHJvZ3JhbVBhcmFtcyA9IFtjaGlsZC5pbmRleCwgJ2RhdGEnLCBjaGlsZC5ibG9ja1BhcmFtc107XG5cbiAgICBpZiAodGhpcy51c2VCbG9ja1BhcmFtcyB8fCB0aGlzLnVzZURlcHRocykge1xuICAgICAgcHJvZ3JhbVBhcmFtcy5wdXNoKCdibG9ja1BhcmFtcycpO1xuICAgIH1cbiAgICBpZiAodGhpcy51c2VEZXB0aHMpIHtcbiAgICAgIHByb2dyYW1QYXJhbXMucHVzaCgnZGVwdGhzJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuICdjb250YWluZXIucHJvZ3JhbSgnICsgcHJvZ3JhbVBhcmFtcy5qb2luKCcsICcpICsgJyknO1xuICB9LFxuXG4gIHVzZVJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKCF0aGlzLnJlZ2lzdGVyc1tuYW1lXSkge1xuICAgICAgdGhpcy5yZWdpc3RlcnNbbmFtZV0gPSB0cnVlO1xuICAgICAgdGhpcy5yZWdpc3RlcnMubGlzdC5wdXNoKG5hbWUpO1xuICAgIH1cbiAgfSxcblxuICBwdXNoOiBmdW5jdGlvbihleHByKSB7XG4gICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIExpdGVyYWwpKSB7XG4gICAgICBleHByID0gdGhpcy5zb3VyY2Uud3JhcChleHByKTtcbiAgICB9XG5cbiAgICB0aGlzLmlubGluZVN0YWNrLnB1c2goZXhwcik7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH0sXG5cbiAgcHVzaFN0YWNrTGl0ZXJhbDogZnVuY3Rpb24oaXRlbSkge1xuICAgIHRoaXMucHVzaChuZXcgTGl0ZXJhbChpdGVtKSk7XG4gIH0sXG5cbiAgcHVzaFNvdXJjZTogZnVuY3Rpb24oc291cmNlKSB7XG4gICAgaWYgKHRoaXMucGVuZGluZ0NvbnRlbnQpIHtcbiAgICAgIHRoaXMuc291cmNlLnB1c2goXG4gICAgICAgIHRoaXMuYXBwZW5kVG9CdWZmZXIoXG4gICAgICAgICAgdGhpcy5zb3VyY2UucXVvdGVkU3RyaW5nKHRoaXMucGVuZGluZ0NvbnRlbnQpLFxuICAgICAgICAgIHRoaXMucGVuZGluZ0xvY2F0aW9uXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICB0aGlzLnBlbmRpbmdDb250ZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIHRoaXMuc291cmNlLnB1c2goc291cmNlKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVwbGFjZVN0YWNrOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGxldCBwcmVmaXggPSBbJygnXSxcbiAgICAgIHN0YWNrLFxuICAgICAgY3JlYXRlZFN0YWNrLFxuICAgICAgdXNlZExpdGVyYWw7XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICghdGhpcy5pc0lubGluZSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdyZXBsYWNlU3RhY2sgb24gbm9uLWlubGluZScpO1xuICAgIH1cblxuICAgIC8vIFdlIHdhbnQgdG8gbWVyZ2UgdGhlIGlubGluZSBzdGF0ZW1lbnQgaW50byB0aGUgcmVwbGFjZW1lbnQgc3RhdGVtZW50IHZpYSAnLCdcbiAgICBsZXQgdG9wID0gdGhpcy5wb3BTdGFjayh0cnVlKTtcblxuICAgIGlmICh0b3AgaW5zdGFuY2VvZiBMaXRlcmFsKSB7XG4gICAgICAvLyBMaXRlcmFscyBkbyBub3QgbmVlZCB0byBiZSBpbmxpbmVkXG4gICAgICBzdGFjayA9IFt0b3AudmFsdWVdO1xuICAgICAgcHJlZml4ID0gWycoJywgc3RhY2tdO1xuICAgICAgdXNlZExpdGVyYWwgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBHZXQgb3IgY3JlYXRlIHRoZSBjdXJyZW50IHN0YWNrIG5hbWUgZm9yIHVzZSBieSB0aGUgaW5saW5lXG4gICAgICBjcmVhdGVkU3RhY2sgPSB0cnVlO1xuICAgICAgbGV0IG5hbWUgPSB0aGlzLmluY3JTdGFjaygpO1xuXG4gICAgICBwcmVmaXggPSBbJygoJywgdGhpcy5wdXNoKG5hbWUpLCAnID0gJywgdG9wLCAnKSddO1xuICAgICAgc3RhY2sgPSB0aGlzLnRvcFN0YWNrKCk7XG4gICAgfVxuXG4gICAgbGV0IGl0ZW0gPSBjYWxsYmFjay5jYWxsKHRoaXMsIHN0YWNrKTtcblxuICAgIGlmICghdXNlZExpdGVyYWwpIHtcbiAgICAgIHRoaXMucG9wU3RhY2soKTtcbiAgICB9XG4gICAgaWYgKGNyZWF0ZWRTdGFjaykge1xuICAgICAgdGhpcy5zdGFja1Nsb3QtLTtcbiAgICB9XG4gICAgdGhpcy5wdXNoKHByZWZpeC5jb25jYXQoaXRlbSwgJyknKSk7XG4gIH0sXG5cbiAgaW5jclN0YWNrOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YWNrU2xvdCsrO1xuICAgIGlmICh0aGlzLnN0YWNrU2xvdCA+IHRoaXMuc3RhY2tWYXJzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdGFja1ZhcnMucHVzaCgnc3RhY2snICsgdGhpcy5zdGFja1Nsb3QpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50b3BTdGFja05hbWUoKTtcbiAgfSxcbiAgdG9wU3RhY2tOYW1lOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ3N0YWNrJyArIHRoaXMuc3RhY2tTbG90O1xuICB9LFxuICBmbHVzaElubGluZTogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGlubGluZVN0YWNrID0gdGhpcy5pbmxpbmVTdGFjaztcbiAgICB0aGlzLmlubGluZVN0YWNrID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGlubGluZVN0YWNrLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgZW50cnkgPSBpbmxpbmVTdGFja1tpXTtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGVudHJ5IGluc3RhbmNlb2YgTGl0ZXJhbCkge1xuICAgICAgICB0aGlzLmNvbXBpbGVTdGFjay5wdXNoKGVudHJ5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBzdGFjayA9IHRoaXMuaW5jclN0YWNrKCk7XG4gICAgICAgIHRoaXMucHVzaFNvdXJjZShbc3RhY2ssICcgPSAnLCBlbnRyeSwgJzsnXSk7XG4gICAgICAgIHRoaXMuY29tcGlsZVN0YWNrLnB1c2goc3RhY2spO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgaXNJbmxpbmU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlubGluZVN0YWNrLmxlbmd0aDtcbiAgfSxcblxuICBwb3BTdGFjazogZnVuY3Rpb24od3JhcHBlZCkge1xuICAgIGxldCBpbmxpbmUgPSB0aGlzLmlzSW5saW5lKCksXG4gICAgICBpdGVtID0gKGlubGluZSA/IHRoaXMuaW5saW5lU3RhY2sgOiB0aGlzLmNvbXBpbGVTdGFjaykucG9wKCk7XG5cbiAgICBpZiAoIXdyYXBwZWQgJiYgaXRlbSBpbnN0YW5jZW9mIExpdGVyYWwpIHtcbiAgICAgIHJldHVybiBpdGVtLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWlubGluZSkge1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBpZiAoIXRoaXMuc3RhY2tTbG90KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignSW52YWxpZCBzdGFjayBwb3AnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YWNrU2xvdC0tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9LFxuXG4gIHRvcFN0YWNrOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgc3RhY2sgPSB0aGlzLmlzSW5saW5lKCkgPyB0aGlzLmlubGluZVN0YWNrIDogdGhpcy5jb21waWxlU3RhY2ssXG4gICAgICBpdGVtID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIExpdGVyYWwpIHtcbiAgICAgIHJldHVybiBpdGVtLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gIH0sXG5cbiAgY29udGV4dE5hbWU6IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICBpZiAodGhpcy51c2VEZXB0aHMgJiYgY29udGV4dCkge1xuICAgICAgcmV0dXJuICdkZXB0aHNbJyArIGNvbnRleHQgKyAnXSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnZGVwdGgnICsgY29udGV4dDtcbiAgICB9XG4gIH0sXG5cbiAgcXVvdGVkU3RyaW5nOiBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2UucXVvdGVkU3RyaW5nKHN0cik7XG4gIH0sXG5cbiAgb2JqZWN0TGl0ZXJhbDogZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLm9iamVjdExpdGVyYWwob2JqKTtcbiAgfSxcblxuICBhbGlhc2FibGU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBsZXQgcmV0ID0gdGhpcy5hbGlhc2VzW25hbWVdO1xuICAgIGlmIChyZXQpIHtcbiAgICAgIHJldC5yZWZlcmVuY2VDb3VudCsrO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICByZXQgPSB0aGlzLmFsaWFzZXNbbmFtZV0gPSB0aGlzLnNvdXJjZS53cmFwKG5hbWUpO1xuICAgIHJldC5hbGlhc2FibGUgPSB0cnVlO1xuICAgIHJldC5yZWZlcmVuY2VDb3VudCA9IDE7XG5cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIHNldHVwSGVscGVyOiBmdW5jdGlvbihwYXJhbVNpemUsIG5hbWUsIGJsb2NrSGVscGVyKSB7XG4gICAgbGV0IHBhcmFtcyA9IFtdLFxuICAgICAgcGFyYW1zSW5pdCA9IHRoaXMuc2V0dXBIZWxwZXJBcmdzKG5hbWUsIHBhcmFtU2l6ZSwgcGFyYW1zLCBibG9ja0hlbHBlcik7XG4gICAgbGV0IGZvdW5kSGVscGVyID0gdGhpcy5uYW1lTG9va3VwKCdoZWxwZXJzJywgbmFtZSwgJ2hlbHBlcicpLFxuICAgICAgY2FsbENvbnRleHQgPSB0aGlzLmFsaWFzYWJsZShcbiAgICAgICAgYCR7dGhpcy5jb250ZXh0TmFtZSgwKX0gIT0gbnVsbCA/ICR7dGhpcy5jb250ZXh0TmFtZShcbiAgICAgICAgICAwXG4gICAgICAgICl9IDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSlgXG4gICAgICApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgcGFyYW1zSW5pdDogcGFyYW1zSW5pdCxcbiAgICAgIG5hbWU6IGZvdW5kSGVscGVyLFxuICAgICAgY2FsbFBhcmFtczogW2NhbGxDb250ZXh0XS5jb25jYXQocGFyYW1zKVxuICAgIH07XG4gIH0sXG5cbiAgc2V0dXBQYXJhbXM6IGZ1bmN0aW9uKGhlbHBlciwgcGFyYW1TaXplLCBwYXJhbXMpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHt9LFxuICAgICAgY29udGV4dHMgPSBbXSxcbiAgICAgIHR5cGVzID0gW10sXG4gICAgICBpZHMgPSBbXSxcbiAgICAgIG9iamVjdEFyZ3MgPSAhcGFyYW1zLFxuICAgICAgcGFyYW07XG5cbiAgICBpZiAob2JqZWN0QXJncykge1xuICAgICAgcGFyYW1zID0gW107XG4gICAgfVxuXG4gICAgb3B0aW9ucy5uYW1lID0gdGhpcy5xdW90ZWRTdHJpbmcoaGVscGVyKTtcbiAgICBvcHRpb25zLmhhc2ggPSB0aGlzLnBvcFN0YWNrKCk7XG5cbiAgICBpZiAodGhpcy50cmFja0lkcykge1xuICAgICAgb3B0aW9ucy5oYXNoSWRzID0gdGhpcy5wb3BTdGFjaygpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcbiAgICAgIG9wdGlvbnMuaGFzaFR5cGVzID0gdGhpcy5wb3BTdGFjaygpO1xuICAgICAgb3B0aW9ucy5oYXNoQ29udGV4dHMgPSB0aGlzLnBvcFN0YWNrKCk7XG4gICAgfVxuXG4gICAgbGV0IGludmVyc2UgPSB0aGlzLnBvcFN0YWNrKCksXG4gICAgICBwcm9ncmFtID0gdGhpcy5wb3BTdGFjaygpO1xuXG4gICAgLy8gQXZvaWQgc2V0dGluZyBmbiBhbmQgaW52ZXJzZSBpZiBuZWl0aGVyIGFyZSBzZXQuIFRoaXMgYWxsb3dzXG4gICAgLy8gaGVscGVycyB0byBkbyBhIGNoZWNrIGZvciBgaWYgKG9wdGlvbnMuZm4pYFxuICAgIGlmIChwcm9ncmFtIHx8IGludmVyc2UpIHtcbiAgICAgIG9wdGlvbnMuZm4gPSBwcm9ncmFtIHx8ICdjb250YWluZXIubm9vcCc7XG4gICAgICBvcHRpb25zLmludmVyc2UgPSBpbnZlcnNlIHx8ICdjb250YWluZXIubm9vcCc7XG4gICAgfVxuXG4gICAgLy8gVGhlIHBhcmFtZXRlcnMgZ28gb24gdG8gdGhlIHN0YWNrIGluIG9yZGVyIChtYWtpbmcgc3VyZSB0aGF0IHRoZXkgYXJlIGV2YWx1YXRlZCBpbiBvcmRlcilcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIHBvcCB0aGVtIG9mZiB0aGUgc3RhY2sgaW4gcmV2ZXJzZSBvcmRlclxuICAgIGxldCBpID0gcGFyYW1TaXplO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHBhcmFtID0gdGhpcy5wb3BTdGFjaygpO1xuICAgICAgcGFyYW1zW2ldID0gcGFyYW07XG5cbiAgICAgIGlmICh0aGlzLnRyYWNrSWRzKSB7XG4gICAgICAgIGlkc1tpXSA9IHRoaXMucG9wU3RhY2soKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuICAgICAgICB0eXBlc1tpXSA9IHRoaXMucG9wU3RhY2soKTtcbiAgICAgICAgY29udGV4dHNbaV0gPSB0aGlzLnBvcFN0YWNrKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9iamVjdEFyZ3MpIHtcbiAgICAgIG9wdGlvbnMuYXJncyA9IHRoaXMuc291cmNlLmdlbmVyYXRlQXJyYXkocGFyYW1zKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50cmFja0lkcykge1xuICAgICAgb3B0aW9ucy5pZHMgPSB0aGlzLnNvdXJjZS5nZW5lcmF0ZUFycmF5KGlkcyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuICAgICAgb3B0aW9ucy50eXBlcyA9IHRoaXMuc291cmNlLmdlbmVyYXRlQXJyYXkodHlwZXMpO1xuICAgICAgb3B0aW9ucy5jb250ZXh0cyA9IHRoaXMuc291cmNlLmdlbmVyYXRlQXJyYXkoY29udGV4dHMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGF0YSkge1xuICAgICAgb3B0aW9ucy5kYXRhID0gJ2RhdGEnO1xuICAgIH1cbiAgICBpZiAodGhpcy51c2VCbG9ja1BhcmFtcykge1xuICAgICAgb3B0aW9ucy5ibG9ja1BhcmFtcyA9ICdibG9ja1BhcmFtcyc7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zO1xuICB9LFxuXG4gIHNldHVwSGVscGVyQXJnczogZnVuY3Rpb24oaGVscGVyLCBwYXJhbVNpemUsIHBhcmFtcywgdXNlUmVnaXN0ZXIpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuc2V0dXBQYXJhbXMoaGVscGVyLCBwYXJhbVNpemUsIHBhcmFtcyk7XG4gICAgb3B0aW9ucy5sb2MgPSBKU09OLnN0cmluZ2lmeSh0aGlzLnNvdXJjZS5jdXJyZW50TG9jYXRpb24pO1xuICAgIG9wdGlvbnMgPSB0aGlzLm9iamVjdExpdGVyYWwob3B0aW9ucyk7XG4gICAgaWYgKHVzZVJlZ2lzdGVyKSB7XG4gICAgICB0aGlzLnVzZVJlZ2lzdGVyKCdvcHRpb25zJyk7XG4gICAgICBwYXJhbXMucHVzaCgnb3B0aW9ucycpO1xuICAgICAgcmV0dXJuIFsnb3B0aW9ucz0nLCBvcHRpb25zXTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtcykge1xuICAgICAgcGFyYW1zLnB1c2gob3B0aW9ucyk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cbiAgfVxufTtcblxuKGZ1bmN0aW9uKCkge1xuICBjb25zdCByZXNlcnZlZFdvcmRzID0gKFxuICAgICdicmVhayBlbHNlIG5ldyB2YXInICtcbiAgICAnIGNhc2UgZmluYWxseSByZXR1cm4gdm9pZCcgK1xuICAgICcgY2F0Y2ggZm9yIHN3aXRjaCB3aGlsZScgK1xuICAgICcgY29udGludWUgZnVuY3Rpb24gdGhpcyB3aXRoJyArXG4gICAgJyBkZWZhdWx0IGlmIHRocm93JyArXG4gICAgJyBkZWxldGUgaW4gdHJ5JyArXG4gICAgJyBkbyBpbnN0YW5jZW9mIHR5cGVvZicgK1xuICAgICcgYWJzdHJhY3QgZW51bSBpbnQgc2hvcnQnICtcbiAgICAnIGJvb2xlYW4gZXhwb3J0IGludGVyZmFjZSBzdGF0aWMnICtcbiAgICAnIGJ5dGUgZXh0ZW5kcyBsb25nIHN1cGVyJyArXG4gICAgJyBjaGFyIGZpbmFsIG5hdGl2ZSBzeW5jaHJvbml6ZWQnICtcbiAgICAnIGNsYXNzIGZsb2F0IHBhY2thZ2UgdGhyb3dzJyArXG4gICAgJyBjb25zdCBnb3RvIHByaXZhdGUgdHJhbnNpZW50JyArXG4gICAgJyBkZWJ1Z2dlciBpbXBsZW1lbnRzIHByb3RlY3RlZCB2b2xhdGlsZScgK1xuICAgICcgZG91YmxlIGltcG9ydCBwdWJsaWMgbGV0IHlpZWxkIGF3YWl0JyArXG4gICAgJyBudWxsIHRydWUgZmFsc2UnXG4gICkuc3BsaXQoJyAnKTtcblxuICBjb25zdCBjb21waWxlcldvcmRzID0gKEphdmFTY3JpcHRDb21waWxlci5SRVNFUlZFRF9XT1JEUyA9IHt9KTtcblxuICBmb3IgKGxldCBpID0gMCwgbCA9IHJlc2VydmVkV29yZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29tcGlsZXJXb3Jkc1tyZXNlcnZlZFdvcmRzW2ldXSA9IHRydWU7XG4gIH1cbn0pKCk7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgTWF5IGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvblxuICovXG5KYXZhU2NyaXB0Q29tcGlsZXIuaXNWYWxpZEphdmFTY3JpcHRWYXJpYWJsZU5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiAoXG4gICAgIUphdmFTY3JpcHRDb21waWxlci5SRVNFUlZFRF9XT1JEU1tuYW1lXSAmJlxuICAgIC9eW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qJC8udGVzdChuYW1lKVxuICApO1xufTtcblxuZnVuY3Rpb24gc3RyaWN0TG9va3VwKHJlcXVpcmVUZXJtaW5hbCwgY29tcGlsZXIsIHBhcnRzLCB0eXBlKSB7XG4gIGxldCBzdGFjayA9IGNvbXBpbGVyLnBvcFN0YWNrKCksXG4gICAgaSA9IDAsXG4gICAgbGVuID0gcGFydHMubGVuZ3RoO1xuICBpZiAocmVxdWlyZVRlcm1pbmFsKSB7XG4gICAgbGVuLS07XG4gIH1cblxuICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgc3RhY2sgPSBjb21waWxlci5uYW1lTG9va3VwKHN0YWNrLCBwYXJ0c1tpXSwgdHlwZSk7XG4gIH1cblxuICBpZiAocmVxdWlyZVRlcm1pbmFsKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIGNvbXBpbGVyLmFsaWFzYWJsZSgnY29udGFpbmVyLnN0cmljdCcpLFxuICAgICAgJygnLFxuICAgICAgc3RhY2ssXG4gICAgICAnLCAnLFxuICAgICAgY29tcGlsZXIucXVvdGVkU3RyaW5nKHBhcnRzW2ldKSxcbiAgICAgICcsICcsXG4gICAgICBKU09OLnN0cmluZ2lmeShjb21waWxlci5zb3VyY2UuY3VycmVudExvY2F0aW9uKSxcbiAgICAgICcgKSdcbiAgICBdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdGFjaztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBKYXZhU2NyaXB0Q29tcGlsZXI7XG4iXX0=
