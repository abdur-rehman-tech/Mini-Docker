/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Diff", {
  enumerable: true,
  get: function get() {
    return _base["default"];
  }
});
Object.defineProperty(exports, "applyPatch", {
  enumerable: true,
  get: function get() {
    return _apply.applyPatch;
  }
});
Object.defineProperty(exports, "applyPatches", {
  enumerable: true,
  get: function get() {
    return _apply.applyPatches;
  }
});
Object.defineProperty(exports, "canonicalize", {
  enumerable: true,
  get: function get() {
    return _json.canonicalize;
  }
});
Object.defineProperty(exports, "convertChangesToDMP", {
  enumerable: true,
  get: function get() {
    return _dmp.convertChangesToDMP;
  }
});
Object.defineProperty(exports, "convertChangesToXML", {
  enumerable: true,
  get: function get() {
    return _xml.convertChangesToXML;
  }
});
Object.defineProperty(exports, "createPatch", {
  enumerable: true,
  get: function get() {
    return _create.createPatch;
  }
});
Object.defineProperty(exports, "createTwoFilesPatch", {
  enumerable: true,
  get: function get() {
    return _create.createTwoFilesPatch;
  }
});
Object.defineProperty(exports, "diffArrays", {
  enumerable: true,
  get: function get() {
    return _array.diffArrays;
  }
});
Object.defineProperty(exports, "diffChars", {
  enumerable: true,
  get: function get() {
    return _character.diffChars;
  }
});
Object.defineProperty(exports, "diffCss", {
  enumerable: true,
  get: function get() {
    return _css.diffCss;
  }
});
Object.defineProperty(exports, "diffJson", {
  enumerable: true,
  get: function get() {
    return _json.diffJson;
  }
});
Object.defineProperty(exports, "diffLines", {
  enumerable: true,
  get: function get() {
    return _line.diffLines;
  }
});
Object.defineProperty(exports, "diffSentences", {
  enumerable: true,
  get: function get() {
    return _sentence.diffSentences;
  }
});
Object.defineProperty(exports, "diffTrimmedLines", {
  enumerable: true,
  get: function get() {
    return _line.diffTrimmedLines;
  }
});
Object.defineProperty(exports, "diffWords", {
  enumerable: true,
  get: function get() {
    return _word.diffWords;
  }
});
Object.defineProperty(exports, "diffWordsWithSpace", {
  enumerable: true,
  get: function get() {
    return _word.diffWordsWithSpace;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function get() {
    return _merge.merge;
  }
});
Object.defineProperty(exports, "parsePatch", {
  enumerable: true,
  get: function get() {
    return _parse.parsePatch;
  }
});
Object.defineProperty(exports, "structuredPatch", {
  enumerable: true,
  get: function get() {
    return _create.structuredPatch;
  }
});
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./diff/base"))
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_character = require("./diff/character")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_word = require("./diff/word")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_line = require("./diff/line")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_sentence = require("./diff/sentence")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_css = require("./diff/css")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_json = require("./diff/json")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_array = require("./diff/array")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_apply = require("./patch/apply")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_parse = require("./patch/parse")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_merge = require("./patch/merge")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_create = require("./patch/create")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_dmp = require("./convert/dmp")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_xml = require("./convert/xml")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*istanbul ignore end*/
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFNlZSBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zIG9mIHVzZSAqL1xuXG4vKlxuICogVGV4dCBkaWZmIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIFRoaXMgbGlicmFyeSBzdXBwb3J0cyB0aGUgZm9sbG93aW5nIEFQSVM6XG4gKiBKc0RpZmYuZGlmZkNoYXJzOiBDaGFyYWN0ZXIgYnkgY2hhcmFjdGVyIGRpZmZcbiAqIEpzRGlmZi5kaWZmV29yZHM6IFdvcmQgKGFzIGRlZmluZWQgYnkgXFxiIHJlZ2V4KSBkaWZmIHdoaWNoIGlnbm9yZXMgd2hpdGVzcGFjZVxuICogSnNEaWZmLmRpZmZMaW5lczogTGluZSBiYXNlZCBkaWZmXG4gKlxuICogSnNEaWZmLmRpZmZDc3M6IERpZmYgdGFyZ2V0ZWQgYXQgQ1NTIGNvbnRlbnRcbiAqXG4gKiBUaGVzZSBtZXRob2RzIGFyZSBiYXNlZCBvbiB0aGUgaW1wbGVtZW50YXRpb24gcHJvcG9zZWQgaW5cbiAqIFwiQW4gTyhORCkgRGlmZmVyZW5jZSBBbGdvcml0aG0gYW5kIGl0cyBWYXJpYXRpb25zXCIgKE15ZXJzLCAxOTg2KS5cbiAqIGh0dHA6Ly9jaXRlc2VlcnguaXN0LnBzdS5lZHUvdmlld2RvYy9zdW1tYXJ5P2RvaT0xMC4xLjEuNC42OTI3XG4gKi9cbmltcG9ydCBEaWZmIGZyb20gJy4vZGlmZi9iYXNlJztcbmltcG9ydCB7ZGlmZkNoYXJzfSBmcm9tICcuL2RpZmYvY2hhcmFjdGVyJztcbmltcG9ydCB7ZGlmZldvcmRzLCBkaWZmV29yZHNXaXRoU3BhY2V9IGZyb20gJy4vZGlmZi93b3JkJztcbmltcG9ydCB7ZGlmZkxpbmVzLCBkaWZmVHJpbW1lZExpbmVzfSBmcm9tICcuL2RpZmYvbGluZSc7XG5pbXBvcnQge2RpZmZTZW50ZW5jZXN9IGZyb20gJy4vZGlmZi9zZW50ZW5jZSc7XG5cbmltcG9ydCB7ZGlmZkNzc30gZnJvbSAnLi9kaWZmL2Nzcyc7XG5pbXBvcnQge2RpZmZKc29uLCBjYW5vbmljYWxpemV9IGZyb20gJy4vZGlmZi9qc29uJztcblxuaW1wb3J0IHtkaWZmQXJyYXlzfSBmcm9tICcuL2RpZmYvYXJyYXknO1xuXG5pbXBvcnQge2FwcGx5UGF0Y2gsIGFwcGx5UGF0Y2hlc30gZnJvbSAnLi9wYXRjaC9hcHBseSc7XG5pbXBvcnQge3BhcnNlUGF0Y2h9IGZyb20gJy4vcGF0Y2gvcGFyc2UnO1xuaW1wb3J0IHttZXJnZX0gZnJvbSAnLi9wYXRjaC9tZXJnZSc7XG5pbXBvcnQge3N0cnVjdHVyZWRQYXRjaCwgY3JlYXRlVHdvRmlsZXNQYXRjaCwgY3JlYXRlUGF0Y2h9IGZyb20gJy4vcGF0Y2gvY3JlYXRlJztcblxuaW1wb3J0IHtjb252ZXJ0Q2hhbmdlc1RvRE1QfSBmcm9tICcuL2NvbnZlcnQvZG1wJztcbmltcG9ydCB7Y29udmVydENoYW5nZXNUb1hNTH0gZnJvbSAnLi9jb252ZXJ0L3htbCc7XG5cbmV4cG9ydCB7XG4gIERpZmYsXG5cbiAgZGlmZkNoYXJzLFxuICBkaWZmV29yZHMsXG4gIGRpZmZXb3Jkc1dpdGhTcGFjZSxcbiAgZGlmZkxpbmVzLFxuICBkaWZmVHJpbW1lZExpbmVzLFxuICBkaWZmU2VudGVuY2VzLFxuXG4gIGRpZmZDc3MsXG4gIGRpZmZKc29uLFxuXG4gIGRpZmZBcnJheXMsXG5cbiAgc3RydWN0dXJlZFBhdGNoLFxuICBjcmVhdGVUd29GaWxlc1BhdGNoLFxuICBjcmVhdGVQYXRjaCxcbiAgYXBwbHlQYXRjaCxcbiAgYXBwbHlQYXRjaGVzLFxuICBwYXJzZVBhdGNoLFxuICBtZXJnZSxcbiAgY29udmVydENoYW5nZXNUb0RNUCxcbiAgY29udmVydENoYW5nZXNUb1hNTCxcbiAgY2Fub25pY2FsaXplXG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWtEO0FBQUEifQ==