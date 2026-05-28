/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var AST = {
  // Public API used to evaluate derived attributes regarding AST nodes
  helpers: {
    // a mustache is definitely a helper if:
    // * it is an eligible helper, and
    // * it has at least one parameter or hash segment
    helperExpression: function
    /*istanbul ignore next*/
    helperExpression(node) {
      return node.type === 'SubExpression' || (node.type === 'MustacheStatement' || node.type === 'BlockStatement') && !!(node.params && node.params.length || node.hash);
    },
    scopedId: function
    /*istanbul ignore next*/
    scopedId(path) {
      return /^\.|this\b/.test(path.original);
    },
    // an ID is simple if it only has one part, and that part is not
    // `..` or `this`.
    simpleId: function
    /*istanbul ignore next*/
    simpleId(path) {
      return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
    }
  }
}; // Must be exported as an object rather than the root of the module as the jison lexer
// must modify the object to operate properly.

/*istanbul ignore next*/
var _default = AST;

/*istanbul ignore next*/
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2NvbXBpbGVyL2FzdC5qcyJdLCJuYW1lcyI6WyJBU1QiLCJoZWxwZXJzIiwiaGVscGVyRXhwcmVzc2lvbiIsIm5vZGUiLCJ0eXBlIiwicGFyYW1zIiwibGVuZ3RoIiwiaGFzaCIsInNjb3BlZElkIiwicGF0aCIsInRlc3QiLCJvcmlnaW5hbCIsInNpbXBsZUlkIiwicGFydHMiLCJkZXB0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLElBQUlBLEdBQUcsR0FBRztBQUNSO0FBQ0FDLEVBQUFBLE9BQU8sRUFBRTtBQUNQO0FBQ0E7QUFDQTtBQUNBQyxJQUFBQSxnQkFBZ0IsRUFBRTtBQUFBO0FBQUEscUJBQVNDLElBQVQsRUFBZTtBQUMvQixhQUNFQSxJQUFJLENBQUNDLElBQUwsS0FBYyxlQUFkLElBQ0MsQ0FBQ0QsSUFBSSxDQUFDQyxJQUFMLEtBQWMsbUJBQWQsSUFDQUQsSUFBSSxDQUFDQyxJQUFMLEtBQWMsZ0JBRGYsS0FFQyxDQUFDLEVBQUdELElBQUksQ0FBQ0UsTUFBTCxJQUFlRixJQUFJLENBQUNFLE1BQUwsQ0FBWUMsTUFBNUIsSUFBdUNILElBQUksQ0FBQ0ksSUFBOUMsQ0FKTDtBQU1ELEtBWE07QUFhUEMsSUFBQUEsUUFBUSxFQUFFO0FBQUE7QUFBQSxhQUFTQyxJQUFULEVBQWU7QUFDdkIsYUFBTyxhQUFhQyxJQUFiLENBQWtCRCxJQUFJLENBQUNFLFFBQXZCLENBQVA7QUFDRCxLQWZNO0FBaUJQO0FBQ0E7QUFDQUMsSUFBQUEsUUFBUSxFQUFFO0FBQUE7QUFBQSxhQUFTSCxJQUFULEVBQWU7QUFDdkIsYUFDRUEsSUFBSSxDQUFDSSxLQUFMLENBQVdQLE1BQVgsS0FBc0IsQ0FBdEIsSUFBMkIsQ0FBQ04sR0FBRyxDQUFDQyxPQUFKLENBQVlPLFFBQVosQ0FBcUJDLElBQXJCLENBQTVCLElBQTBELENBQUNBLElBQUksQ0FBQ0ssS0FEbEU7QUFHRDtBQXZCTTtBQUZELENBQVYsQyxDQTZCQTtBQUNBOzs7ZUFDZWQsRyIsInNvdXJjZXNDb250ZW50IjpbImxldCBBU1QgPSB7XG4gIC8vIFB1YmxpYyBBUEkgdXNlZCB0byBldmFsdWF0ZSBkZXJpdmVkIGF0dHJpYnV0ZXMgcmVnYXJkaW5nIEFTVCBub2Rlc1xuICBoZWxwZXJzOiB7XG4gICAgLy8gYSBtdXN0YWNoZSBpcyBkZWZpbml0ZWx5IGEgaGVscGVyIGlmOlxuICAgIC8vICogaXQgaXMgYW4gZWxpZ2libGUgaGVscGVyLCBhbmRcbiAgICAvLyAqIGl0IGhhcyBhdCBsZWFzdCBvbmUgcGFyYW1ldGVyIG9yIGhhc2ggc2VnbWVudFxuICAgIGhlbHBlckV4cHJlc3Npb246IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIG5vZGUudHlwZSA9PT0gJ1N1YkV4cHJlc3Npb24nIHx8XG4gICAgICAgICgobm9kZS50eXBlID09PSAnTXVzdGFjaGVTdGF0ZW1lbnQnIHx8XG4gICAgICAgICAgbm9kZS50eXBlID09PSAnQmxvY2tTdGF0ZW1lbnQnKSAmJlxuICAgICAgICAgICEhKChub2RlLnBhcmFtcyAmJiBub2RlLnBhcmFtcy5sZW5ndGgpIHx8IG5vZGUuaGFzaCkpXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBzY29wZWRJZDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgcmV0dXJuIC9eXFwufHRoaXNcXGIvLnRlc3QocGF0aC5vcmlnaW5hbCk7XG4gICAgfSxcblxuICAgIC8vIGFuIElEIGlzIHNpbXBsZSBpZiBpdCBvbmx5IGhhcyBvbmUgcGFydCwgYW5kIHRoYXQgcGFydCBpcyBub3RcbiAgICAvLyBgLi5gIG9yIGB0aGlzYC5cbiAgICBzaW1wbGVJZDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgcGF0aC5wYXJ0cy5sZW5ndGggPT09IDEgJiYgIUFTVC5oZWxwZXJzLnNjb3BlZElkKHBhdGgpICYmICFwYXRoLmRlcHRoXG4gICAgICApO1xuICAgIH1cbiAgfVxufTtcblxuLy8gTXVzdCBiZSBleHBvcnRlZCBhcyBhbiBvYmplY3QgcmF0aGVyIHRoYW4gdGhlIHJvb3Qgb2YgdGhlIG1vZHVsZSBhcyB0aGUgamlzb24gbGV4ZXJcbi8vIG11c3QgbW9kaWZ5IHRoZSBvYmplY3QgdG8gb3BlcmF0ZSBwcm9wZXJseS5cbmV4cG9ydCBkZWZhdWx0IEFTVDtcbiJdfQ==
