/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var
/*istanbul ignore next*/
_exception = _interopRequireDefault(require("../exception"));

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Visitor() {
  this.parents = [];
}

Visitor.prototype = {
  constructor: Visitor,
  mutating: false,
  // Visits a given value. If mutating, will replace the value if necessary.
  acceptKey: function
  /*istanbul ignore next*/
  acceptKey(node, name) {
    var value = this.accept(node[name]);

    if (this.mutating) {
      // Hacky sanity check: This may have a few false positives for type for the helper
      // methods but will generally do the right thing without a lot of overhead.
      if (value && !Visitor.prototype[value.type]) {
        throw new
        /*istanbul ignore next*/
        _exception[
        /*istanbul ignore next*/
        "default"]('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
      }

      node[name] = value;
    }
  },
  // Performs an accept operation with added sanity check to ensure
  // required keys are not removed.
  acceptRequired: function
  /*istanbul ignore next*/
  acceptRequired(node, name) {
    this.acceptKey(node, name);

    if (!node[name]) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"](node.type + ' requires ' + name);
    }
  },
  // Traverses a given array. If mutating, empty respnses will be removed
  // for child elements.
  acceptArray: function
  /*istanbul ignore next*/
  acceptArray(array) {
    for (var i = 0, l = array.length; i < l; i++) {
      this.acceptKey(array, i);

      if (!array[i]) {
        array.splice(i, 1);
        i--;
        l--;
      }
    }
  },
  accept: function
  /*istanbul ignore next*/
  accept(object) {
    if (!object) {
      return;
    }
    /* istanbul ignore next: Sanity code */


    if (!this[object.type]) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('Unknown type: ' + object.type, object);
    }

    if (this.current) {
      this.parents.unshift(this.current);
    }

    this.current = object;
    var ret = this[object.type](object);
    this.current = this.parents.shift();

    if (!this.mutating || ret) {
      return ret;
    } else if (ret !== false) {
      return object;
    }
  },
  Program: function
  /*istanbul ignore next*/
  Program(program) {
    this.acceptArray(program.body);
  },
  MustacheStatement: visitSubExpression,
  Decorator: visitSubExpression,
  BlockStatement: visitBlock,
  DecoratorBlock: visitBlock,
  PartialStatement: visitPartial,
  PartialBlockStatement: function
  /*istanbul ignore next*/
  PartialBlockStatement(partial) {
    visitPartial.call(this, partial);
    this.acceptKey(partial, 'program');
  },
  ContentStatement: function
  /*istanbul ignore next*/
  ContentStatement()
  /* content */
  {},
  CommentStatement: function
  /*istanbul ignore next*/
  CommentStatement()
  /* comment */
  {},
  SubExpression: visitSubExpression,
  PathExpression: function
  /*istanbul ignore next*/
  PathExpression()
  /* path */
  {},
  StringLiteral: function
  /*istanbul ignore next*/
  StringLiteral()
  /* string */
  {},
  NumberLiteral: function
  /*istanbul ignore next*/
  NumberLiteral()
  /* number */
  {},
  BooleanLiteral: function
  /*istanbul ignore next*/
  BooleanLiteral()
  /* bool */
  {},
  UndefinedLiteral: function
  /*istanbul ignore next*/
  UndefinedLiteral()
  /* literal */
  {},
  NullLiteral: function
  /*istanbul ignore next*/
  NullLiteral()
  /* literal */
  {},
  Hash: function
  /*istanbul ignore next*/
  Hash(hash) {
    this.acceptArray(hash.pairs);
  },
  HashPair: function
  /*istanbul ignore next*/
  HashPair(pair) {
    this.acceptRequired(pair, 'value');
  }
};

function visitSubExpression(mustache) {
  this.acceptRequired(mustache, 'path');
  this.acceptArray(mustache.params);
  this.acceptKey(mustache, 'hash');
}

function visitBlock(block) {
  visitSubExpression.call(this, block);
  this.acceptKey(block, 'program');
  this.acceptKey(block, 'inverse');
}

function visitPartial(partial) {
  this.acceptRequired(partial, 'name');
  this.acceptArray(partial.params);
  this.acceptKey(partial, 'hash');
}

/*istanbul ignore next*/
var _default = Visitor;

