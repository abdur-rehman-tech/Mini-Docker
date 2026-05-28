/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var
/*istanbul ignore next*/
_utils = require("../utils");

/* global define */
var SourceNode;

try {
  /* istanbul ignore next */
  if (typeof define !== 'function' || !define.amd) {
    // We don't support this in AMD environments. For these environments, we asusme that
    // they are running on the browser and thus have no need for the source-map library.
    var SourceMap = require('source-map');

    SourceNode = SourceMap.SourceNode;
  }
} catch (err) {
  /* NOP */
}
/* istanbul ignore if: tested but not covered in istanbul due to dist build  */


if (!SourceNode) {
  SourceNode = function
  /*istanbul ignore next*/
  SourceNode(line, column, srcFile, chunks) {
    this.src = '';

    if (chunks) {
      this.add(chunks);
    }
  };
  /* istanbul ignore next */


  SourceNode.prototype = {
    add: function
    /*istanbul ignore next*/
    add(chunks) {
      if (
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _utils.
      /*istanbul ignore next*/
      isArray)(chunks)) {
        chunks = chunks.join('');
      }

      this.src += chunks;
    },
    prepend: function
    /*istanbul ignore next*/
    prepend(chunks) {
      if (
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _utils.
      /*istanbul ignore next*/
      isArray)(chunks)) {
        chunks = chunks.join('');
      }

      this.src = chunks + this.src;
    },
    toStringWithSourceMap: function
    /*istanbul ignore next*/
    toStringWithSourceMap() {
      return {
        code: this.toString()
      };
    },
    toString: function
    /*istanbul ignore next*/
    toString() {
      return this.src;
    }
  };
}

function castChunk(chunk, codeGen, loc) {
  if (
  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _utils.
  /*istanbul ignore next*/
  isArray)(chunk)) {
    var ret = [];

    for (var i = 0, len = chunk.length; i < len; i++) {
      ret.push(codeGen.wrap(chunk[i], loc));
    }

    return ret;
  } else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
    // Handle primitives that the SourceNode will throw up on
    return chunk + '';
  }

  return chunk;
}

function CodeGen(srcFile) {
  this.srcFile = srcFile;
  this.source = [];
}

