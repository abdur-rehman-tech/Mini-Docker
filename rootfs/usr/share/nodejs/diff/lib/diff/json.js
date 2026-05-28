/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canonicalize = canonicalize;
exports.diffJson = diffJson;
exports.jsonDiff = void 0;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_line = require("./line")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/*istanbul ignore end*/
var objectPrototypeToString = Object.prototype.toString;
var jsonDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();
// Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:
/*istanbul ignore start*/
exports.jsonDiff = jsonDiff;
/*istanbul ignore end*/
jsonDiff.useLongestToken = true;
jsonDiff.tokenize =
/*istanbul ignore start*/
_line
/*istanbul ignore end*/
.
/*istanbul ignore start*/
lineDiff
/*istanbul ignore end*/
.tokenize;
jsonDiff.castInput = function (value) {
  var
    /*istanbul ignore start*/
    _this$options =
    /*istanbul ignore end*/
    this.options,
    /*istanbul ignore start*/
    /*istanbul ignore end*/
    undefinedReplacement = _this$options.undefinedReplacement,
    /*istanbul ignore start*/
    _this$options$stringi = _this$options.
    /*istanbul ignore end*/
    stringifyReplacer,
    /*istanbul ignore start*/
    /*istanbul ignore end*/
    stringifyReplacer = _this$options$stringi === void 0 ? function (k, v)
    /*istanbul ignore start*/
    {
      return (
        /*istanbul ignore end*/
        typeof v === 'undefined' ? undefinedReplacement : v
      );
    } : _this$options$stringi;
  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');
};
jsonDiff.equals = function (left, right) {
  return (
    /*istanbul ignore start*/
    _base
    /*istanbul ignore end*/
    [
    /*istanbul ignore start*/
    "default"
    /*istanbul ignore end*/
    ].prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'))
  );
};
function diffJson(oldObj, newObj, options) {
  return jsonDiff.diff(oldObj, newObj, options);
}

