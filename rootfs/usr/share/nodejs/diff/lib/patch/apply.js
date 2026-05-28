/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPatch = applyPatch;
exports.applyPatches = applyPatches;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_parse = require("./parse")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_distanceIterator = _interopRequireDefault(require("../util/distance-iterator"))
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*istanbul ignore end*/
function applyPatch(source, uniDiff) {
  /*istanbul ignore start*/
  var
  /*istanbul ignore end*/
  options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (typeof uniDiff === 'string') {
    uniDiff =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _parse
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    parsePatch)
    /*istanbul ignore end*/
    (uniDiff);
  }
  if (Array.isArray(uniDiff)) {
    if (uniDiff.length > 1) {
      throw new Error('applyPatch only works with a single input.');
    }
    uniDiff = uniDiff[0];
  }

  // Apply the diff to the input
  var lines = source.split(/\r\n|[\n\v\f\r\x85]/),
    delimiters = source.match(/\r\n|[\n\v\f\r\x85]/g) || [],
    hunks = uniDiff.hunks,
    compareLine = options.compareLine || function (lineNumber, line, operation, patchContent)
    /*istanbul ignore start*/
    {
      return (
        /*istanbul ignore end*/
        line === patchContent
      );
    },
    errorCount = 0,
    fuzzFactor = options.fuzzFactor || 0,
    minLine = 0,
    offset = 0,
    removeEOFNL,
    addEOFNL;

  /**
   * Checks if the hunk exactly fits on the provided location
   */
  function hunkFits(hunk, toPos) {
    for (var j = 0; j < hunk.lines.length; j++) {
      var line = hunk.lines[j],
        operation = line.length > 0 ? line[0] : ' ',
        content = line.length > 0 ? line.substr(1) : line;
      if (operation === ' ' || operation === '-') {
        // Context sanity check
        if (!compareLine(toPos + 1, lines[toPos], operation, content)) {
          errorCount++;
          if (errorCount > fuzzFactor) {
            return false;
          }
        }
        toPos++;
      }
    }
    return true;
  }

  // Search best fit offsets for each hunk based on the previous ones
  for (var i = 0; i < hunks.length; i++) {
    var hunk = hunks[i],
      maxLine = lines.length - hunk.oldLines,
      localOffset = 0,
      toPos = offset + hunk.oldStart - 1;
    var iterator =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _distanceIterator
    /*istanbul ignore end*/
    [
    /*istanbul ignore start*/
    "default"
    /*istanbul ignore end*/
    ])(toPos, minLine, maxLine);
    for (; localOffset !== undefined; localOffset = iterator()) {
      if (hunkFits(hunk, toPos + localOffset)) {
        hunk.offset = offset += localOffset;
        break;
      }
    }
    if (localOffset === undefined) {
      return false;
    }

    // Set lower text limit to end of the current hunk, so next ones don't try
    // to fit over already patched text
    minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
  }

  // Apply patch hunks
  var diffOffset = 0;
  for (var _i = 0; _i < hunks.length; _i++) {
    var _hunk = hunks[_i],
      _toPos = _hunk.oldStart + _hunk.offset + diffOffset - 1;
    diffOffset += _hunk.newLines - _hunk.oldLines;
    for (var j = 0; j < _hunk.lines.length; j++) {
      var line = _hunk.lines[j],
        operation = line.length > 0 ? line[0] : ' ',
        content = line.length > 0 ? line.substr(1) : line,
        delimiter = _hunk.linedelimiters[j];
      if (operation === ' ') {
        _toPos++;
      } else if (operation === '-') {
        lines.splice(_toPos, 1);
        delimiters.splice(_toPos, 1);
        /* istanbul ignore else */
      } else if (operation === '+') {
        lines.splice(_toPos, 0, content);
        delimiters.splice(_toPos, 0, delimiter);
        _toPos++;
      } else if (operation === '\\') {
        var previousOperation = _hunk.lines[j - 1] ? _hunk.lines[j - 1][0] : null;
        if (previousOperation === '+') {
          removeEOFNL = true;
        } else if (previousOperation === '-') {
          addEOFNL = true;
        }
      }
    }
  }

  // Handle EOFNL insertion/removal
  if (removeEOFNL) {
    while (!lines[lines.length - 1]) {
      lines.pop();
      delimiters.pop();
    }
  } else if (addEOFNL) {
    lines.push('');
    delimiters.push('\n');
  }
  for (var _k = 0; _k < lines.length - 1; _k++) {
    lines[_k] = lines[_k] + delimiters[_k];
  }
  return lines.join('');
}

