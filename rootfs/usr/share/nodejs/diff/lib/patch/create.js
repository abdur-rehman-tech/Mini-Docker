/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPatch = createPatch;
exports.createTwoFilesPatch = createTwoFilesPatch;
exports.formatPatch = formatPatch;
exports.structuredPatch = structuredPatch;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_line = require("../diff/line")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/*istanbul ignore end*/
function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {};
  }
  if (typeof options.context === 'undefined') {
    options.context = 4;
  }
  var diff =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/
  /*istanbul ignore start*/
  _line
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  diffLines)
  /*istanbul ignore end*/
  (oldStr, newStr, options);
  diff.push({
    value: '',
    lines: []
  }); // Append an empty value to make cleanup easier

  function contextLines(lines) {
    return lines.map(function (entry) {
      return ' ' + entry;
    });
  }
  var hunks = [];
  var oldRangeStart = 0,
    newRangeStart = 0,
    curRange = [],
    oldLine = 1,
    newLine = 1;
  /*istanbul ignore start*/
  var _loop = function _loop()
  /*istanbul ignore end*/
  {
    var current = diff[i],
      lines = current.lines || current.value.replace(/\n$/, '').split('\n');
    current.lines = lines;
    if (current.added || current.removed) {
      /*istanbul ignore start*/
      var _curRange;
      /*istanbul ignore end*/
      // If we have previous context, start with that
      if (!oldRangeStart) {
        var prev = diff[i - 1];
        oldRangeStart = oldLine;
        newRangeStart = newLine;
        if (prev) {
          curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
          oldRangeStart -= curRange.length;
          newRangeStart -= curRange.length;
        }
      }

      // Output our changes
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      (_curRange =
      /*istanbul ignore end*/
      curRange).push.apply(
      /*istanbul ignore start*/
      _curRange
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      lines.map(function (entry) {
        return (current.added ? '+' : '-') + entry;
      })));

      // Track the updated file position
      if (current.added) {
        newLine += lines.length;
      } else {
        oldLine += lines.length;
      }
    } else {
      // Identical context lines. Track line changes
      if (oldRangeStart) {
        // Close out any changes that have been output (or join overlapping)
        if (lines.length <= options.context * 2 && i < diff.length - 2) {
          /*istanbul ignore start*/
          var _curRange2;
          /*istanbul ignore end*/
          // Overlapping
          /*istanbul ignore start*/
          /*istanbul ignore end*/
          /*istanbul ignore start*/
          (_curRange2 =
          /*istanbul ignore end*/
          curRange).push.apply(
          /*istanbul ignore start*/
          _curRange2
          /*istanbul ignore end*/
          ,
          /*istanbul ignore start*/
          _toConsumableArray(
          /*istanbul ignore end*/
          contextLines(lines)));
        } else {
          /*istanbul ignore start*/
          var _curRange3;
          /*istanbul ignore end*/
          // end the range and output
          var contextSize = Math.min(lines.length, options.context);
          /*istanbul ignore start*/
          /*istanbul ignore end*/
          /*istanbul ignore start*/
          (_curRange3 =
          /*istanbul ignore end*/
          curRange).push.apply(
          /*istanbul ignore start*/
          _curRange3
          /*istanbul ignore end*/
          ,
          /*istanbul ignore start*/
          _toConsumableArray(
          /*istanbul ignore end*/
          contextLines(lines.slice(0, contextSize))));
          var hunk = {
            oldStart: oldRangeStart,
            oldLines: oldLine - oldRangeStart + contextSize,
            newStart: newRangeStart,
            newLines: newLine - newRangeStart + contextSize,
            lines: curRange
          };
          if (i >= diff.length - 2 && lines.length <= options.context) {
            // EOF is inside this hunk
            var oldEOFNewline = /\n$/.test(oldStr);
            var newEOFNewline = /\n$/.test(newStr);
            var noNlBeforeAdds = lines.length == 0 && curRange.length > hunk.oldLines;
            if (!oldEOFNewline && noNlBeforeAdds && oldStr.length > 0) {
              // special case: old has no eol and no trailing context; no-nl can end up before adds
              // however, if the old file is empty, do not output the no-nl line
              curRange.splice(hunk.oldLines, 0, '\\ No newline at end of file');
            }
            if (!oldEOFNewline && !noNlBeforeAdds || !newEOFNewline) {
              curRange.push('\\ No newline at end of file');
            }
          }
          hunks.push(hunk);
          oldRangeStart = 0;
          newRangeStart = 0;
          curRange = [];
        }
      }
      oldLine += lines.length;
      newLine += lines.length;
    }
  };
  for (var i = 0; i < diff.length; i++)
  /*istanbul ignore start*/
  {
    _loop();
  }
  /*istanbul ignore end*/
  return {
    oldFileName: oldFileName,
    newFileName: newFileName,
    oldHeader: oldHeader,
    newHeader: newHeader,
    hunks: hunks
  };
}
function formatPatch(diff) {
  var ret = [];
  if (diff.oldFileName == diff.newFileName) {
    ret.push('Index: ' + diff.oldFileName);
  }
  ret.push('===================================================================');
  ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
  ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));
  for (var i = 0; i < diff.hunks.length; i++) {
    var hunk = diff.hunks[i];
    // Unified Diff Format quirk: If the chunk size is 0,
    // the first number is one lower than one would expect.
    // https://www.artima.com/weblogs/viewpost.jsp?thread=164293
    if (hunk.oldLines === 0) {
      hunk.oldStart -= 1;
    }
    if (hunk.newLines === 0) {
      hunk.newStart -= 1;
    }
    ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');
    ret.push.apply(ret, hunk.lines);
  }
  return ret.join('\n') + '\n';
}
function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  return formatPatch(structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options));
}
function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzdHJ1Y3R1cmVkUGF0Y2giLCJvbGRGaWxlTmFtZSIsIm5ld0ZpbGVOYW1lIiwib2xkU3RyIiwibmV3U3RyIiwib2xkSGVhZGVyIiwibmV3SGVhZGVyIiwib3B0aW9ucyIsImNvbnRleHQiLCJkaWZmIiwiZGlmZkxpbmVzIiwicHVzaCIsInZhbHVlIiwibGluZXMiLCJjb250ZXh0TGluZXMiLCJtYXAiLCJlbnRyeSIsImh1bmtzIiwib2xkUmFuZ2VTdGFydCIsIm5ld1JhbmdlU3RhcnQiLCJjdXJSYW5nZSIsIm9sZExpbmUiLCJuZXdMaW5lIiwiY3VycmVudCIsImkiLCJyZXBsYWNlIiwic3BsaXQiLCJhZGRlZCIsInJlbW92ZWQiLCJwcmV2Iiwic2xpY2UiLCJsZW5ndGgiLCJjb250ZXh0U2l6ZSIsIk1hdGgiLCJtaW4iLCJodW5rIiwib2xkU3RhcnQiLCJvbGRMaW5lcyIsIm5ld1N0YXJ0IiwibmV3TGluZXMiLCJvbGRFT0ZOZXdsaW5lIiwidGVzdCIsIm5ld0VPRk5ld2xpbmUiLCJub05sQmVmb3JlQWRkcyIsInNwbGljZSIsImZvcm1hdFBhdGNoIiwicmV0IiwiYXBwbHkiLCJqb2luIiwiY3JlYXRlVHdvRmlsZXNQYXRjaCIsImNyZWF0ZVBhdGNoIiwiZmlsZU5hbWUiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvcGF0Y2gvY3JlYXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGlmZkxpbmVzfSBmcm9tICcuLi9kaWZmL2xpbmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gc3RydWN0dXJlZFBhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAodHlwZW9mIG9wdGlvbnMuY29udGV4dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zLmNvbnRleHQgPSA0O1xuICB9XG5cbiAgY29uc3QgZGlmZiA9IGRpZmZMaW5lcyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG4gIGRpZmYucHVzaCh7dmFsdWU6ICcnLCBsaW5lczogW119KTsgLy8gQXBwZW5kIGFuIGVtcHR5IHZhbHVlIHRvIG1ha2UgY2xlYW51cCBlYXNpZXJcblxuICBmdW5jdGlvbiBjb250ZXh0TGluZXMobGluZXMpIHtcbiAgICByZXR1cm4gbGluZXMubWFwKGZ1bmN0aW9uKGVudHJ5KSB7IHJldHVybiAnICcgKyBlbnRyeTsgfSk7XG4gIH1cblxuICBsZXQgaHVua3MgPSBbXTtcbiAgbGV0IG9sZFJhbmdlU3RhcnQgPSAwLCBuZXdSYW5nZVN0YXJ0ID0gMCwgY3VyUmFuZ2UgPSBbXSxcbiAgICAgIG9sZExpbmUgPSAxLCBuZXdMaW5lID0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY3VycmVudCA9IGRpZmZbaV0sXG4gICAgICAgICAgbGluZXMgPSBjdXJyZW50LmxpbmVzIHx8IGN1cnJlbnQudmFsdWUucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gICAgY3VycmVudC5saW5lcyA9IGxpbmVzO1xuXG4gICAgaWYgKGN1cnJlbnQuYWRkZWQgfHwgY3VycmVudC5yZW1vdmVkKSB7XG4gICAgICAvLyBJZiB3ZSBoYXZlIHByZXZpb3VzIGNvbnRleHQsIHN0YXJ0IHdpdGggdGhhdFxuICAgICAgaWYgKCFvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgIGNvbnN0IHByZXYgPSBkaWZmW2kgLSAxXTtcbiAgICAgICAgb2xkUmFuZ2VTdGFydCA9IG9sZExpbmU7XG4gICAgICAgIG5ld1JhbmdlU3RhcnQgPSBuZXdMaW5lO1xuXG4gICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgY3VyUmFuZ2UgPSBvcHRpb25zLmNvbnRleHQgPiAwID8gY29udGV4dExpbmVzKHByZXYubGluZXMuc2xpY2UoLW9wdGlvbnMuY29udGV4dCkpIDogW107XG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT3V0cHV0IG91ciBjaGFuZ2VzXG4gICAgICBjdXJSYW5nZS5wdXNoKC4uLiBsaW5lcy5tYXAoZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgICAgcmV0dXJuIChjdXJyZW50LmFkZGVkID8gJysnIDogJy0nKSArIGVudHJ5O1xuICAgICAgfSkpO1xuXG4gICAgICAvLyBUcmFjayB0aGUgdXBkYXRlZCBmaWxlIHBvc2l0aW9uXG4gICAgICBpZiAoY3VycmVudC5hZGRlZCkge1xuICAgICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZGVudGljYWwgY29udGV4dCBsaW5lcy4gVHJhY2sgbGluZSBjaGFuZ2VzXG4gICAgICBpZiAob2xkUmFuZ2VTdGFydCkge1xuICAgICAgICAvLyBDbG9zZSBvdXQgYW55IGNoYW5nZXMgdGhhdCBoYXZlIGJlZW4gb3V0cHV0IChvciBqb2luIG92ZXJsYXBwaW5nKVxuICAgICAgICBpZiAobGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCAqIDIgJiYgaSA8IGRpZmYubGVuZ3RoIC0gMikge1xuICAgICAgICAgIC8vIE92ZXJsYXBwaW5nXG4gICAgICAgICAgY3VyUmFuZ2UucHVzaCguLi4gY29udGV4dExpbmVzKGxpbmVzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZW5kIHRoZSByYW5nZSBhbmQgb3V0cHV0XG4gICAgICAgICAgbGV0IGNvbnRleHRTaXplID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBvcHRpb25zLmNvbnRleHQpO1xuICAgICAgICAgIGN1clJhbmdlLnB1c2goLi4uIGNvbnRleHRMaW5lcyhsaW5lcy5zbGljZSgwLCBjb250ZXh0U2l6ZSkpKTtcblxuICAgICAgICAgIGxldCBodW5rID0ge1xuICAgICAgICAgICAgb2xkU3RhcnQ6IG9sZFJhbmdlU3RhcnQsXG4gICAgICAgICAgICBvbGRMaW5lczogKG9sZExpbmUgLSBvbGRSYW5nZVN0YXJ0ICsgY29udGV4dFNpemUpLFxuICAgICAgICAgICAgbmV3U3RhcnQ6IG5ld1JhbmdlU3RhcnQsXG4gICAgICAgICAgICBuZXdMaW5lczogKG5ld0xpbmUgLSBuZXdSYW5nZVN0YXJ0ICsgY29udGV4dFNpemUpLFxuICAgICAgICAgICAgbGluZXM6IGN1clJhbmdlXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaSA+PSBkaWZmLmxlbmd0aCAtIDIgJiYgbGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCkge1xuICAgICAgICAgICAgLy8gRU9GIGlzIGluc2lkZSB0aGlzIGh1bmtcbiAgICAgICAgICAgIGxldCBvbGRFT0ZOZXdsaW5lID0gKCgvXFxuJC8pLnRlc3Qob2xkU3RyKSk7XG4gICAgICAgICAgICBsZXQgbmV3RU9GTmV3bGluZSA9ICgoL1xcbiQvKS50ZXN0KG5ld1N0cikpO1xuICAgICAgICAgICAgbGV0IG5vTmxCZWZvcmVBZGRzID0gbGluZXMubGVuZ3RoID09IDAgJiYgY3VyUmFuZ2UubGVuZ3RoID4gaHVuay5vbGRMaW5lcztcbiAgICAgICAgICAgIGlmICghb2xkRU9GTmV3bGluZSAmJiBub05sQmVmb3JlQWRkcyAmJiBvbGRTdHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IG9sZCBoYXMgbm8gZW9sIGFuZCBubyB0cmFpbGluZyBjb250ZXh0OyBuby1ubCBjYW4gZW5kIHVwIGJlZm9yZSBhZGRzXG4gICAgICAgICAgICAgIC8vIGhvd2V2ZXIsIGlmIHRoZSBvbGQgZmlsZSBpcyBlbXB0eSwgZG8gbm90IG91dHB1dCB0aGUgbm8tbmwgbGluZVxuICAgICAgICAgICAgICBjdXJSYW5nZS5zcGxpY2UoaHVuay5vbGRMaW5lcywgMCwgJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCghb2xkRU9GTmV3bGluZSAmJiAhbm9ObEJlZm9yZUFkZHMpIHx8ICFuZXdFT0ZOZXdsaW5lKSB7XG4gICAgICAgICAgICAgIGN1clJhbmdlLnB1c2goJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBodW5rcy5wdXNoKGh1bmspO1xuXG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgY3VyUmFuZ2UgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb2xkTGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9sZEZpbGVOYW1lOiBvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWU6IG5ld0ZpbGVOYW1lLFxuICAgIG9sZEhlYWRlcjogb2xkSGVhZGVyLCBuZXdIZWFkZXI6IG5ld0hlYWRlcixcbiAgICBodW5rczogaHVua3NcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFBhdGNoKGRpZmYpIHtcbiAgY29uc3QgcmV0ID0gW107XG4gIGlmIChkaWZmLm9sZEZpbGVOYW1lID09IGRpZmYubmV3RmlsZU5hbWUpIHtcbiAgICByZXQucHVzaCgnSW5kZXg6ICcgKyBkaWZmLm9sZEZpbGVOYW1lKTtcbiAgfVxuICByZXQucHVzaCgnPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PScpO1xuICByZXQucHVzaCgnLS0tICcgKyBkaWZmLm9sZEZpbGVOYW1lICsgKHR5cGVvZiBkaWZmLm9sZEhlYWRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICdcXHQnICsgZGlmZi5vbGRIZWFkZXIpKTtcbiAgcmV0LnB1c2goJysrKyAnICsgZGlmZi5uZXdGaWxlTmFtZSArICh0eXBlb2YgZGlmZi5uZXdIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIGRpZmYubmV3SGVhZGVyKSk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmLmh1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgaHVuayA9IGRpZmYuaHVua3NbaV07XG4gICAgLy8gVW5pZmllZCBEaWZmIEZvcm1hdCBxdWlyazogSWYgdGhlIGNodW5rIHNpemUgaXMgMCxcbiAgICAvLyB0aGUgZmlyc3QgbnVtYmVyIGlzIG9uZSBsb3dlciB0aGFuIG9uZSB3b3VsZCBleHBlY3QuXG4gICAgLy8gaHR0cHM6Ly93d3cuYXJ0aW1hLmNvbS93ZWJsb2dzL3ZpZXdwb3N0LmpzcD90aHJlYWQ9MTY0MjkzXG4gICAgaWYgKGh1bmsub2xkTGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsub2xkU3RhcnQgLT0gMTtcbiAgICB9XG4gICAgaWYgKGh1bmsubmV3TGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsubmV3U3RhcnQgLT0gMTtcbiAgICB9XG4gICAgcmV0LnB1c2goXG4gICAgICAnQEAgLScgKyBodW5rLm9sZFN0YXJ0ICsgJywnICsgaHVuay5vbGRMaW5lc1xuICAgICAgKyAnICsnICsgaHVuay5uZXdTdGFydCArICcsJyArIGh1bmsubmV3TGluZXNcbiAgICAgICsgJyBAQCdcbiAgICApO1xuICAgIHJldC5wdXNoLmFwcGx5KHJldCwgaHVuay5saW5lcyk7XG4gIH1cblxuICByZXR1cm4gcmV0LmpvaW4oJ1xcbicpICsgJ1xcbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUd29GaWxlc1BhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIHJldHVybiBmb3JtYXRQYXRjaChzdHJ1Y3R1cmVkUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhdGNoKGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNyZWF0ZVR3b0ZpbGVzUGF0Y2goZmlsZU5hbWUsIGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBdUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFaEMsU0FBU0EsZUFBZSxDQUFDQyxXQUFXLEVBQUVDLFdBQVcsRUFBRUMsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFQyxPQUFPLEVBQUU7RUFDdkcsSUFBSSxDQUFDQSxPQUFPLEVBQUU7SUFDWkEsT0FBTyxHQUFHLENBQUMsQ0FBQztFQUNkO0VBQ0EsSUFBSSxPQUFPQSxPQUFPLENBQUNDLE9BQU8sS0FBSyxXQUFXLEVBQUU7SUFDMUNELE9BQU8sQ0FBQ0MsT0FBTyxHQUFHLENBQUM7RUFDckI7RUFFQSxJQUFNQyxJQUFJO0VBQUc7RUFBQTtFQUFBO0VBQUFDO0VBQUFBO0VBQUFBO0VBQUFBO0VBQUFBO0VBQUFBLFNBQVM7RUFBQTtFQUFBLENBQUNQLE1BQU0sRUFBRUMsTUFBTSxFQUFFRyxPQUFPLENBQUM7RUFDL0NFLElBQUksQ0FBQ0UsSUFBSSxDQUFDO0lBQUNDLEtBQUssRUFBRSxFQUFFO0lBQUVDLEtBQUssRUFBRTtFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0VBRW5DLFNBQVNDLFlBQVksQ0FB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