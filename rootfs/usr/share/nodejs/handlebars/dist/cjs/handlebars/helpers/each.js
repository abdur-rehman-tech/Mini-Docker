/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var
/*istanbul ignore next*/
_utils = require("../utils");

var
/*istanbul ignore next*/
_exception = _interopRequireDefault(require("../exception"));

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function
/*istanbul ignore next*/
_default(instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new
      /*istanbul ignore next*/
      _exception[
      /*istanbul ignore next*/
      "default"]('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data,
        contextPath;

    if (options.data && options.ids) {
      contextPath =
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _utils.
      /*istanbul ignore next*/
      appendContextPath)(options.data.contextPath, options.ids[0]) + '.';
    }

    if (
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    isFunction)(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data =
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _utils.
      /*istanbul ignore next*/
      createFrame)(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams:
        /*istanbul ignore next*/
        (0,
        /*istanbul ignore next*/
        _utils.
        /*istanbul ignore next*/
        blockParams)([context[field], field], [contextPath + field, null])
      });
    }

    if (context &&
    /*istanbul ignore next*/
    _typeof(context) === 'object') {
      if (
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _utils.
      /*istanbul ignore next*/
      isArray)(context)) {
        for (var j = context.length; i < j; i++) {
          if (i in context) {
            execIteration(i, i, i === context.length - 1);
          }
        }
      } else if (global.Symbol && context[global.Symbol.iterator]) {
        var newContext = [];
        var iterator = context[global.Symbol.iterator]();

        for (var it = iterator.next(); !it.done; it = iterator.next()) {
          newContext.push(it.value);
        }

        context = newContext;

        for (var _j = context.length; i < _j; i++) {
          execIteration(i, i, i === context.length - 1);
        }
      } else {
        var priorKey;
        Object.keys(context).forEach(function (key) {
          // We're running the iterations one step out of sync so we can detect
          // the last iteration without have to scan the object twice and create
          // an itermediate keys array.
          if (priorKey !== undefined) {
            execIteration(priorKey, i - 1);
          }

          priorKey = key;
          i++;
        });

        if (priorKey !== undefined) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
}

