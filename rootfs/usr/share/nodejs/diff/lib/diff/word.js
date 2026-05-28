/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffWords = diffWords;
exports.diffWordsWithSpace = diffWordsWithSpace;
exports.wordDiff = void 0;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_params = require("../util/params")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*istanbul ignore end*/
// Based on https://en.wikipedia.org/wiki/Latin_script_in_Unicode
//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  × Multiplication sign
//  - U+00F7  ÷ Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ˇ &#711;  Caron
//  - U+02D8  ˘ &#728;  Breve
//  - U+02D9  ˙ &#729;  Dot Above
//  - U+02DA  ˚ &#730;  Ring Above
//  - U+02DB  ˛ &#731;  Ogonek
//  - U+02DC  ˜ &#732;  Small Tilde
//  - U+02DD  ˝ &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF
var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();
/*istanbul ignore start*/
exports.wordDiff = wordDiff;
/*istanbul ignore end*/
wordDiff.equals = function (left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }
  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};
wordDiff.tokenize = function (value) {
  // All whitespace symbols except newline group into one token, each newline - in separate token
  var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/);

  // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.
  for (var i = 0; i < tokens.length - 1; i++) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }
  return tokens;
};
function diffWords(oldStr, newStr, options) {
  options =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/
  /*istanbul ignore start*/
  _params
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  generateOptions)
  /*istanbul ignore end*/
  (options, {
    ignoreWhitespace: true
  });
  return wordDiff.diff(oldStr, newStr, options);
}
function diffWordsWithSpace(oldStr, newStr, options) {
  return wordDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJleHRlbmRlZFdvcmRDaGFycyIsInJlV2hpdGVzcGFjZSIsIndvcmREaWZmIiwiRGlmZiIsImVxdWFscyIsImxlZnQiLCJyaWdodCIsIm9wdGlvbnMiLCJpZ25vcmVDYXNlIiwidG9Mb3dlckNhc2UiLCJpZ25vcmVXaGl0ZXNwYWNlIiwidGVzdCIsInRva2VuaXplIiwidmFsdWUiLCJ0b2tlbnMiLCJzcGxpdCIsImkiLCJsZW5ndGgiLCJzcGxpY2UiLCJkaWZmV29yZHMiLCJvbGRTdHIiLCJuZXdTdHIiLCJnZW5lcmF0ZU9wdGlvbnMiLCJkaWZmIiwiZGlmZldvcmRzV2l0aFNwYWNlIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RpZmYvd29yZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtnZW5lcmF0ZU9wdGlvbnN9IGZyb20gJy4uL3V0aWwvcGFyYW1zJztcblxuLy8gQmFzZWQgb24gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGF0aW5fc2NyaXB0X2luX1VuaWNvZGVcbi8vXG4vLyBSYW5nZXMgYW5kIGV4Y2VwdGlvbnM6XG4vLyBMYXRpbi0xIFN1cHBsZW1lbnQsIDAwODDigJMwMEZGXG4vLyAgLSBVKzAwRDcgIMOXIE11bHRpcGxpY2F0aW9uIHNpZ25cbi8vICAtIFUrMDBGNyAgw7cgRGl2aXNpb24gc2lnblxuLy8gTGF0aW4gRXh0ZW5kZWQtQSwgMDEwMOKAkzAxN0Zcbi8vIExhdGluIEV4dGVuZGVkLUIsIDAxODDigJMwMjRGXG4vLyBJUEEgRXh0ZW5zaW9ucywgMDI1MOKAkzAyQUZcbi8vIFNwYWNpbmcgTW9kaWZpZXIgTGV0dGVycywgMDJCMOKAkzAyRkZcbi8vICAtIFUrMDJDNyAgy4cgJiM3MTE7ICBDYXJvblxuLy8gIC0gVSswMkQ4ICDLmCAmIzcyODsgIEJyZXZlXG4vLyAgLSBVKzAyRDkgIMuZICYjNzI5OyAgRG90IEFib3ZlXG4vLyAgLSBVKzAyREEgIMuaICYjNzMwOyAgUmluZyBBYm92ZVxuLy8gIC0gVSswMkRCICDLmyAmIzczMTsgIE9nb25la1xuLy8gIC0gVSswMkRDICDLnCAmIzczMjsgIFNtYWxsIFRpbGRlXG4vLyAgLSBVKzAyREQgIMudICYjNzMzOyAgRG91YmxlIEFjdXRlIEFjY2VudFxuLy8gTGF0aW4gRXh0ZW5kZWQgQWRkaXRpb25hbCwgMUUwMOKAkzFFRkZcbmNvbnN0IGV4dGVuZGVkV29yZENoYXJzID0gL15bYS16QS1aXFx1e0MwfS1cXHV7RkZ9XFx1e0Q4fS1cXHV7RjZ9XFx1e0Y4fS1cXHV7MkM2fVxcdXsyQzh9LVxcdXsyRDd9XFx1ezJERX0tXFx1ezJGRn1cXHV7MUUwMH0tXFx1ezFFRkZ9XSskL3U7XG5cbmNvbnN0IHJlV2hpdGVzcGFjZSA9IC9cXFMvO1xuXG5leHBvcnQgY29uc3Qgd29yZERpZmYgPSBuZXcgRGlmZigpO1xud29yZERpZmYuZXF1YWxzID0gZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgaWYgKHRoaXMub3B0aW9ucy5pZ25vcmVDYXNlKSB7XG4gICAgbGVmdCA9IGxlZnQudG9Mb3dlckNhc2UoKTtcbiAgICByaWdodCA9IHJpZ2h0LnRvTG93ZXJDYXNlKCk7XG4gIH1cbiAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0IHx8ICh0aGlzLm9wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSAmJiAhcmVXaGl0ZXNwYWNlLnRlc3QobGVmdCkgJiYgIXJlV2hpdGVzcGFjZS50ZXN0KHJpZ2h0KSk7XG59O1xud29yZERpZmYudG9rZW5pemUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAvLyBBbGwgd2hpdGVzcGFjZSBzeW1ib2xzIGV4Y2VwdCBuZXdsaW5lIGdyb3VwIGludG8gb25lIHRva2VuLCBlYWNoIG5ld2xpbmUgLSBpbiBzZXBhcmF0ZSB0b2tlblxuICBsZXQgdG9rZW5zID0gdmFsdWUuc3BsaXQoLyhbXlxcU1xcclxcbl0rfFsoKVtcXF17fSdcIlxcclxcbl18XFxiKS8pO1xuXG4gIC8vIEpvaW4gdGhlIGJvdW5kYXJ5IHNwbGl0cyB0aGF0IHdlIGRvIG5vdCBjb25zaWRlciB0byBiZSBib3VuZGFyaWVzLiBUaGlzIGlzIHByaW1hcmlseSB0aGUgZXh0ZW5kZWQgTGF0aW4gY2hhcmFjdGVyIHNldC5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgLy8gSWYgd2UgaGF2ZSBhbiBlbXB0eSBzdHJpbmcgaW4gdGhlIG5leHQgZmllbGQgYW5kIHdlIGhhdmUgb25seSB3b3JkIGNoYXJzIGJlZm9yZSBhbmQgYWZ0ZXIsIG1lcmdlXG4gICAgaWYgKCF0b2tlbnNbaSArIDFdICYmIHRva2Vuc1tpICsgMl1cbiAgICAgICAgICAmJiBleHRlbmRlZFdvcmRDaGFycy50ZXN0KHRva2Vuc1tpXSlcbiAgICAgICAgICAmJiBleHRlbmRlZFdvcmRDaGFycy50ZXN0KHRva2Vuc1tpICsgMl0pKSB7XG4gICAgICB0b2tlbnNbaV0gKz0gdG9rZW5zW2kgKyAyXTtcbiAgICAgIHRva2Vucy5zcGxpY2UoaSArIDEsIDIpO1xuICAgICAgaS0tO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZldvcmRzKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBnZW5lcmF0ZU9wdGlvbnMob3B0aW9ucywge2lnbm9yZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgcmV0dXJuIHdvcmREaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlmZldvcmRzV2l0aFNwYWNlKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKSB7XG4gIHJldHVybiB3b3JkRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQStDO0FBQUE7QUFFL0M7QUFDQTtBQUNB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