// This function handles the presence of circular references by bailing out when encountering an
// object that is already on the "stack" of items being processed. Accepts an optional replacer
function canonicalize(obj, stack, replacementStack, replacer, key) {
  stack = stack || [];
  replacementStack = replacementStack || [];
  if (replacer) {
    obj = replacer(key, obj);
  }
  var i;
  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }
  var canonicalizedObj;
  if ('[object Array]' === objectPrototypeToString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);
    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
    }
    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }
  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }
  if (
  /*istanbul ignore start*/
  _typeof(
  /*istanbul ignore end*/
  obj) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);
    var sortedKeys = [],
      _key;
    for (_key in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key);
      }
    }
    sortedKeys.sort();
    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }
    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }
  return canonicalizedObj;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJvYmplY3RQcm90b3R5cGVUb1N0cmluZyIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwianNvbkRpZmYiLCJEaWZmIiwidXNlTG9uZ2VzdFRva2VuIiwidG9rZW5pemUiLCJsaW5lRGlmZiIsImNhc3RJbnB1dCIsInZhbHVlIiwib3B0aW9ucyIsInVuZGVmaW5lZFJlcGxhY2VtZW50Iiwic3RyaW5naWZ5UmVwbGFjZXIiLCJrIiwidiIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYW5vbmljYWxpemUiLCJlcXVhbHMiLCJsZWZ0IiwicmlnaHQiLCJjYWxsIiwicmVwbGFjZSIsImRpZmZKc29uIiwib2xkT2JqIiwibmV3T2JqIiwiZGlmZiIsIm9iaiIsInN0YWNrIiwicmVwbGFjZW1lbnRTdGFjayIsInJlcGxhY2VyIiwia2V5IiwiaSIsImxlbmd0aCIsImNhbm9uaWNhbGl6ZWRPYmoiLCJwdXNoIiwiQXJyYXkiLCJwb3AiLCJ0b0pTT04iLCJzb3J0ZWRLZXlzIiwiaGFzT3duUHJvcGVydHkiLCJzb3J0Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RpZmYvanNvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtsaW5lRGlmZn0gZnJvbSAnLi9saW5lJztcblxuY29uc3Qgb2JqZWN0UHJvdG90eXBlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5cbmV4cG9ydCBjb25zdCBqc29uRGlmZiA9IG5ldyBEaWZmKCk7XG4vLyBEaXNjcmltaW5hdGUgYmV0d2VlbiB0d28gbGluZXMgb2YgcHJldHR5LXByaW50ZWQsIHNlcmlhbGl6ZWQgSlNPTiB3aGVyZSBvbmUgb2YgdGhlbSBoYXMgYVxuLy8gZGFuZ2xpbmcgY29tbWEgYW5kIHRoZSBvdGhlciBkb2Vzbid0LiBUdXJucyBvdXQgaW5jbHVkaW5nIHRoZSBkYW5nbGluZyBjb21tYSB5aWVsZHMgdGhlIG5pY2VzdCBvdXRwdXQ6XG5qc29uRGlmZi51c2VMb25nZXN0VG9rZW4gPSB0cnVlO1xuXG5qc29uRGlmZi50b2tlbml6ZSA9IGxpbmVEaWZmLnRva2VuaXplO1xuanNvbkRpZmYuY2FzdElucHV0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgY29uc3Qge3VuZGVmaW5lZFJlcGxhY2VtZW50LCBzdHJpbmdpZnlSZXBsYWNlciA9IChrLCB2KSA9PiB0eXBlb2YgdiA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWRSZXBsYWNlbWVudCA6IHZ9ID0gdGhpcy5vcHRpb25zO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeShjYW5vbmljYWxpemUodmFsdWUsIG51bGwsIG51bGwsIHN0cmluZ2lmeVJlcGxhY2VyKSwgc3RyaW5naWZ5UmVwbGFjZXIsICcgICcpO1xufTtcbmpzb25EaWZmLmVxdWFscyA9IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gIHJldHVybiBEaWZmLnByb3RvdHlwZS5lcXVhbHMuY2FsbChqc29uRGlmZiwgbGVmdC5yZXBsYWNlKC8sKFtcXHJcXG5dKS9nLCAnJDEnKSwgcmlnaHQucmVwbGFjZSgvLChbXFxyXFxuXSkvZywgJyQxJykpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZKc29uKG9sZE9iaiwgbmV3T2JqLCBvcHRpb25zKSB7IHJldHVybiBqc29uRGlmZi5kaWZmKG9sZE9iaiwgbmV3T2JqLCBvcHRpb25zKTsgfVxuXG4vLyBUaGlzIGZ1bmN0aW9uIGhhbmRsZXMgdGhlIHByZXNlbmNlIG9mIGNpcmN1bGFyIHJlZmVyZW5jZXMgYnkgYmFpbGluZyBvdXQgd2hlbiBlbmNvdW50ZXJpbmcgYW5cbi8vIG9iamVjdCB0aGF0IGlzIGFscmVhZHkgb24gdGhlIFwic3RhY2tcIiBvZiBpdGVtcyBiZWluZyBwcm9jZXNzZWQuIEFjY2VwdHMgYW4gb3B0aW9uYWwgcmVwbGFjZXJcbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxpemUob2JqLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIGtleSkge1xuICBzdGFjayA9IHN0YWNrIHx8IFtdO1xuICByZXBsYWNlbWVudFN0YWNrID0gcmVwbGFjZW1lbnRTdGFjayB8fCBbXTtcblxuICBpZiAocmVwbGFjZXIpIHtcbiAgICBvYmogPSByZXBsYWNlcihrZXksIG9iaik7XG4gIH1cblxuICBsZXQgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAoc3RhY2tbaV0gPT09IG9iaikge1xuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50U3RhY2tbaV07XG4gICAgfVxuICB9XG5cbiAgbGV0IGNhbm9uaWNhbGl6ZWRPYmo7XG5cbiAgaWYgKCdbb2JqZWN0IEFycmF5XScgPT09IG9iamVjdFByb3RvdHlwZVRvU3RyaW5nLmNhbGwob2JqKSkge1xuICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICBjYW5vbmljYWxpemVkT2JqID0gbmV3IEFycmF5KG9iai5sZW5ndGgpO1xuICAgIHJlcGxhY2VtZW50U3RhY2sucHVzaChjYW5vbmljYWxpemVkT2JqKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjYW5vbmljYWxpemVkT2JqW2ldID0gY2Fub25pY2FsaXplKG9ialtpXSwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBrZXkpO1xuICAgIH1cbiAgICBzdGFjay5wb3AoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnBvcCgpO1xuICAgIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xuICB9XG5cbiAgaWYgKG9iaiAmJiBvYmoudG9KU09OKSB7XG4gICAgb2JqID0gb2JqLnRvSlNPTigpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkge1xuICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICBjYW5vbmljYWxpemVkT2JqID0ge307XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wdXNoKGNhbm9uaWNhbGl6ZWRPYmopO1xuICAgIGxldCBzb3J0ZWRLZXlzID0gW10sXG4gICAgICAgIGtleTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgc29ydGVkS2V5cy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNvcnRlZEtleXMuc29ydCgpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBzb3J0ZWRLZXlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBrZXkgPSBzb3J0ZWRLZXlzW2ldO1xuICAgICAgY2Fub25pY2FsaXplZE9ialtrZXldID0gY2Fub25pY2FsaXplKG9ialtrZXldLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIGtleSk7XG4gICAgfVxuICAgIHN0YWNrLnBvcCgpO1xuICAgIHJlcGxhY2VtZW50U3RhY2sucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgY2Fub25pY2FsaXplZE9iaiA9IG9iajtcbiAgfVxuICByZXR1cm4gY2Fub25pY2FsaXplZE9iajtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWdDO0FBQUE7QUFBQTtBQUVoQyxJQUFNQSx1QkFBdUIsR0FBR0MsTUFBTSxDQUFDQyxTQUFTLENBQUNDLFFBQVE7QUFHbEQsSUFBTUMsUUFBUSxHQUFHO0FBQUlDO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBLENBQUksRUFBRTtBQUNsQztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0FELFFBQVEsQ0FBQ0UsZUFBZSxHQUFHLElBQUk7QUFFL0JGLFFBQVEsQ0FBQ0csUUFBUTtBQUFHQztBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFRO0FB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