/*istanbul ignore next*/
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvZWFjaC5qcyJdLCJuYW1lcyI6WyJpbnN0YW5jZSIsInJlZ2lzdGVySGVscGVyIiwiY29udGV4dCIsIm9wdGlvbnMiLCJFeGNlcHRpb24iLCJmbiIsImludmVyc2UiLCJpIiwicmV0IiwiZGF0YSIsImNvbnRleHRQYXRoIiwiaWRzIiwiYXBwZW5kQ29udGV4dFBhdGgiLCJpc0Z1bmN0aW9uIiwiY2FsbCIsImNyZWF0ZUZyYW1lIiwiZXhlY0l0ZXJhdGlvbiIsImZpZWxkIiwiaW5kZXgiLCJsYXN0Iiwia2V5IiwiZmlyc3QiLCJibG9ja1BhcmFtcyIsImlzQXJyYXkiLCJqIiwibGVuZ3RoIiwiZ2xvYmFsIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJuZXdDb250ZXh0IiwiaXQiLCJuZXh0IiwiZG9uZSIsInB1c2giLCJ2YWx1ZSIsInByaW9yS2V5IiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOztBQU9BO0FBQUE7QUFBQTs7Ozs7O0FBRWU7QUFBQTtBQUFBLFNBQVNBLFFBQVQsRUFBbUI7QUFDaENBLEVBQUFBLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxVQUFTQyxPQUFULEVBQWtCQyxPQUFsQixFQUEyQjtBQUN6RCxRQUFJLENBQUNBLE9BQUwsRUFBYztBQUNaLFlBQU07QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUEsZ0JBQUosQ0FBYyw2QkFBZCxDQUFOO0FBQ0Q7O0FBRUQsUUFBSUMsRUFBRSxHQUFHRixPQUFPLENBQUNFLEVBQWpCO0FBQUEsUUFDRUMsT0FBTyxHQUFHSCxPQUFPLENBQUNHLE9BRHBCO0FBQUEsUUFFRUMsQ0FBQyxHQUFHLENBRk47QUFBQSxRQUdFQyxHQUFHLEdBQUcsRUFIUjtBQUFBLFFBSUVDLElBSkY7QUFBQSxRQUtFQyxXQUxGOztBQU9BLFFBQUlQLE9BQU8sQ0FBQ00s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QVY7O0FBQ0EsYUFBSyxJQUFJTCxFQUFDLEdBQUd0QixPQUFPLENBQUN1QixNQUFyQixFQUE2QmxCLENBQUMsR0FBR2lCLEVBQWpDLEVBQW9DakIsQ0FBQyxFQUFyQyxFQUF5QztBQUN2Q1MsVUFBQUEsYUFBYSxDQUFDVCxDQUFELEVBQUlBLENBQUosRUFBT0EsQ0FBQyxLQUFLTCxPQUFPLENBQUN1QixNQUFSLEdBQWlCLENBQTlCLENBQWI7QUFDRDtBQUNGLE9BVk0sTUFVQTtBQUNMLFlBQUlVLFFBQUo7QUFFQUMsUUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVluQyxPQUFaLEVBQXFCb0MsT0FBckIsQ0FBNkIsVUFBQWxCLEdBQUcsRUFBSTtBQUNsQztBQUNBO0FBQ0E7QUFDQSxjQUFJZSxRQUFRLEtBQUtJLFNBQWpCLEVBQTRCO0FBQzFCdkIsWUFBQUEsYUFBYSxDQUFDbUIsUUFBRCxFQUFXNUIsQ0FBQyxHQUFHLENBQWYsQ0FBYjtBQUNEOztBQUNENEIsVUFBQUEsUUFBUSxHQUFHZixHQUFYO0FBQ0FiLFVBQUFBLENBQUM7QUFDRixTQVREOztBQVVBLFlBQUk0QixRQUFRLEtBQUtJLFNBQWpCLEVBQTRCO0FBQzFCdkIsVUFBQUEsYUFBYSxDQUFDbUIsUUFBRCxFQUFXNUIsQ0FBQyxHQUFHLENBQWYsRUFBa0IsSUFBbEIsQ0FBYjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxRQUFJQSxDQUFDLEtBQUssQ0FBVixFQUFhO0FBQ1hDLE1BQUFBLEdBQUcsR0FBR0YsT0FBTyxDQUFDLElBQUQsQ0FBYjtBQUNEOztBQUVELFdBQU9FLEdBQVA7QUFDRCxHQXpGRDtBQTBGRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGFwcGVuZENvbnRleHRQYXRoLFxuICBibG9ja1BhcmFtcyxcbiAgY3JlYXRlRnJhbWUsXG4gIGlzQXJyYXksXG4gIGlzRnVuY3Rpb25cbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ011c3QgcGFzcyBpdGVyYXRvciB0byAjZWFjaCcpO1xuICAgIH1cblxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm4sXG4gICAgICBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlLFxuICAgICAgaSA9IDAsXG4gICAgICByZXQgPSAnJyxcbiAgICAgIGRhdGEsXG4gICAgICBjb250ZXh0UGF0aDtcblxuICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcbiAgICAgIGNvbnRleHRQYXRoID1cbiAgICAgICAgYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLmlkc1swXSkgKyAnLic7XG4gICAgfVxuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHtcbiAgICAgIGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgICAgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhlY0l0ZXJhdGlvbihmaWVsZCwgaW5kZXgsIGxhc3QpIHtcbiAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgIGRhdGEua2V5ID0gZmllbGQ7XG4gICAgICAgIGRhdGEuaW5kZXggPSBpbmRleDtcbiAgICAgICAgZGF0YS5maXJzdCA9IGluZGV4ID09PSAwO1xuICAgICAgICBkYXRhLmxhc3QgPSAhIWxhc3Q7XG5cbiAgICAgICAgaWYgKGNvbnRleHRQYXRoKSB7XG4gICAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IGNvbnRleHRQYXRoICsgZmllbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0ID1cbiAgICAgICAgcmV0ICtcbiAgICAgICAgZm4oY29udGV4dFtmaWVsZF0sIHtcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhcbiAgICAgICAgICAgIFtjb250ZXh0W2ZpZWxkXSwgZmllbGRdLFxuICAgICAgICAgICAgW2NvbnRleHRQYXRoICsgZmllbGQsIG51bGxdXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBjb250ZXh0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgIGlmIChpIGluIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGV4ZWNJdGVyYXRpb24oaSwgaSwgaSA9PT0gY29udGV4dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZ2xvYmFsLlN5bWJvbCAmJiBjb250ZXh0W2dsb2JhbC5TeW1ib2wuaXRlcmF0b3JdKSB7XG4gICAgICAgIGNvbnN0IG5ld0NvbnRleHQgPSBbXTtcbiAgICAgICAgY29uc3QgaXRlcmF0b3IgPSBjb250ZXh0W2dsb2JhbC5TeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgICAgIGZvciAobGV0IGl0ID0gaXRlcmF0b3IubmV4dCgpOyAhaXQuZG9uZTsgaXQgPSBpdGVyYXRvci5uZXh0KCkpIHtcbiAgICAgICAgICBuZXdDb250ZXh0LnB1c2goaXQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQgPSBuZXdDb250ZXh0O1xuICAgICAgICBmb3IgKGxldCBqID0gY29udGV4dC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICBleGVjSXRlcmF0aW9uKGksIGksIGkgPT09IGNvbnRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwcmlvcktleTtcblxuICAgICAgICBPYmplY3Qua2V5cyhjb250ZXh0KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgLy8gV2UncmUgcnVubmluZyB0aGUgaXRlcmF0aW9ucyBvbmUgc3RlcCBvdXQgb2Ygc3luYyBzbyB3ZSBjYW4gZGV0ZWN0XG4gICAgICAgICAgLy8gdGhlIGxhc3QgaXRlcmF0aW9uIHdpdGhvdXQgaGF2ZSB0byBzY2FuIHRoZSBvYmplY3QgdHdpY2UgYW5kIGNyZWF0ZVxuICAgICAgICAgIC8vIGFuIGl0ZXJtZWRpYXRlIGtleXMgYXJyYXkuXG4gICAgICAgICAgaWYgKHByaW9yS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGV4ZWNJdGVyYXRpb24ocHJpb3JLZXksIGkgLSAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcHJpb3JLZXkgPSBrZXk7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHByaW9yS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cbiJdfQ==
