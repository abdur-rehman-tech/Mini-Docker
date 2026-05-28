/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
exports.isArray = exports.isFunction = exports.toString = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};
var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj
/* , ...source */
) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString; // Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt

/* eslint-disable func-style */

/*istanbul ignore next*/
exports.toString = toString;

var isFunction = function
/*istanbul ignore next*/
isFunction(value) {
  return typeof value === 'function';
}; // fallback for older versions of Chrome and Safari

/* istanbul ignore next */


/*istanbul ignore next*/
exports.isFunction = isFunction;

if (isFunction(/x/)) {
  /*istanbul ignore next*/
  exports.isFunction = isFunction = function
  /*istanbul ignore next*/
  isFunction(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value &&
  /*istanbul ignore next*/
  _typeof(value) === 'object' ? toString.call(value) === '[object Array]' : false;
}; // Older IE versions do not directly support indexOf so we must implement our own, sadly.


/*istanbul ignore next*/
exports.isArray = isArray;

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }

  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    } // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.


    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }

  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3V0aWxzLmpzIl0sIm5hbWVzIjpbImVzY2FwZSIsImJhZENoYXJzIiwicG9zc2libGUiLCJlc2NhcGVDaGFyIiwiY2hyIiwiZXh0ZW5kIiwib2JqIiwiaSIsImFyZ3VtZW50cyIsImxlbmd0aCIsImtleSIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsInRvU3RyaW5nIiwiaXNGdW5jdGlvbiIsInZhbHVlIiwiaXNBcnJheSIsIkFycmF5IiwiaW5kZXhPZiIsImFycmF5IiwibGVuIiwiZXNjYXBlRXhwcmVzc2lvbiIsInN0cmluZyIsInRvSFRNTCIsInRlc3QiLCJyZXBsYWNlIiwiaXNFbXB0eSIsImNyZWF0ZUZyYW1lIiwib2JqZWN0IiwiZnJhbWUiLCJfcGFyZW50IiwiYmxvY2tQYXJhbXMiLCJwYXJhbXMiLCJpZHMiLCJwYXRoIiwiYXBwZW5kQ29udGV4dFBhdGgiLCJjb250ZXh0UGF0aCIsImlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLE1BQU0sR0FBRztBQUNiLE9BQUssT0FEUTtBQUViLE9BQUssTUFGUTtBQUdiLE9BQUssTUFIUTtBQUliLE9BQUssUUFKUTtBQUtiLE9BQUssUUFMUTtBQU1iLE9BQUssUUFOUTtBQU9iLE9BQUs7QUFQUSxDQUFmO0FBVUEsSUFBTUMsUUFBUSxHQUFHLFlBQWpCO0FBQUEsSUFDRUMsUUFBUSxHQUFHLFdBRGI7O0FBR0EsU0FBU0MsVUFBVCxDQUFvQkMsR0FBcEIsRUFBeUI7QUFDdkIsU0FBT0osTUFBTSxDQUFDSSxHQUFELENBQWI7QUFDRDs7QUFFTSxTQUFTQyxNQUFULENBQWdCQztBQUFJO0FBQXBCLEVBQXVDO0FBQzVDLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0MsU0FBUyxDQUFDQyxNQUE5QixFQUFzQ0YsQ0FBQyxFQUF2QyxFQUEyQztBQUN6QyxTQUFLLElBQUlH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QUZNLE1BRUE7QUFDTCxXQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVNLFNBQVNvQixXQUFULENBQXFCQyxNQUFyQixFQUE2QjtBQUNsQyxNQUFJQyxLQUFLLEdBQUcxQixNQUFNLENBQUMsRUFBRCxFQUFLeUIsTUFBTCxDQUFsQjtBQUNBQyxFQUFBQSxLQUFLLENBQUNDLE9BQU4sR0FBZ0JGLE1BQWhCO0FBQ0EsU0FBT0MsS0FBUDtBQUNEOztBQUVNLFNBQVNFLFdBQVQsQ0FBcUJDLE1BQXJCLEVBQTZCQyxHQUE3QixFQUFrQztBQUN2Q0QsRUFBQUEsTUFBTSxDQUFDRSxJQUFQLEdBQWNELEdBQWQ7QUFDQSxTQUFPRCxNQUFQO0FBQ0Q7O0FBRU0sU0FBU0csaUJBQVQsQ0FBMkJDLFdBQTNCLEVBQXdDQyxFQUF4QyxFQUE0QztBQUNqRCxTQUFPLENBQUNELFdBQVcsR0FBR0EsV0FBVyxHQUFHLEdBQWpCLEdBQXVCLEVBQW5DLElBQXlDQyxFQUFoRDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZXNjYXBlID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90OycsXG4gIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgJ2AnOiAnJiN4NjA7JyxcbiAgJz0nOiAnJiN4M0Q7J1xufTtcblxuY29uc3QgYmFkQ2hhcnMgPSAvWyY8PlwiJ2A9XS9nLFxuICBwb3NzaWJsZSA9IC9bJjw+XCInYD1dLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKG9iaiAvKiAsIC4uLnNvdXJjZSAqLykge1xuICBmb3IgKGxldCBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGtleSBpbiBhcmd1bWVudHNbaV0pIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJndW1lbnRzW2ldLCBrZXkpKSB7XG4gICAgICAgIG9ialtrZXldID0gYXJndW1lbnRzW2ldW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZXhwb3J0IGxldCB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbi8qIGVzbGludC1kaXNhYmxlIGZ1bmMtc3R5bGUgKi9cbmxldCBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAoaXNGdW5jdGlvbigveC8pKSB7XG4gIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiAoXG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nXG4gICAgKTtcbiAgfTtcbn1cbmV4cG9ydCB7IGlzRnVuY3Rpb24gfTtcbi8qIGVzbGludC1lbmFibGUgZnVuYy1zdHlsZSAqL1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGNvbnN0IGlzQXJyYXkgPVxuICBBcnJheS5pc0FycmF5IHx8XG4gIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbi8vIE9sZGVyIElFIHZlcnNpb25zIGRvIG5vdCBkaXJlY3RseSBzdXBwb3J0IGluZGV4T2Ygc28gd2UgbXVzdCBpbXBsZW1lbnQgb3VyIG93biwgc2FkbHkuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUpIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUV4cHJlc3Npb24oc3RyaW5nKSB7XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIC8vIGRvbid0IGVzY2FwZSBTYWZlU3RyaW5ncywgc2luY2UgdGhleSdyZSBhbHJlYWR5IHNhZmVcbiAgICBpZiAoc3RyaW5nICYmIHN0cmluZy50b0hUTUwpIHtcbiAgICAgIHJldHVybiBzdHJpbmcudG9IVE1MKCk7XG4gICAgfSBlbHNlIGlmIChzdHJpbmcgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSBpZiAoIXN0cmluZykge1xuICAgICAgcmV0dXJuIHN0cmluZyArICcnO1xuICAgIH1cblxuICAgIC8vIEZvcmNlIGEgc3RyaW5nIGNvbnZlcnNpb24gYXMgdGhpcyB3aWxsIGJlIGRvbmUgYnkgdGhlIGFwcGVuZCByZWdhcmRsZXNzIGFuZFxuICAgIC8vIHRoZSByZWdleCB0ZXN0IHdpbGwgZG8gdGhpcyB0cmFuc3BhcmVudGx5IGJlaGluZCB0aGUgc2NlbmVzLCBjYXVzaW5nIGlzc3VlcyBpZlxuICAgIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICAgIHN0cmluZyA9ICcnICsgc3RyaW5nO1xuICB9XG5cbiAgaWYgKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nO1xuICB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKG9iamVjdCkge1xuICBsZXQgZnJhbWUgPSBleHRlbmQoe30sIG9iamVjdCk7XG4gIGZyYW1lLl9wYXJlbnQgPSBvYmplY3Q7XG4gIHJldHVybiBmcmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2NrUGFyYW1zKHBhcmFtcywgaWRzKSB7XG4gIHBhcmFtcy5wYXRoID0gaWRzO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kQ29udGV4dFBhdGgoY29udGV4dFBhdGgsIGlkKSB7XG4gIHJldHVybiAoY29udGV4dFBhdGggPyBjb250ZXh0UGF0aCArICcuJyA6ICcnKSArIGlkO1xufVxuIl19