CodeGen.prototype = {
  /*istanbul ignore next*/
  isEmpty: function isEmpty() {
    return !this.source.length;
  },
  prepend: function
  /*istanbul ignore next*/
  prepend(source, loc) {
    this.source.unshift(this.wrap(source, loc));
  },
  push: function
  /*istanbul ignore next*/
  push(source, loc) {
    this.source.push(this.wrap(source, loc));
  },
  merge: function
  /*istanbul ignore next*/
  merge() {
    var source = this.empty();
    this.each(function (line) {
      source.add(['  ', line, '\n']);
    });
    return source;
  },
  each: function
  /*istanbul ignore next*/
  each(iter) {
    for (var i = 0, len = this.source.length; i < len; i++) {
      iter(this.source[i]);
    }
  },
  empty: function
  /*istanbul ignore next*/
  empty() {
    var loc = this.currentLocation || {
      start: {}
    };
    return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
  },
  wrap: function
  /*istanbul ignore next*/
  wrap(chunk) {
    /*istanbul ignore next*/
    var loc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentLocation || {
      start: {}
    };

    if (chunk instanceof SourceNode) {
      return chunk;
    }

    chunk = castChunk(chunk, this, loc);
    return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
  },
  functionCall: function
  /*istanbul ignore next*/
  functionCall(fn, type, params) {
    params = this.generateList(params);
    return this.wrap([fn, type ? '.' + type + '(' : '(', params, ')']);
  },
  quotedString: function
  /*istanbul ignore next*/
  quotedString(str) {
    return '"' + (str + '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, "\\u2028") // Per Ecma-262 7.3 + 7.8.4
    .replace(/\u2029/g, "\\u2029") + '"';
  },
  objectLiteral: function
  /*istanbul ignore next*/
  objectLiteral(obj) {
    /*istanbul ignore next*/
    var _this = this;

    var pairs = [];
    Object.keys(obj).forEach(function (key) {
      var value = castChunk(obj[key], _this);

      if (value !== 'undefined') {
        pairs.push([_this.quotedString(key), ':', value]);
      }
    });
    var ret = this.generateList(pairs);
    ret.prepend('{');
    ret.add('}');
    return ret;
  },
  generateList: function
  /*istanbul ignore next*/
  generateList(entries) {
    var ret = this.empty();

    for (var i = 0, len = entries.length; i < len; i++) {
      if (i) {
        ret.add(',');
      }

      ret.add(castChunk(entries[i], this));
    }

    return ret;
  },
  generateArray: function
  /*istanbul ignore next*/
  generateArray(entries) {
    var ret = this.generateList(entries);
    ret.prepend('[');
    ret.add(']');
    return ret;
  }
};

/*istanbul ignore next*/
var _default = CodeGen;

/*istanbul ignore next*/
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2NvbXBpbGVyL2NvZGUtZ2VuLmpzIl0sIm5hbWVzIjpbIlNvdXJjZU5vZGUiLCJkZWZpbmUiLCJhbWQiLCJTb3VyY2VNYXAiLCJyZXF1aXJlIiwiZXJyIiwibGluZSIsImNvbHVtbiIsInNyY0ZpbGUiLCJjaHVua3MiLCJzcmMiLCJhZGQiLCJwcm90b3R5cGUiLCJpc0FycmF5Iiwiam9pbiIsInByZXBlbmQiLCJ0b1N0cmluZ1dpdGhTb3VyY2VNYXAiLCJjb2RlIiwidG9TdHJpbmciLCJjYXN0Q2h1bmsiLCJjaHVuayIsImNvZGVHZW4iLCJsb2MiLCJyZXQiLCJpIiwibGVuIiwibGVuZ3RoIiwicHVzaCIsIndyYXAiLCJDb2RlR2VuIiwic291cmNlIiwiaXNFbXB0eSIsInVuc2hpZnQiLCJtZXJnZSIsImVtcHR5IiwiZWFjaCIsIml0ZXIiLCJjdXJyZW50TG9jYXRpb24iLCJzdGFydCIsImZ1bmN0aW9uQ2FsbCIsImZuIiwidHlwZSIsInBhcmFtcyIsImdlbmVyYXRlTGlzdCIsInF1b3RlZFN0cmluZyIsInN0ciIsInJlcGxhY2UiLCJvYmplY3RMaXRlcmFsIiwib2JqIiwicGFpcnMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsInZhbHVlIiwiZW50cmllcyIsImdlbmVyYXRlQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7QUFBQTtBQUFBOztBQURBO0FBR0EsSUFBSUEsVUFBSjs7QUFFQSxJQUFJO0FBQ0Y7QUFDQSxNQUFJLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsQ0FBQ0EsTUFBTSxDQUFDQyxHQUE1QyxFQUFpRDtBQUMvQztBQUNBO0FBQ0EsUUFBSUMsU0FBUyxHQUFHQyxPQUFPLENBQUMsWUFBRCxDQUF2Qjs7QUFDQUosSUFBQUEsVUFBVSxHQUFHRyxTQUFTLENBQUNILFVBQXZCO0FBQ0Q7QUFDRixDQVJELENBUUUsT0FBT0ssR0FBUCxFQUFZO0FBQ1o7QUFDRDtB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QjtBQUNEOztBQUVELFdBQU9ELEdBQVA7QUFDRCxHQTNGaUI7QUE2RmxCaUMsRUFBQUEsYUFBYSxFQUFFO0FBQUE7QUFBQSxnQkFBU0QsT0FBVCxFQUFrQjtBQUMvQixRQUFJaEMsR0FBRyxHQUFHLEtBQUtvQixZQUFMLENBQWtCWSxPQUFsQixDQUFWO0FBQ0FoQyxJQUFBQSxHQUFHLENBQUNSLE9BQUosQ0FBWSxHQUFaO0FBQ0FRLElBQUFBLEdBQUcsQ0FBQ1osR0FBSixDQUFRLEdBQVI7QUFFQSxXQUFPWSxHQUFQO0FBQ0Q7QUFuR2lCLENBQXBCOzs7ZUFzR2VNLE8iLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgZGVmaW5lICovXG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5sZXQgU291cmNlTm9kZTtcblxudHJ5IHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICdmdW5jdGlvbicgfHwgIWRlZmluZS5hbWQpIHtcbiAgICAvLyBXZSBkb24ndCBzdXBwb3J0IHRoaXMgaW4gQU1EIGVudmlyb25tZW50cy4gRm9yIHRoZXNlIGVudmlyb25tZW50cywgd2UgYXN1c21lIHRoYXRcbiAgICAvLyB0aGV5IGFyZSBydW5uaW5nIG9uIHRoZSBicm93c2VyIGFuZCB0aHVzIGhhdmUgbm8gbmVlZCBmb3IgdGhlIHNvdXJjZS1tYXAgbGlicmFyeS5cbiAgICBsZXQgU291cmNlTWFwID0gcmVxdWlyZSgnc291cmNlLW1hcCcpO1xuICAgIFNvdXJjZU5vZGUgPSBTb3VyY2VNYXAuU291cmNlTm9kZTtcbiAgfVxufSBjYXRjaCAoZXJyKSB7XG4gIC8qIE5PUCAqL1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgaWY6IHRlc3RlZCBidXQgbm90IGNvdmVyZWQgaW4gaXN0YW5idWwgZHVlIHRvIGRpc3QgYnVpbGQgICovXG5pZiAoIVNvdXJjZU5vZGUpIHtcbiAgU291cmNlTm9kZSA9IGZ1bmN0aW9uKGxpbmUsIGNvbHVtbiwgc3JjRmlsZSwgY2h1bmtzKSB7XG4gICAgdGhpcy5zcmMgPSAnJztcbiAgICBpZiAoY2h1bmtzKSB7XG4gICAgICB0aGlzLmFkZChjaHVua3MpO1xuICAgIH1cbiAgfTtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgU291cmNlTm9kZS5wcm90b3R5cGUgPSB7XG4gICAgYWRkOiBmdW5jdGlvbihjaHVua3MpIHtcbiAgICAgIGlmIChpc0FycmF5KGNodW5rcykpIHtcbiAgICAgICAgY2h1bmtzID0gY2h1bmtzLmpvaW4oJycpO1xuICAgICAgfVxuICAgICAgdGhpcy5zcmMgKz0gY2h1bmtzO1xuICAgIH0sXG4gICAgcHJlcGVuZDogZnVuY3Rpb24oY2h1bmtzKSB7XG4gICAgICBpZiAoaXNBcnJheShjaHVua3MpKSB7XG4gICAgICAgIGNodW5rcyA9IGNodW5rcy5qb2luKCcnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3JjID0gY2h1bmtzICsgdGhpcy5zcmM7XG4gICAgfSxcbiAgICB0b1N0cmluZ1dpdGhTb3VyY2VNYXA6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgY29kZTogdGhpcy50b1N0cmluZygpIH07XG4gICAgfSxcbiAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcmM7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBjYXN0Q2h1bmsoY2h1bmssIGNvZGVHZW4sIGxvYykge1xuICBpZiAoaXNBcnJheShjaHVuaykpIHtcbiAgICBsZXQgcmV0ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2h1bmsubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHJldC5wdXNoKGNvZGVHZW4ud3JhcChjaHVua1tpXSwgbG9jKSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGNodW5rID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIGNodW5rID09PSAnbnVtYmVyJykge1xuICAgIC8vIEhhbmRsZSBwcmltaXRpdmVzIHRoYXQgdGhlIFNvdXJjZU5vZGUgd2lsbCB0aHJvdyB1cCBvblxuICAgIHJldHVybiBjaHVuayArICcnO1xuICB9XG4gIHJldHVybiBjaHVuaztcbn1cblxuZnVuY3Rpb24gQ29kZUdlbihzcmNGaWxlKSB7XG4gIHRoaXMuc3JjRmlsZSA9IHNyY0ZpbGU7XG4gIHRoaXMuc291cmNlID0gW107XG59XG5cbkNvZGVHZW4ucHJvdG90eXBlID0ge1xuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiAhdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9LFxuICBwcmVwZW5kOiBmdW5jdGlvbihzb3VyY2UsIGxvYykge1xuICAgIHRoaXMuc291cmNlLnVuc2hpZnQodGhpcy53cmFwKHNvdXJjZSwgbG9jKSk7XG4gIH0sXG4gIHB1c2g6IGZ1bmN0aW9uKHNvdXJjZSwgbG9jKSB7XG4gICAgdGhpcy5zb3VyY2UucHVzaCh0aGlzLndyYXAoc291cmNlLCBsb2MpKTtcbiAgfSxcblxuICBtZXJnZTogZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNvdXJjZSA9IHRoaXMuZW1wdHkoKTtcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgc291cmNlLmFkZChbJyAgJywgbGluZSwgJ1xcbiddKTtcbiAgICB9KTtcbiAgICByZXR1cm4gc291cmNlO1xuICB9LFxuXG4gIGVhY2g6IGZ1bmN0aW9uKGl0ZXIpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5zb3VyY2UubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGl0ZXIodGhpcy5zb3VyY2VbaV0pO1xuICAgIH1cbiAgfSxcblxuICBlbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGxvYyA9IHRoaXMuY3VycmVudExvY2F0aW9uIHx8IHsgc3RhcnQ6IHt9IH07XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VOb2RlKGxvYy5zdGFydC5saW5lLCBsb2Muc3RhcnQuY29sdW1uLCB0aGlzLnNyY0ZpbGUpO1xuICB9LFxuICB3cmFwOiBmdW5jdGlvbihjaHVuaywgbG9jID0gdGhpcy5jdXJyZW50TG9jYXRpb24gfHwgeyBzdGFydDoge30gfSkge1xuICAgIGlmIChjaHVuayBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpIHtcbiAgICAgIHJldHVybiBjaHVuaztcbiAgICB9XG5cbiAgICBjaHVuayA9IGNhc3RDaHVuayhjaHVuaywgdGhpcywgbG9jKTtcblxuICAgIHJldHVybiBuZXcgU291cmNlTm9kZShcbiAgICAgIGxvYy5zdGFydC5saW5lLFxuICAgICAgbG9jLnN0YXJ0LmNvbHVtbixcbiAgICAgIHRoaXMuc3JjRmlsZSxcbiAgICAgIGNodW5rXG4gICAgKTtcbiAgfSxcblxuICBmdW5jdGlvbkNhbGw6IGZ1bmN0aW9uKGZuLCB0eXBlLCBwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSB0aGlzLmdlbmVyYXRlTGlzdChwYXJhbXMpO1xuICAgIHJldHVybiB0aGlzLndyYXAoW2ZuLCB0eXBlID8gJy4nICsgdHlwZSArICcoJyA6ICcoJywgcGFyYW1zLCAnKSddKTtcbiAgfSxcblxuICBxdW90ZWRTdHJpbmc6IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiAoXG4gICAgICAnXCInICtcbiAgICAgIChzdHIgKyAnJylcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKVxuICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG4gICAgICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJylcbiAgICAgICAgLnJlcGxhY2UoL1xcdTIwMjgvZywgJ1xcXFx1MjAyOCcpIC8vIFBlciBFY21hLTI2MiA3LjMgKyA3LjguNFxuICAgICAgICAucmVwbGFjZSgvXFx1MjAyOS9nLCAnXFxcXHUyMDI5JykgK1xuICAgICAgJ1wiJ1xuICAgICk7XG4gIH0sXG5cbiAgb2JqZWN0TGl0ZXJhbDogZnVuY3Rpb24ob2JqKSB7XG4gICAgbGV0IHBhaXJzID0gW107XG5cbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IGNhc3RDaHVuayhvYmpba2V5XSwgdGhpcyk7XG4gICAgICBpZiAodmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBhaXJzLnB1c2goW3RoaXMucXVvdGVkU3RyaW5nKGtleSksICc6JywgdmFsdWVdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCByZXQgPSB0aGlzLmdlbmVyYXRlTGlzdChwYWlycyk7XG4gICAgcmV0LnByZXBlbmQoJ3snKTtcbiAgICByZXQuYWRkKCd9Jyk7XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcblxuICBnZW5lcmF0ZUxpc3Q6IGZ1bmN0aW9uKGVudHJpZXMpIHtcbiAgICBsZXQgcmV0ID0gdGhpcy5lbXB0eSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChpKSB7XG4gICAgICAgIHJldC5hZGQoJywnKTtcbiAgICAgIH1cblxuICAgICAgcmV0LmFkZChjYXN0Q2h1bmsoZW50cmllc1tpXSwgdGhpcykpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgZ2VuZXJhdGVBcnJheTogZnVuY3Rpb24oZW50cmllcykge1xuICAgIGxldCByZXQgPSB0aGlzLmdlbmVyYXRlTGlzdChlbnRyaWVzKTtcbiAgICByZXQucHJlcGVuZCgnWycpO1xuICAgIHJldC5hZGQoJ10nKTtcblxuICAgIHJldHVybiByZXQ7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvZGVHZW47XG4iXX0=