/*istanbul ignore next*/
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2NvbXBpbGVyL3Zpc2l0b3IuanMiXSwibmFtZXMiOlsiVmlzaXRvciIsInBhcmVudHMiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsIm11dGF0aW5nIiwiYWNjZXB0S2V5Iiwibm9kZSIsIm5hbWUiLCJ2YWx1ZSIsImFjY2VwdCIsInR5cGUiLCJFeGNlcHRpb24iLCJhY2NlcHRSZXF1aXJlZCIsImFjY2VwdEFycmF5IiwiYXJyYXkiLCJpIiwibCIsImxlbmd0aCIsInNwbGljZSIsIm9iamVjdCIsImN1cnJlbnQiLCJ1bnNoaWZ0IiwicmV0Iiwic2hpZnQiLCJQcm9ncmFtIiwicHJvZ3JhbSIsImJvZHkiLCJNdXN0YWNoZVN0YXRlbWVudCIsInZpc2l0U3ViRXhwcmVzc2lvbiIsIkRlY29yYXRvciIsIkJsb2NrU3RhdGVtZW50IiwidmlzaXRCbG9jayIsIkRlY29yYXRvckJsb2NrIiwiUGFydGlhbFN0YXRlbWVudCIsInZpc2l0UGFydGlhbCIsIlBhcnRpYWxCbG9ja1N0YXRlbWVudCIsInBhcnRpYWwiLCJjYWxsIiwiQ29udGVudFN0YXRlbWVudCIsIkNvbW1lbnRTdGF0ZW1lbnQiLCJTdWJFeHByZXNzaW9uIiwiUGF0aEV4cHJlc3Npb24iLCJTdHJpbmdMaXRlcmFsIiwiTnVtYmVyTGl0ZXJhbCIsIkJvb2xlYW5MaXRlcmFsIiwiVW5kZWZpbmVkTGl0ZXJhbCIsIk51bGxMaXRlcmFsIiwiSGFzaCIsImhhc2giLCJwYWlycyIsIkhhc2hQYWlyIiwicGFpciIsIm11c3RhY2hlIiwicGFyYW1zIiwiYmxvY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOzs7O0FBRUEsU0FBU0EsT0FBVCxHQUFtQjtBQUNqQixPQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNEOztBQUVERCxPQUFPLENBQUNFLFNBQVIsR0FBb0I7QUFDbEJDLEVBQUFBLFdBQVcsRUFBRUgsT0FESztBQUVsQkksRUFBQUEsUUFB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QjtBQTJHbEJDLEVBQUFBLFFBQVEsRUFBRTtBQUFBO0FBQUEsV0FBU0MsSUFBVCxFQUFlO0FBQ3ZCLFNBQUt2QyxjQUFMLENBQW9CdUMsSUFBcEIsRUFBMEIsT0FBMUI7QUFDRDtBQTdHaUIsQ0FBcEI7O0FBZ0hBLFNBQVN2QixrQkFBVCxDQUE0QndCLFFBQTVCLEVBQXNDO0FBQ3BDLE9BQUt4QyxjQUFMLENBQW9Cd0MsUUFBcEIsRUFBOEIsTUFBOUI7QUFDQSxPQUFLdkMsV0FBTCxDQUFpQnVDLFFBQVEsQ0FBQ0MsTUFBMUI7QUFDQSxPQUFLaEQsU0FBTCxDQUFlK0MsUUFBZixFQUF5QixNQUF6QjtBQUNEOztBQUNELFNBQVNyQixVQUFULENBQW9CdUIsS0FBcEIsRUFBMkI7QUFDekIxQixFQUFBQSxrQkFBa0IsQ0FBQ1MsSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEJpQixLQUE5QjtBQUVBLE9BQUtqRCxTQUFMLENBQWVpRCxLQUFmLEVBQXNCLFNBQXRCO0FBQ0EsT0FBS2pELFNBQUwsQ0FBZWlELEtBQWYsRUFBc0IsU0FBdEI7QUFDRDs7QUFDRCxTQUFTcEIsWUFBVCxDQUFzQkUsT0FBdEIsRUFBK0I7QUFDN0IsT0FBS3hCLGNBQUwsQ0FBb0J3QixPQUFwQixFQUE2QixNQUE3QjtBQUNBLE9BQUt2QixXQUFMLENBQWlCdUIsT0FBTyxDQUFDaUIsTUFBekI7QUFDQSxPQUFLaEQsU0FBTCxDQUFlK0IsT0FBZixFQUF3QixNQUF4QjtBQUNEOzs7ZUFFY3BDLE8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4uL2V4Y2VwdGlvbic7XG5cbmZ1bmN0aW9uIFZpc2l0b3IoKSB7XG4gIHRoaXMucGFyZW50cyA9IFtdO1xufVxuXG5WaXNpdG9yLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFZpc2l0b3IsXG4gIG11dGF0aW5nOiBmYWxzZSxcblxuICAvLyBWaXNpdHMgYSBnaXZlbiB2YWx1ZS4gSWYgbXV0YXRpbmcsIHdpbGwgcmVwbGFjZSB0aGUgdmFsdWUgaWYgbmVjZXNzYXJ5LlxuICBhY2NlcHRLZXk6IGZ1bmN0aW9uKG5vZGUsIG5hbWUpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmFjY2VwdChub2RlW25hbWVdKTtcbiAgICBpZiAodGhpcy5tdXRhdGluZykge1xuICAgICAgLy8gSGFja3kgc2FuaXR5IGNoZWNrOiBUaGlzIG1heSBoYXZlIGEgZmV3IGZhbHNlIHBvc2l0aXZlcyBmb3IgdHlwZSBmb3IgdGhlIGhlbHBlclxuICAgICAgLy8gbWV0aG9kcyBidXQgd2lsbCBnZW5lcmFsbHkgZG8gdGhlIHJpZ2h0IHRoaW5nIHdpdGhvdXQgYSBsb3Qgb2Ygb3ZlcmhlYWQuXG4gICAgICBpZiAodmFsdWUgJiYgIVZpc2l0b3IucHJvdG90eXBlW3ZhbHVlLnR5cGVdKSB7XG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgbm9kZSB0eXBlIFwiJyArXG4gICAgICAgICAgICB2YWx1ZS50eXBlICtcbiAgICAgICAgICAgICdcIiBmb3VuZCB3aGVuIGFjY2VwdGluZyAnICtcbiAgICAgICAgICAgIG5hbWUgK1xuICAgICAgICAgICAgJyBvbiAnICtcbiAgICAgICAgICAgIG5vZGUudHlwZVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgbm9kZVtuYW1lXSA9IHZhbHVlO1xuICAgIH1cbiAgfSxcblxuICAvLyBQZXJmb3JtcyBhbiBhY2NlcHQgb3BlcmF0aW9uIHdpdGggYWRkZWQgc2FuaXR5IGNoZWNrIHRvIGVuc3VyZVxuICAvLyByZXF1aXJlZCBrZXlzIGFyZSBub3QgcmVtb3ZlZC5cbiAgYWNjZXB0UmVxdWlyZWQ6IGZ1bmN0aW9uKG5vZGUsIG5hbWUpIHtcbiAgICB0aGlzLmFjY2VwdEtleShub2RlLCBuYW1lKTtcblxuICAgIGlmICghbm9kZVtuYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihub2RlLnR5cGUgKyAnIHJlcXVpcmVzICcgKyBuYW1lKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gVHJhdmVyc2VzIGEgZ2l2ZW4gYXJyYXkuIElmIG11dGF0aW5nLCBlbXB0eSByZXNwbnNlcyB3aWxsIGJlIHJlbW92ZWRcbiAgLy8gZm9yIGNoaWxkIGVsZW1lbnRzLlxuICBhY2NlcHRBcnJheTogZnVuY3Rpb24oYXJyYXkpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5hY2NlcHRLZXkoYXJyYXksIGkpO1xuXG4gICAgICBpZiAoIWFycmF5W2ldKSB7XG4gICAgICAgIGFycmF5LnNwbGljZShpLCAxKTtcbiAgICAgICAgaS0tO1xuICAgICAgICBsLS07XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGFjY2VwdDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogU2FuaXR5IGNvZGUgKi9cbiAgICBpZiAoIXRoaXNbb2JqZWN0LnR5cGVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdVbmtub3duIHR5cGU6ICcgKyBvYmplY3QudHlwZSwgb2JqZWN0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudHMudW5zaGlmdCh0aGlzLmN1cnJlbnQpO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnQgPSBvYmplY3Q7XG5cbiAgICBsZXQgcmV0ID0gdGhpc1tvYmplY3QudHlwZV0ob2JqZWN0KTtcblxuICAgIHRoaXMuY3VycmVudCA9IHRoaXMucGFyZW50cy5zaGlmdCgpO1xuXG4gICAgaWYgKCF0aGlzLm11dGF0aW5nIHx8IHJldCkge1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9IGVsc2UgaWYgKHJldCAhPT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICB9LFxuXG4gIFByb2dyYW06IGZ1bmN0aW9uKHByb2dyYW0pIHtcbiAgICB0aGlzLmFjY2VwdEFycmF5KHByb2dyYW0uYm9keSk7XG4gIH0sXG5cbiAgTXVzdGFjaGVTdGF0ZW1lbnQ6IHZpc2l0U3ViRXhwcmVzc2lvbixcbiAgRGVjb3JhdG9yOiB2aXNpdFN1YkV4cHJlc3Npb24sXG5cbiAgQmxvY2tTdGF0ZW1lbnQ6IHZpc2l0QmxvY2ssXG4gIERlY29yYXRvckJsb2NrOiB2aXNpdEJsb2NrLFxuXG4gIFBhcnRpYWxTdGF0ZW1lbnQ6IHZpc2l0UGFydGlhbCxcbiAgUGFydGlhbEJsb2NrU3RhdGVtZW50OiBmdW5jdGlvbihwYXJ0aWFsKSB7XG4gICAgdmlzaXRQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCk7XG5cbiAgICB0aGlzLmFjY2VwdEtleShwYXJ0aWFsLCAncHJvZ3JhbScpO1xuICB9LFxuXG4gIENvbnRlbnRTdGF0ZW1lbnQ6IGZ1bmN0aW9uKC8qIGNvbnRlbnQgKi8pIHt9LFxuICBDb21tZW50U3RhdGVtZW50OiBmdW5jdGlvbigvKiBjb21tZW50ICovKSB7fSxcblxuICBTdWJFeHByZXNzaW9uOiB2aXNpdFN1YkV4cHJlc3Npb24sXG5cbiAgUGF0aEV4cHJlc3Npb246IGZ1bmN0aW9uKC8qIHBhdGggKi8pIHt9LFxuXG4gIFN0cmluZ0xpdGVyYWw6IGZ1bmN0aW9uKC8qIHN0cmluZyAqLykge30sXG4gIE51bWJlckxpdGVyYWw6IGZ1bmN0aW9uKC8qIG51bWJlciAqLykge30sXG4gIEJvb2xlYW5MaXRlcmFsOiBmdW5jdGlvbigvKiBib29sICovKSB7fSxcbiAgVW5kZWZpbmVkTGl0ZXJhbDogZnVuY3Rpb24oLyogbGl0ZXJhbCAqLykge30sXG4gIE51bGxMaXRlcmFsOiBmdW5jdGlvbigvKiBsaXRlcmFsICovKSB7fSxcblxuICBIYXNoOiBmdW5jdGlvbihoYXNoKSB7XG4gICAgdGhpcy5hY2NlcHRBcnJheShoYXNoLnBhaXJzKTtcbiAgfSxcbiAgSGFzaFBhaXI6IGZ1bmN0aW9uKHBhaXIpIHtcbiAgICB0aGlzLmFjY2VwdFJlcXVpcmVkKHBhaXIsICd2YWx1ZScpO1xuICB9XG59O1xuXG5mdW5jdGlvbiB2aXNpdFN1YkV4cHJlc3Npb24obXVzdGFjaGUpIHtcbiAgdGhpcy5hY2NlcHRSZXF1aXJlZChtdXN0YWNoZSwgJ3BhdGgnKTtcbiAgdGhpcy5hY2NlcHRBcnJheShtdXN0YWNoZS5wYXJhbXMpO1xuICB0aGlzLmFjY2VwdEtleShtdXN0YWNoZSwgJ2hhc2gnKTtcbn1cbmZ1bmN0aW9uIHZpc2l0QmxvY2soYmxvY2spIHtcbiAgdmlzaXRTdWJFeHByZXNzaW9uLmNhbGwodGhpcywgYmxvY2spO1xuXG4gIHRoaXMuYWNjZXB0S2V5KGJsb2NrLCAncHJvZ3JhbScpO1xuICB0aGlzLmFjY2VwdEtleShibG9jaywgJ2ludmVyc2UnKTtcbn1cbmZ1bmN0aW9uIHZpc2l0UGFydGlhbChwYXJ0aWFsKSB7XG4gIHRoaXMuYWNjZXB0UmVxdWlyZWQocGFydGlhbCwgJ25hbWUnKTtcbiAgdGhpcy5hY2NlcHRBcnJheShwYXJ0aWFsLnBhcmFtcyk7XG4gIHRoaXMuYWNjZXB0S2V5KHBhcnRpYWwsICdoYXNoJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFZpc2l0b3I7XG4iXX0=