// Wrapper that supports multiple file patches via callbacks.
function applyPatches(uniDiff, options) {
  if (typeof uniDiff === 'string') {
    uniDiff =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _parse
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    parsePatch)
    /*istanbul ignore end*/
    (uniDiff);
  }
  var currentIndex = 0;
  function processIndex() {
    var index = uniDiff[currentIndex++];
    if (!index) {
      return options.complete();
    }
    options.loadFile(index, function (err, data) {
      if (err) {
        return options.complete(err);
      }
      var updatedContent = applyPatch(data, index, options);
      options.patched(index, updatedContent, function (err) {
        if (err) {
          return options.complete(err);
        }
        processIndex();
      });
    });
  }
  processIndex();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhcHBseVBhdGNoIiwic291cmNlIiwidW5pRGlmZiIsIm9wdGlvbnMiLCJwYXJzZVBhdGNoIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwiRXJyb3IiLCJsaW5lcyIsInNwbGl0IiwiZGVsaW1pdGVycyIsIm1hdGNoIiwiaHVua3MiLCJjb21wYXJlTGluZSIsImxpbmVOdW1iZXIiLCJsaW5lIiwib3BlcmF0aW9uIiwicGF0Y2hDb250ZW50IiwiZXJyb3JDb3VudCIsImZ1enpGYWN0b3IiLCJtaW5MaW5lIiwib2Zmc2V0IiwicmVtb3ZlRU9GTkwiLCJhZGRFT0ZOTCIsImh1bmtGaXRzIiwiaHVuayIsInRvUG9zIiwiaiIsImNvbnRlbnQiLCJzdWJzdHIiLCJpIiwibWF4TGluZSIsIm9sZExpbmVzIiwibG9jYWxPZmZzZXQiLCJvbGRTdGFydCIsIml0ZXJhdG9yIiwiZGlzdGFuY2VJdGVyYXRvciIsInVuZGVmaW5lZCIsImRpZmZPZmZzZXQiLCJuZXdMaW5lcyIsImRlbGltaXRlciIsImxpbmVkZWxpbWl0ZXJzIiwic3BsaWNlIiwicHJldmlvdXNPcGVyYXRpb24iLCJwb3AiLCJwdXNoIiwiX2siLCJqb2luIiwiYXBwbHlQYXRjaGVzIiwiY3VycmVudEluZGV4IiwicHJvY2Vzc0luZGV4IiwiaW5kZXgiLCJjb21wbGV0ZSIsImxvYWRGaWxlIiwiZXJyIiwiZGF0YSIsInVwZGF0ZWRDb250ZW50IiwicGF0Y2hlZCJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRjaC9hcHBseS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3BhcnNlUGF0Y2h9IGZyb20gJy4vcGFyc2UnO1xuaW1wb3J0IGRpc3RhbmNlSXRlcmF0b3IgZnJvbSAnLi4vdXRpbC9kaXN0YW5jZS1pdGVyYXRvcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBhdGNoKHNvdXJjZSwgdW5pRGlmZiwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmICh0eXBlb2YgdW5pRGlmZiA9PT0gJ3N0cmluZycpIHtcbiAgICB1bmlEaWZmID0gcGFyc2VQYXRjaCh1bmlEaWZmKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHVuaURpZmYpKSB7XG4gICAgaWYgKHVuaURpZmYubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhcHBseVBhdGNoIG9ubHkgd29ya3Mgd2l0aCBhIHNpbmdsZSBpbnB1dC4nKTtcbiAgICB9XG5cbiAgICB1bmlEaWZmID0gdW5pRGlmZlswXTtcbiAgfVxuXG4gIC8vIEFwcGx5IHRoZSBkaWZmIHRvIHRoZSBpbnB1dFxuICBsZXQgbGluZXMgPSBzb3VyY2Uuc3BsaXQoL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdLyksXG4gICAgICBkZWxpbWl0ZXJzID0gc291cmNlLm1hdGNoKC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS9nKSB8fCBbXSxcbiAgICAgIGh1bmtzID0gdW5pRGlmZi5odW5rcyxcblxuICAgICAgY29tcGFyZUxpbmUgPSBvcHRpb25zLmNvbXBhcmVMaW5lIHx8ICgobGluZU51bWJlciwgbGluZSwgb3BlcmF0aW9uLCBwYXRjaENvbnRlbnQpID0+IGxpbmUgPT09IHBhdGNoQ29udGVudCksXG4gICAgICBlcnJvckNvdW50ID0gMCxcbiAgICAgIGZ1enpGYWN0b3IgPSBvcHRpb25zLmZ1enpGYWN0b3IgfHwgMCxcbiAgICAgIG1pbkxpbmUgPSAwLFxuICAgICAgb2Zmc2V0ID0gMCxcblxuICAgICAgcmVtb3ZlRU9GTkwsXG4gICAgICBhZGRFT0ZOTDtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBodW5rIGV4YWN0bHkgZml0cyBvbiB0aGUgcHJvdmlkZWQgbG9jYXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIGh1bmtGaXRzKGh1bmssIHRvUG9zKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBodW5rLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBsZXQgbGluZSA9IGh1bmsubGluZXNbal0sXG4gICAgICAgICAgb3BlcmF0aW9uID0gKGxpbmUubGVuZ3RoID4gMCA/IGxpbmVbMF0gOiAnICcpLFxuICAgICAgICAgIGNvbnRlbnQgPSAobGluZS5sZW5ndGggPiAwID8gbGluZS5zdWJzdHIoMSkgOiBsaW5lKTtcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJyAnIHx8IG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgIC8vIENvbnRleHQgc2FuaXR5IGNoZWNrXG4gICAgICAgIGlmICghY29tcGFyZUxpbmUodG9Qb3MgKyAxLCBsaW5lc1t0b1Bvc10sIG9wZXJhdGlvbiwgY29udGVudCkpIHtcbiAgICAgICAgICBlcnJvckNvdW50Kys7XG5cbiAgICAgICAgICBpZiAoZXJyb3JDb3VudCA+IGZ1enpGYWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdG9Qb3MrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFNlYXJjaCBiZXN0IGZpdCBvZmZzZXRzIGZvciBlYWNoIGh1bmsgYmFzZWQgb24gdGhlIHByZXZpb3VzIG9uZXNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBodW5rcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBodW5rID0gaHVua3NbaV0sXG4gICAgICAgIG1heExpbmUgPSBsaW5lcy5sZW5ndGggLSBodW5rLm9sZExpbmVzLFxuICAgICAgICBsb2NhbE9mZnNldCA9IDAsXG4gICAgICAgIHRvUG9zID0gb2Zmc2V0ICsgaHVuay5vbGRTdGFydCAtIDE7XG5cbiAgICBsZXQgaXRlcmF0b3IgPSBkaXN0YW5jZUl0ZXJhdG9yKHRvUG9zLCBtaW5MaW5lLCBtYXhMaW5lKTtcblxuICAgIGZvciAoOyBsb2NhbE9mZnNldCAhPT0gdW5kZWZpbmVkOyBsb2NhbE9mZnNldCA9IGl0ZXJhdG9yKCkpIHtcbiAgICAgIGlmIChodW5rRml0cyhodW5rLCB0b1BvcyArIGxvY2FsT2Zmc2V0KSkge1xuICAgICAgICBodW5rLm9mZnNldCA9IG9mZnNldCArPSBsb2NhbE9mZnNldDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsT2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBTZXQgbG93ZXIgdGV4dCBsaW1pdCB0byBlbmQgb2YgdGhlIGN1cnJlbnQgaHVuaywgc28gbmV4dCBvbmVzIGRvbid0IHRyeVxuICAgIC8vIHRvIGZpdCBvdmVyIGFscmVhZHkgcGF0Y2hlZCB0ZXh0XG4gICAgbWluTGluZSA9IGh1bmsub2Zmc2V0ICsgaHVuay5vbGRTdGFydCArIGh1bmsub2xkTGluZXM7XG4gIH1cblxuICAvLyBBcHBseSBwYXRjaCBodW5rc1xuICBsZXQgZGlmZk9mZnNldCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgaHVuayA9IGh1bmtzW2ldLFxuICAgICAgICB0b1BvcyA9IGh1bmsub2xkU3RhcnQgKyBodW5rLm9mZnNldCArIGRpZmZPZmZzZXQgLSAxO1xuICAgIGRpZmZPZmZzZXQgKz0gaHVuay5uZXdMaW5lcyAtIGh1bmsub2xkTGluZXM7XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGh1bmsubGluZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGxldCBsaW5lID0gaHVuay5saW5lc1tqXSxcbiAgICAgICAgICBvcGVyYXRpb24gPSAobGluZS5sZW5ndGggPiAwID8gbGluZVswXSA6ICcgJyksXG4gICAgICAgICAgY29udGVudCA9IChsaW5lLmxlbmd0aCA+IDAgPyBsaW5lLnN1YnN0cigxKSA6IGxpbmUpLFxuICAgICAgICAgIGRlbGltaXRlciA9IGh1bmsubGluZWRlbGltaXRlcnNbal07XG5cbiAgICAgIGlmIChvcGVyYXRpb24gPT09ICcgJykge1xuICAgICAgICB0b1BvcysrO1xuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICBsaW5lcy5zcGxpY2UodG9Qb3MsIDEpO1xuICAgICAgICBkZWxpbWl0ZXJzLnNwbGljZSh0b1BvcywgMSk7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICcrJykge1xuICAgICAgICBsaW5lcy5zcGxpY2UodG9Qb3MsIDAsIGNvbnRlbnQpO1xuICAgICAgICBkZWxpbWl0ZXJzLnNwbGljZSh0b1BvcywgMCwgZGVsaW1pdGVyKTtcbiAgICAgICAgdG9Qb3MrKztcbiAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnXFxcXCcpIHtcbiAgICAgICAgbGV0IHByZXZpb3VzT3BlcmF0aW9uID0gaHVuay5saW5lc1tqIC0gMV0gPyBodW5rLmxpbmVzW2ogLSAxXVswXSA6IG51bGw7XG4gICAgICAgIGlmIChwcmV2aW91c09wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgcmVtb3ZlRU9GTkwgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHByZXZpb3VzT3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgICBhZGRFT0ZOTCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBIYW5kbGUgRU9GTkwgaW5zZXJ0aW9uL3JlbW92YWxcbiAgaWYgKHJlbW92ZUVPRk5MKSB7XG4gICAgd2hpbGUgKCFsaW5lc1tsaW5lcy5sZW5ndGggLSAxXSkge1xuICAgICAgbGluZXMucG9wKCk7XG4gICAgICBkZWxpbWl0ZXJzLnBvcCgpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChhZGRFT0ZOTCkge1xuICAgIGxpbmVzLnB1c2goJycpO1xuICAgIGRlbGltaXRlcnMucHVzaCgnXFxuJyk7XG4gIH1cbiAgZm9yIChsZXQgX2sgPSAwOyBfayA8IGxpbmVzLmxlbmd0aCAtIDE7IF9rKyspIHtcbiAgICBsaW5lc1tfa10gPSBsaW5lc1tfa10gKyBkZWxpbWl0ZXJzW19rXTtcbiAgfVxuICByZXR1cm4gbGluZXMuam9pbignJyk7XG59XG5cbi8vIFdyYXBwZXIgdGhhdCBzdXBwb3J0cyBtdWx0aXBsZSBmaWxlIHBhdGNoZXMgdmlhIGNhbGxiYWNrcy5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBhdGNoZXModW5pRGlmZiwgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIHVuaURpZmYgPT09ICdzdHJpbmcnKSB7XG4gICAgdW5pRGlmZiA9IHBhcnNlUGF0Y2godW5pRGlmZik7XG4gIH1cblxuICBsZXQgY3VycmVudEluZGV4ID0gMDtcbiAgZnVuY3Rpb24gcHJvY2Vzc0luZGV4KCkge1xuICAgIGxldCBpbmRleCA9IHVuaURpZmZbY3VycmVudEluZGV4KytdO1xuICAgIGlmICghaW5kZXgpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5sb2FkRmlsZShpbmRleCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKGVycik7XG4gICAgICB9XG5cbiAgICAgIGxldCB1cGRhdGVkQ29udGVudCA9IGFwcGx5UGF0Y2goZGF0YSwgaW5kZXgsIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5wYXRjaGVkKGluZGV4LCB1cGRhdGVkQ29udGVudCwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9ucy5jb21wbGV0ZShlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvY2Vzc0luZGV4KCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBwcm9jZXNzSW5kZXgoKTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBeUQ7QUFBQTtBQUVsRCxTQUFTQSxVQUFVLENBQUNDLE1BQU0sRUFBRUMsT0FBTyxFQUFn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