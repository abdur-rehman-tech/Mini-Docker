/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compiler = Compiler;
exports.precompile = precompile;
exports.compile = compile;

var
/*istanbul ignore next*/
_exception = _interopRequireDefault(require("../exception"));

var
/*istanbul ignore next*/
_utils = require("../utils");

var
/*istanbul ignore next*/
_ast = _interopRequireDefault(require("./ast"));

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable new-cap */
var slice = [].slice;

function Compiler() {} // the foundHelper register will disambiguate helper lookup from finding a
// function in a context. This is necessary for mustache compatibility, which
// requires that context functions in blocks are evaluated by blockHelperMissing,
// and then proceed as if the resulting value was provided to blockHelperMissing.


Compiler.prototype = {
  compiler: Compiler,
  equals: function
  /*istanbul ignore next*/
  equals(other) {
    var len = this.opcodes.length;

    if (other.opcodes.length !== len) {
      return false;
    }

    for (var i = 0; i < len; i++) {
      var opcode = this.opcodes[i],
          otherOpcode = other.opcodes[i];

      if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
        return false;
      }
    } // We know that length is the same between the two arrays because they are directly tied
    // to the opcode behavior above.


    len = this.children.length;

    for (var _i = 0; _i < len; _i++) {
      if (!this.children[_i].equals(other.children[_i])) {
        return false;
      }
    }

    return true;
  },
  guid: 0,
  compile: function
  /*istanbul ignore next*/
  compile(program, options) {
    this.sourceNode = [];
    this.opcodes = [];
    this.children = [];
    this.options = options;
    this.stringParams = options.stringParams;
    this.trackIds = options.trackIds;
    options.blockParams = options.blockParams || [];
    options.knownHelpers =
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    extend)(Object.create(null), {
      helperMissing: true,
      blockHelperMissing: true,
      each: true,

      /*istanbul ignore next*/
      "if": true,
      unless: true,

      /*istanbul ignore next*/
      "with": true,
      log: true,
      lookup: true
    }, options.knownHelpers);
    return this.accept(program);
  },
  compileProgram: function
  /*istanbul ignore next*/
  compileProgram(program) {
    var childCompiler = new this.compiler(),
        // eslint-disable-line new-cap
    result = childCompiler.compile(program, this.options),
        guid = this.guid++;
    this.usePartial = this.usePartial || result.usePartial;
    this.children[guid] = result;
    this.useDepths = this.useDepths || result.useDepths;
    return guid;
  },
  accept: function
  /*istanbul ignore next*/
  accept(node) {
    /* istanbul ignore next: Sanity code */
    if (!this[node.type]) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('Unknown type: ' + node.type, node);
    }

    this.sourceNode.unshift(node);
    var ret = this[node.type](node);
    this.sourceNode.shift();
    return ret;
  },
  Program: function
  /*istanbul ignore next*/
  Program(program) {
    this.options.blockParams.unshift(program.blockParams);
    var body = program.body,
        bodyLength = body.length;

    for (var i = 0; i < bodyLength; i++) {
      this.accept(body[i]);
    }

    this.options.blockParams.shift();
    this.isSimple = bodyLength === 1;
    this.blockParams = program.blockParams ? program.blockParams.length : 0;
    return this;
  },
  BlockStatement: function
  /*istanbul ignore next*/
  BlockStatement(block) {
    transformLiteralToPath(block);
    var program = block.program,
        inverse = block.inverse;
    program = program && this.compileProgram(program);
    inverse = inverse && this.compileProgram(inverse);
    var type = this.classifySexpr(block);

    if (type === 'helper') {
      this.helperSexpr(block, program, inverse);
    } else if (type === 'simple') {
      this.simpleSexpr(block); // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('blockValue', block.path.original);
    } else {
      this.ambiguousSexpr(block, program, inverse); // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('ambiguousBlockValue');
    }

    this.opcode('append');
  },

  /*istanbul ignore next*/
  DecoratorBlock: function DecoratorBlock(decorator) {
    var program = decorator.program && this.compileProgram(decorator.program);
    var params = this.setupFullMustacheParams(decorator, program, undefined),
        path = decorator.path;
    this.useDecorators = true;
    this.opcode('registerDecorator', params.length, path.original);
  },
  PartialStatement: function
  /*istanbul ignore next*/
  PartialStatement(partial) {
    this.usePartial = true;
    var program = partial.program;

    if (program) {
      program = this.compileProgram(partial.program);
    }

    var params = partial.params;

    if (params.length > 1) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('Unsupported number of partial arguments: ' + params.length, partial);
    } else if (!params.length) {
      if (this.options.explicitPartialContext) {
        this.opcode('pushLiteral', 'undefined');
      } else {
        params.push({
          type: 'PathExpression',
          parts: [],
          depth: 0
        });
      }
    }

    var partialName = partial.name.original,
        isDynamic = partial.name.type === 'SubExpression';

    if (isDynamic) {
      this.accept(partial.name);
    }

    this.setupFullMustacheParams(partial, program, undefined, true);
    var indent = partial.indent || '';

    if (this.options.preventIndent && indent) {
      this.opcode('appendContent', indent);
      indent = '';
    }

    this.opcode('invokePartial', isDynamic, partialName, indent);
    this.opcode('append');
  },
  PartialBlockStatement: function
  /*istanbul ignore next*/
  PartialBlockStatement(partialBlock) {
    this.PartialStatement(partialBlock);
  },
  MustacheStatement: function
  /*istanbul ignore next*/
  MustacheStatement(mustache) {
    this.SubExpression(mustache);

    if (mustache.escaped && !this.options.noEscape) {
      this.opcode('appendEscaped');
    } else {
      this.opcode('append');
    }
  },

  /*istanbul ignore next*/
  Decorator: function Decorator(decorator) {
    this.DecoratorBlock(decorator);
  },
  ContentStatement: function
  /*istanbul ignore next*/
  ContentStatement(content) {
    if (content.value) {
      this.opcode('appendContent', content.value);
    }
  },
  CommentStatement: function
  /*istanbul ignore next*/
  CommentStatement() {},
  SubExpression: function
  /*istanbul ignore next*/
  SubExpression(sexpr) {
    transformLiteralToPath(sexpr);
    var type = this.classifySexpr(sexpr);

    if (type === 'simple') {
      this.simpleSexpr(sexpr);
    } else if (type === 'helper') {
      this.helperSexpr(sexpr);
    } else {
      this.ambiguousSexpr(sexpr);
    }
  },
  ambiguousSexpr: function
  /*istanbul ignore next*/
  ambiguousSexpr(sexpr, program, inverse) {
    var path = sexpr.path,
        name = path.parts[0],
        isBlock = program != null || inverse != null;
    this.opcode('getContext', path.depth);
    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);
    path.strict = true;
    this.accept(path);
    this.opcode('invokeAmbiguous', name, isBlock);
  },
  simpleSexpr: function
  /*istanbul ignore next*/
  simpleSexpr(sexpr) {
    var path = sexpr.path;
    path.strict = true;
    this.accept(path);
    this.opcode('resolvePossibleLambda');
  },
  helperSexpr: function
  /*istanbul ignore next*/
  helperSexpr(sexpr, program, inverse) {
    var params = this.setupFullMustacheParams(sexpr, program, inverse),
        path = sexpr.path,
        name = path.parts[0];

    if (this.options.knownHelpers[name]) {
      this.opcode('invokeKnownHelper', params.length, name);
    } else if (this.options.knownHelpersOnly) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('You specified knownHelpersOnly, but used the unknown helper ' + name, sexpr);
    } else {
      path.strict = true;
      path.falsy = true;
      this.accept(path);
      this.opcode('invokeHelper', params.length, path.original,
      /*istanbul ignore next*/
      _ast[
      /*istanbul ignore next*/
      "default"].helpers.simpleId(path));
    }
  },
  PathExpression: function
  /*istanbul ignore next*/
  PathExpression(path) {
    this.addDepth(path.depth);
    this.opcode('getContext', path.depth);

    var name = path.parts[0],
        scoped =
    /*istanbul ignore next*/
    _ast[
    /*istanbul ignore next*/
    "default"].helpers.scopedId(path),
        blockParamId = !path.depth && !scoped && this.blockParamIndex(name);

    if (blockParamId) {
      this.opcode('lookupBlockParam', blockParamId, path.parts);
    } else if (!name) {
      // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
      this.opcode('pushContext');
    } else if (path.data) {
      this.options.data = true;
      this.opcode('lookupData', path.depth, path.parts, path.strict);
    } else {
      this.opcode('lookupOnContext', path.parts, path.falsy, path.strict, scoped);
    }
  },
  StringLiteral: function
  /*istanbul ignore next*/
  StringLiteral(string) {
    this.opcode('pushString', string.value);
  },
  NumberLiteral: function
  /*istanbul ignore next*/
  NumberLiteral(number) {
    this.opcode('pushLiteral', number.value);
  },
  BooleanLiteral: function
  /*istanbul ignore next*/
  BooleanLiteral(bool) {
    this.opcode('pushLiteral', bool.value);
  },
  UndefinedLiteral: function
  /*istanbul ignore next*/
  UndefinedLiteral() {
    this.opcode('pushLiteral', 'undefined');
  },
  NullLiteral: function
  /*istanbul ignore next*/
  NullLiteral() {
    this.opcode('pushLiteral', 'null');
  },
  Hash: function
  /*istanbul ignore next*/
  Hash(hash) {
    var pairs = hash.pairs,
        i = 0,
        l = pairs.length;
    this.opcode('pushHash');

    for (; i < l; i++) {
      this.pushParam(pairs[i].value);
    }

    while (i--) {
      this.opcode('assignToHash', pairs[i].key);
    }

    this.opcode('popHash');
  },
  // HELPERS
  opcode: function
  /*istanbul ignore next*/
  opcode(name) {
    this.opcodes.push({
      opcode: name,
      args: slice.call(arguments, 1),
      loc: this.sourceNode[0].loc
    });
  },
  addDepth: function
  /*istanbul ignore next*/
  addDepth(depth) {
    if (!depth) {
      return;
    }

    this.useDepths = true;
  },
  classifySexpr: function
  /*istanbul ignore next*/
  classifySexpr(sexpr) {
    var isSimple =
    /*istanbul ignore next*/
    _ast[
    /*istanbul ignore next*/
    "default"].helpers.simpleId(sexpr.path);

    var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]); // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)

    var isHelper = !isBlockParam &&
    /*istanbul ignore next*/
    _ast[
    /*istanbul ignore next*/
    "default"].helpers.helperExpression(sexpr); // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.


    var isEligible = !isBlockParam && (isHelper || isSimple); // if ambiguous, we can possibly resolve the ambiguity now
    // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.

    if (isEligible && !isHelper) {
      var name = sexpr.path.parts[0],
          options = this.options;

      if (options.knownHelpers[name]) {
        isHelper = true;
      } else if (options.knownHelpersOnly) {
        isEligible = false;
      }
    }

    if (isHelper) {
      return 'helper';
    } else if (isEligible) {
      return 'ambiguous';
    } else {
      return 'simple';
    }
  },
  pushParams: function
  /*istanbul ignore next*/
  pushParams(params) {
    for (var i = 0, l = params.length; i < l; i++) {
      this.pushParam(params[i]);
    }
  },
  pushParam: function
  /*istanbul ignore next*/
  pushParam(val) {
    var value = val.value != null ? val.value : val.original || '';

    if (this.stringParams) {
      if (value.replace) {
        value = value.replace(/^(\.?\.\/)*/g, '').replace(/\//g, '.');
      }

      if (val.depth) {
        this.addDepth(val.depth);
      }

      this.opcode('getContext', val.depth || 0);
      this.opcode('pushStringParam', value, val.type);

      if (val.type === 'SubExpression') {
        // SubExpressions get evaluated and passed in
        // in string params mode.
        this.accept(val);
      }
    } else {
      if (this.trackIds) {
        var blockParamIndex;

        if (val.parts && !
        /*istanbul ignore next*/
        _ast[
        /*istanbul ignore next*/
        "default"].helpers.scopedId(val) && !val.depth) {
          blockParamIndex = this.blockParamIndex(val.parts[0]);
        }

        if (blockParamIndex) {
          var blockParamChild = val.parts.slice(1).join('.');
          this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
        } else {
          value = val.original || value;

          if (value.replace) {
            value = value.replace(/^this(?:\.|$)/, '').replace(/^\.\//, '').replace(/^\.$/, '');
          }

          this.opcode('pushId', val.type, value);
        }
      }

      this.accept(val);
    }
  },
  setupFullMustacheParams: function
  /*istanbul ignore next*/
  setupFullMustacheParams(sexpr, program, inverse, omitEmpty) {
    var params = sexpr.params;
    this.pushParams(params);
    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    if (sexpr.hash) {
      this.accept(sexpr.hash);
    } else {
      this.opcode('emptyHash', omitEmpty);
    }

    return params;
  },
  blockParamIndex: function
  /*istanbul ignore next*/
  blockParamIndex(name) {
    for (var depth = 0, len = this.options.blockParams.length; depth < len; depth++) {
      var blockParams = this.options.blockParams[depth],
          param = blockParams &&
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _utils.
      /*istanbul ignore next*/
      indexOf)(blockParams, name);

      if (blockParams && param >= 0) {
        return [depth, param];
      }
    }
  }
};

function precompile(input, options, env) {
  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
    throw new
    /*istanbul ignore next*/
    _exception[
    /*istanbul ignore next*/
    "default"]('You must pass a string or Handlebars AST to Handlebars.precompile. You passed ' + input);
  }

  options = options || {};

  if (!('data' in options)) {
    options.data = true;
  }

  if (options.compat) {
    options.useDepths = true;
  }

  var ast = env.parse(input, options),
      environment = new env.Compiler().compile(ast, options);
  return new env.JavaScriptCompiler().compile(environment, options);
}

function compile(input) {
  /*istanbul ignore next*/
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  /*istanbul ignore next*/
  var env = arguments.length > 2 ? arguments[2] : undefined;

  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
    throw new
    /*istanbul ignore next*/
    _exception[
    /*istanbul ignore next*/
    "default"]('You must pass a string or Handlebars AST to Handlebars.compile. You passed ' + input);
  }

  options =
  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _utils.
  /*istanbul ignore next*/
  extend)({}, options);

  if (!('data' in options)) {
    options.data = true;
  }

  if (options.compat) {
    options.useDepths = true;
  }

  var compiled;

  function compileInput() {
    var ast = env.parse(input, options),
        environment = new env.Compiler().compile(ast, options),
        templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
    return env.template(templateSpec);
  } // Template is only compiled on first use and cached after that point.


  function ret(context, execOptions) {
    if (!compiled) {
      compiled = compileInput();
    }

    return compiled.call(this, context, execOptions);
  }

  ret._setup = function (setupOptions) {
    if (!compiled) {
      compiled = compileInput();
    }

    return compiled._setup(setupOptions);
  };

  ret._child = function (i, data, blockParams, depths) {
    if (!compiled) {
      compiled = compileInput();
    }

    return compiled._child(i, data, blockParams, depths);
  };

  return ret;
}

function argEquals(a, b) {
  if (a === b) {
    return true;
  }

  if (
  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _utils.
  /*istanbul ignore next*/
  isArray)(a) &&
  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _utils.
  /*istanbul ignore next*/
  isArray)(b) && a.length === b.length) {
    for (var i = 0; i < a.length; i++) {
      if (!argEquals(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }
}

function transformLiteralToPath(sexpr) {
  if (!sexpr.path.parts) {
    var literal = sexpr.path; // Casting to string here to make false and 0 literal values play nicely with the rest
    // of the system.

    sexpr.path = {
      type: 'PathExpression',
      data: false,
      depth: 0,
      parts: [literal.original + ''],
      original: literal.original + '',
      loc: literal.loc
    };
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2NvbXBpbGVyL2NvbXBpbGVyLmpzIl0sIm5hbWVzIjpbInNsaWNlIiwiQ29tcGlsZXIiLCJwcm90b3R5cGUiLCJjb21waWxlciIsImVxdWFscyIsIm90aGVyIiwibGVuIiwib3Bjb2RlcyIsImxlbmd0aCIsImkiLCJvcGNvZGUiLCJvdGhlck9wY29kZSIsImFyZ0VxdWFscyIsImFyZ3MiLCJjaGlsZHJlbiIsImd1aWQiLCJjb21waWxlIiwicHJvZ3JhbSIsIm9wdGlvbnMiLCJzb3VyY2VOb2RlIiwic3RyaW5nUGFyYW1zIiwidHJhY2tJZHMiLCJibG9ja1BhcmFtcyIsImtub3duSGVscGVycyIsImV4dGVuZCIsIk9iamVjdCIsImNyZWF0ZSIsImhlbHBlck1pc3NpbmciLCJibG9ja0hlbHBlck1pc3NpbmciLCJlYWNoIiwidW5sZXNzIiwibG9nIiwibG9va3VwIiwiYWNjZXB0IiwiY29tcGlsZVByb2dyYW0iLCJjaGlsZENvbXBpbGVyIiwicmVzdWx0IiwidXNlUGFydGlhbCIsInVzZURlcHRocyIsIm5vZGUiLCJ0eXBlIiwiRXhjZXB0aW9uIiwidW5zaGlmdCIsInJldCIsInNoaWZ0IiwiUHJvZ3JhbSIsImJvZHkiLCJib2R5TGVuZ3RoIiwiaXNTaW1wbGUiLCJCbG9ja1N0YXRlbWVudCIsImJsb2NrIiwidHJhbnNmb3JtTGl0ZXJhbFRvUGF0aCIsImludmVyc2UiLCJjbGFzc2lmeVNleHByIiwiaGVscGVyU2V4cHIiLCJzaW1wbGVTZXhwciIsInBhdGgiLCJvcmlnaW5hbCIsImFtYmlndW91c1NleHByIiwiRGVjb3JhdG9yQmxvY2siLCJkZWNvcmF0b3IiLCJwYXJhbXMiLCJzZXR1cEZ1bGxNdXN0YWNoZVBhcmFtcyIsInVuZGVmaW5lZCIsInVzZURlY29yYXRvcnMiLCJQYXJ0aWFsU3RhdGVtZW50IiwicGFydGlhbCIsImV4cGxpY2l0UGFydGlhbENvbnRleHQiLCJwdXNoIiwicGFydHMiLCJkZXB0aCIsInBhcnRpYWxOYW1lIiwibmFtZSIsImlzRHluYW1pYyIsImluZGVudCIsInByZXZlbnRJbmRlbnQiLCJQYXJ0aWFsQmxvY2tTdGF0ZW1lbnQiLCJwYXJ0aWFsQmxvY2siLCJNdXN0YWNoZVN0YXRlbWVudCIsIm11c3RhY2hlIiwiU3ViRXhwcmVzc2lvbiIsImVzY2FwZWQiLCJub0VzY2FwZSIsIkRlY29yYXRvciIsIkNvbnRlbnRTdGF0ZW1lbnQiLCJjb250ZW50IiwidmFsdWUiLCJDb21tZW50U3RhdGVtZW50Iiwic2V4cHIiLCJpc0Jsb2NrIiwic3RyaWN0Iiwia25vd25IZWxwZXJzT25seSIsImZhbHN5IiwiQVNUIiwiaGVscGVycyIsInNpbXBsZUlkIiwiUGF0aEV4cHJlc3Npb24iLCJhZGREZXB0aCIsInNjb3BlZCIsInNjb3BlZElkIiwiYmxvY2tQYXJhbUlkIiwiYmxvY2tQYXJhbUluZGV4IiwiZGF0YSIsIlN0cmluZ0xpdGVyYWwiLCJzdHJpbmciLCJOdW1iZXJMaXRlcmFsIiwibnVtYmVyIiwiQm9vbGVhbkxpdGVyYWwiLCJib29sIiwiVW5kZWZpbmVkTGl0ZXJhbCIsIk51bGxMaXRlcmFsIiwiSGFzaCIsImhhc2giLCJwYWlycyIsImwiLCJwdXNoUGFyYW0iLCJrZXkiLCJjYWxsIiwiYXJndW1lbnRzIiwibG9jIiwiaXNCbG9ja1BhcmFtIiwiaXNIZWxwZXIiLCJoZWxwZXJFeHByZXNzaW9uIiwiaXNFbGlnaWJsZSIsInB1c2hQYXJhbXMiLCJ2YWwiLCJyZXBsYWNlIiwiYmxvY2tQYXJhbUNoaWxkIiwiam9pbiIsIm9taXRFbXB0eSIsInBhcmFtIiwiaW5kZXhPZiIsInByZWNvbXBpbGUiLCJpbnB1dCIsImVudiIsImNvbXBhdCIsImFzdCIsInBhcnNlIiwiZW52aXJvbm1lbnQiLCJKYXZhU2NyaXB0Q29tcGlsZXIiLCJjb21waWxlZCIsImNvbXBpbGVJbnB1dCIsInRlbXBsYXRlU3BlYyIsInRlbXBsYXRlIiwiY29udGV4dCIsImV4ZWNPcHRpb25zIiwiX3NldHVwIiwic2V0dXBPcHRp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RCxNQUFBQSxHQUFHLEVBQUVrQyxPQUFPLENBQUNsQztBQU5GLEtBQWI7QUFRRDtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuXG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4uL2V4Y2VwdGlvbic7XG5pbXBvcnQgeyBpc0FycmF5LCBpbmRleE9mLCBleHRlbmQgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgQVNUIGZyb20gJy4vYXN0JztcblxuY29uc3Qgc2xpY2UgPSBbXS5zbGljZTtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbXBpbGVyKCkge31cblxuLy8gdGhlIGZvdW5kSGVscGVyIHJlZ2lzdGVyIHdpbGwgZGlzYW1iaWd1YXRlIGhlbHBlciBsb29rdXAgZnJvbSBmaW5kaW5nIGFcbi8vIGZ1bmN0aW9uIGluIGEgY29udGV4dC4gVGhpcyBpcyBuZWNlc3NhcnkgZm9yIG11c3RhY2hlIGNvbXBhdGliaWxpdHksIHdoaWNoXG4vLyByZXF1aXJlcyB0aGF0IGNvbnRleHQgZnVuY3Rpb25zIGluIGJsb2NrcyBhcmUgZXZhbHVhdGVkIGJ5IGJsb2NrSGVscGVyTWlzc2luZyxcbi8vIGFuZCB0aGVuIHByb2NlZWQgYXMgaWYgdGhlIHJlc3VsdGluZyB2YWx1ZSB3YXMgcHJvdmlkZWQgdG8gYmxvY2tIZWxwZXJNaXNzaW5nLlxuXG5Db21waWxlci5wcm90b3R5cGUgPSB7XG4gIGNvbXBpbGVyOiBDb21waWxlcixcblxuICBlcXVhbHM6IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgbGV0IGxlbiA9IHRoaXMub3Bjb2Rlcy5sZW5ndGg7XG4gICAgaWYgKG90aGVyLm9wY29kZXMubGVuZ3RoICE9PSBsZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgb3Bjb2RlID0gdGhpcy5vcGNvZGVzW2ldLFxuICAgICAgICBvdGhlck9wY29kZSA9IG90aGVyLm9wY29kZXNbaV07XG4gICAgICBpZiAoXG4gICAgICAgIG9wY29kZS5vcGNvZGUgIT09IG90aGVyT3Bjb2RlLm9wY29kZSB8fFxuICAgICAgICAhYXJnRXF1YWxzKG9wY29kZS5hcmdzLCBvdGhlck9wY29kZS5hcmdzKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBrbm93IHRoYXQgbGVuZ3RoIGlzIHRoZSBzYW1lIGJldHdlZW4gdGhlIHR3byBhcnJheXMgYmVjYXVzZSB0aGV5IGFyZSBkaXJlY3RseSB0aWVkXG4gICAgLy8gdG8gdGhlIG9wY29kZSBiZWhhdmlvciBhYm92ZS5cbiAgICBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoIXRoaXMuY2hpbGRyZW5baV0uZXF1YWxzKG90aGVyLmNoaWxkcmVuW2ldKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgZ3VpZDogMCxcblxuICBjb21waWxlOiBmdW5jdGlvbihwcm9ncmFtLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zb3VyY2VOb2RlID0gW107XG4gICAgdGhpcy5vcGNvZGVzID0gW107XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5zdHJpbmdQYXJhbXMgPSBvcHRpb25zLnN0cmluZ1BhcmFtcztcbiAgICB0aGlzLnRyYWNrSWRzID0gb3B0aW9ucy50cmFja0lkcztcblxuICAgIG9wdGlvbnMuYmxvY2tQYXJhbXMgPSBvcHRpb25zLmJsb2NrUGFyYW1zIHx8IFtdO1xuXG4gICAgb3B0aW9ucy5rbm93bkhlbHBlcnMgPSBleHRlbmQoXG4gICAgICBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAge1xuICAgICAgICBoZWxwZXJNaXNzaW5nOiB0cnVlLFxuICAgICAgICBibG9ja0hlbHBlck1pc3Npbmc6IHRydWUsXG4gICAgICAgIGVhY2g6IHRydWUsXG4gICAgICAgIGlmOiB0cnVlLFxuICAgICAgICB1bmxlc3M6IHRydWUsXG4gICAgICAgIHdpdGg6IHRydWUsXG4gICAgICAgIGxvZzogdHJ1ZSxcbiAgICAgICAgbG9va3VwOiB0cnVlXG4gICAgICB9LFxuICAgICAgb3B0aW9ucy5rbm93bkhlbHBlcnNcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuYWNjZXB0KHByb2dyYW0pO1xuICB9LFxuXG4gIGNvbXBpbGVQcm9ncmFtOiBmdW5jdGlvbihwcm9ncmFtKSB7XG4gICAgbGV0IGNoaWxkQ29tcGlsZXIgPSBuZXcgdGhpcy5jb21waWxlcigpLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5ldy1jYXBcbiAgICAgIHJlc3VsdCA9IGNoaWxkQ29tcGlsZXIuY29tcGlsZShwcm9ncmFtLCB0aGlzLm9wdGlvbnMpLFxuICAgICAgZ3VpZCA9IHRoaXMuZ3VpZCsrO1xuXG4gICAgdGhpcy51c2VQYXJ0aWFsID0gdGhpcy51c2VQYXJ0aWFsIHx8IHJlc3VsdC51c2VQYXJ0aWFsO1xuXG4gICAgdGhpcy5jaGlsZHJlbltndWlkXSA9IHJlc3VsdDtcbiAgICB0aGlzLnVzZURlcHRocyA9IHRoaXMudXNlRGVwdGhzIHx8IHJlc3VsdC51c2VEZXB0aHM7XG5cbiAgICByZXR1cm4gZ3VpZDtcbiAgfSxcblxuICBhY2NlcHQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogU2FuaXR5IGNvZGUgKi9cbiAgICBpZiAoIXRoaXNbbm9kZS50eXBlXSkge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVW5rbm93biB0eXBlOiAnICsgbm9kZS50eXBlLCBub2RlKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvdXJjZU5vZGUudW5zaGlmdChub2RlKTtcbiAgICBsZXQgcmV0ID0gdGhpc1tub2RlLnR5cGVdKG5vZGUpO1xuICAgIHRoaXMuc291cmNlTm9kZS5zaGlmdCgpO1xuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgUHJvZ3JhbTogZnVuY3Rpb24ocHJvZ3JhbSkge1xuICAgIHRoaXMub3B0aW9ucy5ibG9ja1BhcmFtcy51bnNoaWZ0KHByb2dyYW0uYmxvY2tQYXJhbXMpO1xuXG4gICAgbGV0IGJvZHkgPSBwcm9ncmFtLmJvZHksXG4gICAgICBib2R5TGVuZ3RoID0gYm9keS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2R5TGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYWNjZXB0KGJvZHlbaV0pO1xuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucy5ibG9ja1BhcmFtcy5zaGlmdCgpO1xuXG4gICAgdGhpcy5pc1NpbXBsZSA9IGJvZHlMZW5ndGggPT09IDE7XG4gICAgdGhpcy5ibG9ja1BhcmFtcyA9IHByb2dyYW0uYmxvY2tQYXJhbXMgPyBwcm9ncmFtLmJsb2NrUGFyYW1zLmxlbmd0aCA6IDA7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBCbG9ja1N0YXRlbWVudDogZnVuY3Rpb24oYmxvY2spIHtcbiAgICB0cmFuc2Zvcm1MaXRlcmFsVG9QYXRoKGJsb2NrKTtcblxuICAgIGxldCBwcm9ncmFtID0gYmxvY2sucHJvZ3JhbSxcbiAgICAgIGludmVyc2UgPSBibG9jay5pbnZlcnNlO1xuXG4gICAgcHJvZ3JhbSA9IHByb2dyYW0gJiYgdGhpcy5jb21waWxlUHJvZ3JhbShwcm9ncmFtKTtcbiAgICBpbnZlcnNlID0gaW52ZXJzZSAmJiB0aGlzLmNvbXBpbGVQcm9ncmFtKGludmVyc2UpO1xuXG4gICAgbGV0IHR5cGUgPSB0aGlzLmNsYXNzaWZ5U2V4cHIoYmxvY2spO1xuXG4gICAgaWYgKHR5cGUgPT09ICdoZWxwZXInKSB7XG4gICAgICB0aGlzLmhlbHBlclNleHByKGJsb2NrLCBwcm9ncmFtLCBpbnZlcnNlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzaW1wbGUnKSB7XG4gICAgICB0aGlzLnNpbXBsZVNleHByKGJsb2NrKTtcblxuICAgICAgLy8gbm93IHRoYXQgdGhlIHNpbXBsZSBtdXN0YWNoZSBpcyByZXNvbHZlZCwgd2UgbmVlZCB0b1xuICAgICAgLy8gZXZhbHVhdGUgaXQgYnkgZXhlY3V0aW5nIGBibG9ja0hlbHBlck1pc3NpbmdgXG4gICAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBwcm9ncmFtKTtcbiAgICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIGludmVyc2UpO1xuICAgICAgdGhpcy5vcGNvZGUoJ2VtcHR5SGFzaCcpO1xuICAgICAgdGhpcy5vcGNvZGUoJ2Jsb2NrVmFsdWUnLCBibG9jay5wYXRoLm9yaWdpbmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hbWJpZ3VvdXNTZXhwcihibG9jaywgcHJvZ3JhbSwgaW52ZXJzZSk7XG5cbiAgICAgIC8vIG5vdyB0aGF0IHRoZSBzaW1wbGUgbXVzdGFjaGUgaXMgcmVzb2x2ZWQsIHdlIG5lZWQgdG9cbiAgICAgIC8vIGV2YWx1YXRlIGl0IGJ5IGV4ZWN1dGluZyBgYmxvY2tIZWxwZXJNaXNzaW5nYFxuICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG4gICAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcbiAgICAgIHRoaXMub3Bjb2RlKCdlbXB0eUhhc2gnKTtcbiAgICAgIHRoaXMub3Bjb2RlKCdhbWJpZ3VvdXNCbG9ja1ZhbHVlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5vcGNvZGUoJ2FwcGVuZCcpO1xuICB9LFxuXG4gIERlY29yYXRvckJsb2NrKGRlY29yYXRvcikge1xuICAgIGxldCBwcm9ncmFtID0gZGVjb3JhdG9yLnByb2dyYW0gJiYgdGhpcy5jb21waWxlUHJvZ3JhbShkZWNvcmF0b3IucHJvZ3JhbSk7XG4gICAgbGV0IHBhcmFtcyA9IHRoaXMuc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXMoZGVjb3JhdG9yLCBwcm9ncmFtLCB1bmRlZmluZWQpLFxuICAgICAgcGF0aCA9IGRlY29yYXRvci5wYXRoO1xuXG4gICAgdGhpcy51c2VEZWNvcmF0b3JzID0gdHJ1ZTtcbiAgICB0aGlzLm9wY29kZSgncmVnaXN0ZXJEZWNvcmF0b3InLCBwYXJhbXMubGVuZ3RoLCBwYXRoLm9yaWdpbmFsKTtcbiAgfSxcblxuICBQYXJ0aWFsU3RhdGVtZW50OiBmdW5jdGlvbihwYXJ0aWFsKSB7XG4gICAgdGhpcy51c2VQYXJ0aWFsID0gdHJ1ZTtcblxuICAgIGxldCBwcm9ncmFtID0gcGFydGlhbC5wcm9ncmFtO1xuICAgIGlmIChwcm9ncmFtKSB7XG4gICAgICBwcm9ncmFtID0gdGhpcy5jb21waWxlUHJvZ3JhbShwYXJ0aWFsLnByb2dyYW0pO1xuICAgIH1cblxuICAgIGxldCBwYXJhbXMgPSBwYXJ0aWFsLnBhcmFtcztcbiAgICBpZiAocGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXG4gICAgICAgICdVbnN1cHBvcnRlZCBudW1iZXIgb2YgcGFydGlhbCBhcmd1bWVudHM6ICcgKyBwYXJhbXMubGVuZ3RoLFxuICAgICAgICBwYXJ0aWFsXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoIXBhcmFtcy5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXhwbGljaXRQYXJ0aWFsQ29udGV4dCkge1xuICAgICAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCAndW5kZWZpbmVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhbXMucHVzaCh7IHR5cGU6ICdQYXRoRXhwcmVzc2lvbicsIHBhcnRzOiBbXSwgZGVwdGg6IDAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHBhcnRpYWxOYW1lID0gcGFydGlhbC5uYW1lLm9yaWdpbmFsLFxuICAgICAgaXNEeW5hbWljID0gcGFydGlhbC5uYW1lLnR5cGUgPT09ICdTdWJFeHByZXNzaW9uJztcbiAgICBpZiAoaXNEeW5hbWljKSB7XG4gICAgICB0aGlzLmFjY2VwdChwYXJ0aWFsLm5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXMocGFydGlhbCwgcHJvZ3JhbSwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgIGxldCBpbmRlbnQgPSBwYXJ0aWFsLmluZGVudCB8fCAnJztcbiAgICBpZiAodGhpcy5vcHRpb25zLnByZXZlbnRJbmRlbnQgJiYgaW5kZW50KSB7XG4gICAgICB0aGlzLm9wY29kZSgnYXBwZW5kQ29udGVudCcsIGluZGVudCk7XG4gICAgICBpbmRlbnQgPSAnJztcbiAgICB9XG5cbiAgICB0aGlzLm9wY29kZSgnaW52b2tlUGFydGlhbCcsIGlzRHluYW1pYywgcGFydGlhbE5hbWUsIGluZGVudCk7XG4gICAgdGhpcy5vcGNvZGUoJ2FwcGVuZCcpO1xuICB9LFxuICBQYXJ0aWFsQmxvY2tTdGF0ZW1lbnQ6IGZ1bmN0aW9uKHBhcnRpYWxCbG9jaykge1xuICAgIHRoaXMuUGFydGlhbFN0YXRlbWVudChwYXJ0aWFsQmxvY2spO1xuICB9LFxuXG4gIE11c3RhY2hlU3RhdGVtZW50OiBmdW5jdGlvbihtdXN0YWNoZSkge1xuICAgIHRoaXMuU3ViRXhwcmVzc2lvbihtdXN0YWNoZSk7XG5cbiAgICBpZiAobXVzdGFjaGUuZXNjYXBlZCAmJiAhdGhpcy5vcHRpb25zLm5vRXNjYXBlKSB7XG4gICAgICB0aGlzLm9wY29kZSgnYXBwZW5kRXNjYXBlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wY29kZSgnYXBwZW5kJyk7XG4gICAgfVxuICB9LFxuICBEZWNvcmF0b3IoZGVjb3JhdG9yKSB7XG4gICAgdGhpcy5EZWNvcmF0b3JCbG9jayhkZWNvcmF0b3IpO1xuICB9LFxuXG4gIENvbnRlbnRTdGF0ZW1lbnQ6IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgICBpZiAoY29udGVudC52YWx1ZSkge1xuICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZENvbnRlbnQnLCBjb250ZW50LnZhbHVlKTtcbiAgICB9XG4gIH0sXG5cbiAgQ29tbWVudFN0YXRlbWVudDogZnVuY3Rpb24oKSB7fSxcblxuICBTdWJFeHByZXNzaW9uOiBmdW5jdGlvbihzZXhwcikge1xuICAgIHRyYW5zZm9ybUxpdGVyYWxUb1BhdGgoc2V4cHIpO1xuICAgIGxldCB0eXBlID0gdGhpcy5jbGFzc2lmeVNleHByKHNleHByKTtcblxuICAgIGlmICh0eXBlID09PSAnc2ltcGxlJykge1xuICAgICAgdGhpcy5zaW1wbGVTZXhwcihzZXhwcik7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnaGVscGVyJykge1xuICAgICAgdGhpcy5oZWxwZXJTZXhwcihzZXhwcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYW1iaWd1b3VzU2V4cHIoc2V4cHIpO1xuICAgIH1cbiAgfSxcbiAgYW1iaWd1b3VzU2V4cHI6IGZ1bmN0aW9uKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlKSB7XG4gICAgbGV0IHBhdGggPSBzZXhwci5wYXRoLFxuICAgICAgbmFtZSA9IHBhdGgucGFydHNbMF0sXG4gICAgICBpc0Jsb2NrID0gcHJvZ3JhbSAhPSBudWxsIHx8IGludmVyc2UgIT0gbnVsbDtcblxuICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgcGF0aC5kZXB0aCk7XG5cbiAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBwcm9ncmFtKTtcbiAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcblxuICAgIHBhdGguc3RyaWN0ID0gdHJ1ZTtcbiAgICB0aGlzLmFjY2VwdChwYXRoKTtcblxuICAgIHRoaXMub3Bjb2RlKCdpbnZva2VBbWJpZ3VvdXMnLCBuYW1lLCBpc0Jsb2NrKTtcbiAgfSxcblxuICBzaW1wbGVTZXhwcjogZnVuY3Rpb24oc2V4cHIpIHtcbiAgICBsZXQgcGF0aCA9IHNleHByLnBhdGg7XG4gICAgcGF0aC5zdHJpY3QgPSB0cnVlO1xuICAgIHRoaXMuYWNjZXB0KHBhdGgpO1xuICAgIHRoaXMub3Bjb2RlKCdyZXNvbHZlUG9zc2libGVMYW1iZGEnKTtcbiAgfSxcblxuICBoZWxwZXJTZXhwcjogZnVuY3Rpb24oc2V4cHIsIHByb2dyYW0sIGludmVyc2UpIHtcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5zZXR1cEZ1bGxNdXN0YWNoZVBhcmFtcyhzZXhwciwgcHJvZ3JhbSwgaW52ZXJzZSksXG4gICAgICBwYXRoID0gc2V4cHIucGF0aCxcbiAgICAgIG5hbWUgPSBwYXRoLnBhcnRzWzBdO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5rbm93bkhlbHBlcnNbbmFtZV0pIHtcbiAgICAgIHRoaXMub3Bjb2RlKCdpbnZva2VLbm93bkhlbHBlcicsIHBhcmFtcy5sZW5ndGgsIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmtub3duSGVscGVyc09ubHkpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXG4gICAgICAgICdZb3Ugc3BlY2lmaWVkIGtub3duSGVscGVyc09ubHksIGJ1dCB1c2VkIHRoZSB1bmtub3duIGhlbHBlciAnICsgbmFtZSxcbiAgICAgICAgc2V4cHJcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdGguc3RyaWN0ID0gdHJ1ZTtcbiAgICAgIHBhdGguZmFsc3kgPSB0cnVlO1xuXG4gICAgICB0aGlzLmFjY2VwdChwYXRoKTtcbiAgICAgIHRoaXMub3Bjb2RlKFxuICAgICAgICAnaW52b2tlSGVscGVyJyxcbiAgICAgICAgcGFyYW1zLmxlbmd0aCxcbiAgICAgICAgcGF0aC5vcmlnaW5hbCxcbiAgICAgICAgQVNULmhlbHBlcnMuc2ltcGxlSWQocGF0aClcbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIFBhdGhFeHByZXNzaW9uOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgdGhpcy5hZGREZXB0aChwYXRoLmRlcHRoKTtcbiAgICB0aGlzLm9wY29kZSgnZ2V0Q29udGV4dCcsIHBhdGguZGVwdGgpO1xuXG4gICAgbGV0IG5hbWUgPSBwYXRoLnBhcnRzWzBdLFxuICAgICAgc2NvcGVkID0gQVNULmhlbHBlcnMuc2NvcGVkSWQocGF0aCksXG4gICAgICBibG9ja1BhcmFtSWQgPSAhcGF0aC5kZXB0aCAmJiAhc2NvcGVkICYmIHRoaXMuYmxvY2tQYXJhbUluZGV4KG5hbWUpO1xuXG4gICAgaWYgKGJsb2NrUGFyYW1JZCkge1xuICAgICAgdGhpcy5vcGNvZGUoJ2xvb2t1cEJsb2NrUGFyYW0nLCBibG9ja1BhcmFtSWQsIHBhdGgucGFydHMpO1xuICAgIH0gZWxzZSBpZiAoIW5hbWUpIHtcbiAgICAgIC8vIENvbnRleHQgcmVmZXJlbmNlLCBpLmUuIGB7e2ZvbyAufX1gIG9yIGB7e2ZvbyAuLn19YFxuICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hDb250ZXh0Jyk7XG4gICAgfSBlbHNlIGlmIChwYXRoLmRhdGEpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gdHJ1ZTtcbiAgICAgIHRoaXMub3Bjb2RlKCdsb29rdXBEYXRhJywgcGF0aC5kZXB0aCwgcGF0aC5wYXJ0cywgcGF0aC5zdHJpY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wY29kZShcbiAgICAgICAgJ2xvb2t1cE9uQ29udGV4dCcsXG4gICAgICAgIHBhdGgucGFydHMsXG4gICAgICAgIHBhdGguZmFsc3ksXG4gICAgICAgIHBhdGguc3RyaWN0LFxuICAgICAgICBzY29wZWRcbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIFN0cmluZ0xpdGVyYWw6IGZ1bmN0aW9uKHN0cmluZykge1xuICAgIHRoaXMub3Bjb2RlKCdwdXNoU3RyaW5nJywgc3RyaW5nLnZhbHVlKTtcbiAgfSxcblxuICBOdW1iZXJMaXRlcmFsOiBmdW5jdGlvbihudW1iZXIpIHtcbiAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCBudW1iZXIudmFsdWUpO1xuICB9LFxuXG4gIEJvb2xlYW5MaXRlcmFsOiBmdW5jdGlvbihib29sKSB7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgYm9vbC52YWx1ZSk7XG4gIH0sXG5cbiAgVW5kZWZpbmVkTGl0ZXJhbDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgJ3VuZGVmaW5lZCcpO1xuICB9LFxuXG4gIE51bGxMaXRlcmFsOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCAnbnVsbCcpO1xuICB9LFxuXG4gIEhhc2g6IGZ1bmN0aW9uKGhhc2gpIHtcbiAgICBsZXQgcGFpcnMgPSBoYXNoLnBhaXJzLFxuICAgICAgaSA9IDAsXG4gICAgICBsID0gcGFpcnMubGVuZ3RoO1xuXG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hIYXNoJyk7XG5cbiAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5wdXNoUGFyYW0ocGFpcnNbaV0udmFsdWUpO1xuICAgIH1cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICB0aGlzLm9wY29kZSgnYXNzaWduVG9IYXNoJywgcGFpcnNbaV0ua2V5KTtcbiAgICB9XG4gICAgdGhpcy5vcGNvZGUoJ3BvcEhhc2gnKTtcbiAgfSxcblxuICAvLyBIRUxQRVJTXG4gIG9wY29kZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHRoaXMub3Bjb2Rlcy5wdXNoKHtcbiAgICAgIG9wY29kZTogbmFtZSxcbiAgICAgIGFyZ3M6IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgIGxvYzogdGhpcy5zb3VyY2VOb2RlWzBdLmxvY1xuICAgIH0pO1xuICB9LFxuXG4gIGFkZERlcHRoOiBmdW5jdGlvbihkZXB0aCkge1xuICAgIGlmICghZGVwdGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnVzZURlcHRocyA9IHRydWU7XG4gIH0sXG5cbiAgY2xhc3NpZnlTZXhwcjogZnVuY3Rpb24oc2V4cHIpIHtcbiAgICBsZXQgaXNTaW1wbGUgPSBBU1QuaGVscGVycy5zaW1wbGVJZChzZXhwci5wYXRoKTtcblxuICAgIGxldCBpc0Jsb2NrUGFyYW0gPSBpc1NpbXBsZSAmJiAhIXRoaXMuYmxvY2tQYXJhbUluZGV4KHNleHByLnBhdGgucGFydHNbMF0pO1xuXG4gICAgLy8gYSBtdXN0YWNoZSBpcyBhbiBlbGlnaWJsZSBoZWxwZXIgaWY6XG4gICAgLy8gKiBpdHMgaWQgaXMgc2ltcGxlIChhIHNpbmdsZSBwYXJ0LCBub3QgYHRoaXNgIG9yIGAuLmApXG4gICAgbGV0IGlzSGVscGVyID0gIWlzQmxvY2tQYXJhbSAmJiBBU1QuaGVscGVycy5oZWxwZXJFeHByZXNzaW9uKHNleHByKTtcblxuICAgIC8vIGlmIGEgbXVzdGFjaGUgaXMgYW4gZWxpZ2libGUgaGVscGVyIGJ1dCBub3QgYSBkZWZpbml0ZVxuICAgIC8vIGhlbHBlciwgaXQgaXMgYW1iaWd1b3VzLCBhbmQgd2lsbCBiZSByZXNvbHZlZCBpbiBhIGxhdGVyXG4gICAgLy8gcGFzcyBvciBhdCBydW50aW1lLlxuICAgIGxldCBpc0VsaWdpYmxlID0gIWlzQmxvY2tQYXJhbSAmJiAoaXNIZWxwZXIgfHwgaXNTaW1wbGUpO1xuXG4gICAgLy8gaWYgYW1iaWd1b3VzLCB3ZSBjYW4gcG9zc2libHkgcmVzb2x2ZSB0aGUgYW1iaWd1aXR5IG5vd1xuICAgIC8vIEFuIGVsaWdpYmxlIGhlbHBlciBpcyBvbmUgdGhhdCBkb2VzIG5vdCBoYXZlIGEgY29tcGxleCBwYXRoLCBpLmUuIGB0aGlzLmZvb2AsIGAuLi9mb29gIGV0Yy5cbiAgICBpZiAoaXNFbGlnaWJsZSAmJiAhaXNIZWxwZXIpIHtcbiAgICAgIGxldCBuYW1lID0gc2V4cHIucGF0aC5wYXJ0c1swXSxcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zLmtub3duSGVscGVyc1tuYW1lXSkge1xuICAgICAgICBpc0hlbHBlciA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMua25vd25IZWxwZXJzT25seSkge1xuICAgICAgICBpc0VsaWdpYmxlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzSGVscGVyKSB7XG4gICAgICByZXR1cm4gJ2hlbHBlcic7XG4gICAgfSBlbHNlIGlmIChpc0VsaWdpYmxlKSB7XG4gICAgICByZXR1cm4gJ2FtYmlndW91cyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnc2ltcGxlJztcbiAgICB9XG4gIH0sXG5cbiAgcHVzaFBhcmFtczogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXJhbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLnB1c2hQYXJhbShwYXJhbXNbaV0pO1xuICAgIH1cbiAgfSxcblxuICBwdXNoUGFyYW06IGZ1bmN0aW9uKHZhbCkge1xuICAgIGxldCB2YWx1ZSA9IHZhbC52YWx1ZSAhPSBudWxsID8gdmFsLnZhbHVlIDogdmFsLm9yaWdpbmFsIHx8ICcnO1xuXG4gICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG4gICAgICBpZiAodmFsdWUucmVwbGFjZSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL14oXFwuP1xcLlxcLykqL2csICcnKS5yZXBsYWNlKC9cXC8vZywgJy4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbC5kZXB0aCkge1xuICAgICAgICB0aGlzLmFkZERlcHRoKHZhbC5kZXB0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLm9wY29kZSgnZ2V0Q29udGV4dCcsIHZhbC5kZXB0aCB8fCAwKTtcbiAgICAgIHRoaXMub3Bjb2RlKCdwdXNoU3RyaW5nUGFyYW0nLCB2YWx1ZSwgdmFsLnR5cGUpO1xuXG4gICAgICBpZiAodmFsLnR5cGUgPT09ICdTdWJFeHByZXNzaW9uJykge1xuICAgICAgICAvLyBTdWJFeHByZXNzaW9ucyBnZXQgZXZhbHVhdGVkIGFuZCBwYXNzZWQgaW5cbiAgICAgICAgLy8gaW4gc3RyaW5nIHBhcmFtcyBtb2RlLlxuICAgICAgICB0aGlzLmFjY2VwdCh2YWwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy50cmFja0lkcykge1xuICAgICAgICBsZXQgYmxvY2tQYXJhbUluZGV4O1xuICAgICAgICBpZiAodmFsLnBhcnRzICYmICFBU1QuaGVscGVycy5zY29wZWRJZCh2YWwpICYmICF2YWwuZGVwdGgpIHtcbiAgICAgICAgICBibG9ja1BhcmFtSW5kZXggPSB0aGlzLmJsb2NrUGFyYW1JbmRleCh2YWwucGFydHNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChibG9ja1BhcmFtSW5kZXgpIHtcbiAgICAgICAgICBsZXQgYmxvY2tQYXJhbUNoaWxkID0gdmFsLnBhcnRzLnNsaWNlKDEpLmpvaW4oJy4nKTtcbiAgICAgICAgICB0aGlzLm9wY29kZSgncHVzaElkJywgJ0Jsb2NrUGFyYW0nLCBibG9ja1BhcmFtSW5kZXgsIGJsb2NrUGFyYW1DaGlsZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWwub3JpZ2luYWwgfHwgdmFsdWU7XG4gICAgICAgICAgaWYgKHZhbHVlLnJlcGxhY2UpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL150aGlzKD86XFwufCQpLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwuXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwuJC8sICcnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLm9wY29kZSgncHVzaElkJywgdmFsLnR5cGUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5hY2NlcHQodmFsKTtcbiAgICB9XG4gIH0sXG5cbiAgc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXM6IGZ1bmN0aW9uKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlLCBvbWl0RW1wdHkpIHtcbiAgICBsZXQgcGFyYW1zID0gc2V4cHIucGFyYW1zO1xuICAgIHRoaXMucHVzaFBhcmFtcyhwYXJhbXMpO1xuXG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgaW52ZXJzZSk7XG5cbiAgICBpZiAoc2V4cHIuaGFzaCkge1xuICAgICAgdGhpcy5hY2NlcHQoc2V4cHIuaGFzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3Bjb2RlKCdlbXB0eUhhc2gnLCBvbWl0RW1wdHkpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG4gIH0sXG5cbiAgYmxvY2tQYXJhbUluZGV4OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZm9yIChcbiAgICAgIGxldCBkZXB0aCA9IDAsIGxlbiA9IHRoaXMub3B0aW9ucy5ibG9ja1BhcmFtcy5sZW5ndGg7XG4gICAgICBkZXB0aCA8IGxlbjtcbiAgICAgIGRlcHRoKytcbiAgICApIHtcbiAgICAgIGxldCBibG9ja1BhcmFtcyA9IHRoaXMub3B0aW9ucy5ibG9ja1BhcmFtc1tkZXB0aF0sXG4gICAgICAgIHBhcmFtID0gYmxvY2tQYXJhbXMgJiYgaW5kZXhPZihibG9ja1BhcmFtcywgbmFtZSk7XG4gICAgICBpZiAoYmxvY2tQYXJhbXMgJiYgcGFyYW0gPj0gMCkge1xuICAgICAgICByZXR1cm4gW2RlcHRoLCBwYXJhbV07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcHJlY29tcGlsZShpbnB1dCwgb3B0aW9ucywgZW52KSB7XG4gIGlmIChcbiAgICBpbnB1dCA9PSBudWxsIHx8XG4gICAgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgJiYgaW5wdXQudHlwZSAhPT0gJ1Byb2dyYW0nKVxuICApIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgJ1lvdSBtdXN0IHBhc3MgYSBzdHJpbmcgb3IgSGFuZGxlYmFycyBBU1QgdG8gSGFuZGxlYmFycy5wcmVjb21waWxlLiBZb3UgcGFzc2VkICcgK1xuICAgICAgICBpbnB1dFxuICAgICk7XG4gIH1cblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgaWYgKCEoJ2RhdGEnIGluIG9wdGlvbnMpKSB7XG4gICAgb3B0aW9ucy5kYXRhID0gdHJ1ZTtcbiAgfVxuICBpZiAob3B0aW9ucy5jb21wYXQpIHtcbiAgICBvcHRpb25zLnVzZURlcHRocyA9IHRydWU7XG4gIH1cblxuICBsZXQgYXN0ID0gZW52LnBhcnNlKGlucHV0LCBvcHRpb25zKSxcbiAgICBlbnZpcm9ubWVudCA9IG5ldyBlbnYuQ29tcGlsZXIoKS5jb21waWxlKGFzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBuZXcgZW52LkphdmFTY3JpcHRDb21waWxlcigpLmNvbXBpbGUoZW52aXJvbm1lbnQsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZShpbnB1dCwgb3B0aW9ucyA9IHt9LCBlbnYpIHtcbiAgaWYgKFxuICAgIGlucHV0ID09IG51bGwgfHxcbiAgICAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyAmJiBpbnB1dC50eXBlICE9PSAnUHJvZ3JhbScpXG4gICkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXG4gICAgICAnWW91IG11c3QgcGFzcyBhIHN0cmluZyBvciBIYW5kbGViYXJzIEFTVCB0byBIYW5kbGViYXJzLmNvbXBpbGUuIFlvdSBwYXNzZWQgJyArXG4gICAgICAgIGlucHV0XG4gICAgKTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBleHRlbmQoe30sIG9wdGlvbnMpO1xuICBpZiAoISgnZGF0YScgaW4gb3B0aW9ucykpIHtcbiAgICBvcHRpb25zLmRhdGEgPSB0cnVlO1xuICB9XG4gIGlmIChvcHRpb25zLmNvbXBhdCkge1xuICAgIG9wdGlvbnMudXNlRGVwdGhzID0gdHJ1ZTtcbiAgfVxuXG4gIGxldCBjb21waWxlZDtcblxuICBmdW5jdGlvbiBjb21waWxlSW5wdXQoKSB7XG4gICAgbGV0IGFzdCA9IGVudi5wYXJzZShpbnB1dCwgb3B0aW9ucyksXG4gICAgICBlbnZpcm9ubWVudCA9IG5ldyBlbnYuQ29tcGlsZXIoKS5jb21waWxlKGFzdCwgb3B0aW9ucyksXG4gICAgICB0ZW1wbGF0ZVNwZWMgPSBuZXcgZW52LkphdmFTY3JpcHRDb21waWxlcigpLmNvbXBpbGUoXG4gICAgICAgIGVudmlyb25tZW50LFxuICAgICAgICBvcHRpb25zLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHRydWVcbiAgICAgICk7XG4gICAgcmV0dXJuIGVudi50ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMpO1xuICB9XG5cbiAgLy8gVGVtcGxhdGUgaXMgb25seSBjb21waWxlZCBvbiBmaXJzdCB1c2UgYW5kIGNhY2hlZCBhZnRlciB0aGF0IHBvaW50LlxuICBmdW5jdGlvbiByZXQoY29udGV4dCwgZXhlY09wdGlvbnMpIHtcbiAgICBpZiAoIWNvbXBpbGVkKSB7XG4gICAgICBjb21waWxlZCA9IGNvbXBpbGVJbnB1dCgpO1xuICAgIH1cbiAgICByZXR1cm4gY29tcGlsZWQuY2FsbCh0aGlzLCBjb250ZXh0LCBleGVjT3B0aW9ucyk7XG4gIH1cbiAgcmV0Ll9zZXR1cCA9IGZ1bmN0aW9uKHNldHVwT3B0aW9ucykge1xuICAgIGlmICghY29tcGlsZWQpIHtcbiAgICAgIGNvbXBpbGVkID0gY29tcGlsZUlucHV0KCk7XG4gICAgfVxuICAgIHJldHVybiBjb21waWxlZC5fc2V0dXAoc2V0dXBPcHRpb25zKTtcbiAgfTtcbiAgcmV0Ll9jaGlsZCA9IGZ1bmN0aW9uKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcbiAgICBpZiAoIWNvbXBpbGVkKSB7XG4gICAgICBjb21waWxlZCA9IGNvbXBpbGVJbnB1dCgpO1xuICAgIH1cbiAgICByZXR1cm4gY29tcGlsZWQuX2NoaWxkKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICB9O1xuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBhcmdFcXVhbHMoYSwgYikge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkoYSkgJiYgaXNBcnJheShiKSAmJiBhLmxlbmd0aCA9PT0gYi5sZW5ndGgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghYXJnRXF1YWxzKGFbaV0sIGJbaV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtTGl0ZXJhbFRvUGF0aChzZXhwcikge1xuICBpZiAoIXNleHByLnBhdGgucGFydHMpIHtcbiAgICBsZXQgbGl0ZXJhbCA9IHNleHByLnBhdGg7XG4gICAgLy8gQ2FzdGluZyB0byBzdHJpbmcgaGVyZSB0byBtYWtlIGZhbHNlIGFuZCAwIGxpdGVyYWwgdmFsdWVzIHBsYXkgbmljZWx5IHdpdGggdGhlIHJlc3RcbiAgICAvLyBvZiB0aGUgc3lzdGVtLlxuICAgIHNleHByLnBhdGggPSB7XG4gICAgICB0eXBlOiAnUGF0aEV4cHJlc3Npb24nLFxuICAgICAgZGF0YTogZmFsc2UsXG4gICAgICBkZXB0aDogMCxcbiAgICAgIHBhcnRzOiBbbGl0ZXJhbC5vcmlnaW5hbCArICcnXSxcbiAgICAgIG9yaWdpbmFsOiBsaXRlcmFsLm9yaWdpbmFsICsgJycsXG4gICAgICBsb2M6IGxpdGVyYWwubG9jXG4gICAgfTtcbiAgfVxufVxuIl19
