/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HandlebarsEnvironment = HandlebarsEnvironment;
Object.defineProperty(exports, "createFrame", {
  enumerable: true,
  get: function get() {
    return _utils.createFrame;
  }
});
Object.defineProperty(exports, "logger", {
  enumerable: true,
  get: function get() {
    return _logger["default"];
  }
});
exports.log = exports.REVISION_CHANGES = exports.LAST_COMPATIBLE_COMPILER_REVISION = exports.COMPILER_REVISION = exports.VERSION = void 0;

var
/*istanbul ignore next*/
_utils = require("./utils");

var
/*istanbul ignore next*/
_exception = _interopRequireDefault(require("./exception"));

var
/*istanbul ignore next*/
_helpers = require("./helpers");

var
/*istanbul ignore next*/
_decorators = require("./decorators");

var
/*istanbul ignore next*/
_logger = _interopRequireDefault(require("./logger"));

var
/*istanbul ignore next*/
_protoAccess = require("./internal/proto-access");

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var VERSION = '4.7.7';

/*istanbul ignore next*/
exports.VERSION = VERSION;
var COMPILER_REVISION = 8;

/*istanbul ignore next*/
exports.COMPILER_REVISION = COMPILER_REVISION;
var LAST_COMPATIBLE_COMPILER_REVISION = 7;

/*istanbul ignore next*/
exports.LAST_COMPATIBLE_COMPILER_REVISION = LAST_COMPATIBLE_COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2',
  // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0 <4.3.0',
  8: '>= 4.3.0'
};

/*istanbul ignore next*/
exports.REVISION_CHANGES = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials, decorators) {
  this.helpers = helpers || {};
  this.partials = partials || {};
  this.decorators = decorators || {};

  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _helpers.
  /*istanbul ignore next*/
  registerDefaultHelpers)(this);

  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _decorators.
  /*istanbul ignore next*/
  registerDefaultDecorators)(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,
  logger:
  /*istanbul ignore next*/
  _logger[
  /*istanbul ignore next*/
  "default"],
  log:
  /*istanbul ignore next*/
  _logger[
  /*istanbul ignore next*/
  "default"].log,
  registerHelper: function
  /*istanbul ignore next*/
  registerHelper(name, fn) {
    if (
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    toString.call(name) === objectType) {
      if (fn) {
        throw new
        /*istanbul ignore next*/
        _exception[
        /*istanbul ignore next*/
        "default"]('Arg not supported with multiple helpers');
      }

      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _utils.
      /*istanbul ignore next*/
      extend)(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function
  /*istanbul ignore next*/
  unregisterHelper(name) {
    delete this.helpers[name];
  },
  registerPartial: function
  /*istanbul ignore next*/
  registerPartial(name, partial) {
    if (
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    toString.call(name) === objectType) {
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _utils.
      /*istanbul ignore next*/
      extend)(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new
        /*istanbul ignore next*/
        _exception[
        /*istanbul ignore next*/
        "default"](
        /*istanbul ignore next*/
        "Attempting to register a partial called \"".concat(name, "\" as undefined"));
      }

      this.partials[name] = partial;
    }
  },
  unregisterPartial: function
  /*istanbul ignore next*/
  unregisterPartial(name) {
    delete this.partials[name];
  },
  registerDecorator: function
  /*istanbul ignore next*/
  registerDecorator(name, fn) {
    if (
    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    toString.call(name) === objectType) {
      if (fn) {
        throw new
        /*istanbul ignore next*/
        _exception[
        /*istanbul ignore next*/
        "default"]('Arg not supported with multiple decorators');
      }

      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _utils.
      /*istanbul ignore next*/
      extend)(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function
  /*istanbul ignore next*/
  unregisterDecorator(name) {
    delete this.decorators[name];
  },

  /*istanbul ignore next*/

  /**
   * Reset the memory of illegal property accesses that have already been logged.
   * @deprecated should only be used in handlebars test-cases
   */
  resetLoggedPropertyAccesses: function resetLoggedPropertyAccesses() {
    /*istanbul ignore next*/
    (0,
    /*istanbul ignore next*/
    _protoAccess.
    /*istanbul ignore next*/
    resetLoggedProperties)();
  }
};
var log =
/*istanbul ignore next*/
_logger[
/*istanbul ignore next*/
"default"].log;

/*istanbul ignore next*/
exports.log = log;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2Jhc2UuanMiXSwibmFtZXMiOlsiVkVSU0lPTiIsIkNPTVBJTEVSX1JFVklTSU9OIiwiTEFTVF9DT01QQVRJQkxFX0NPTVBJTEVSX1JFVklTSU9OIiwiUkVWSVNJT05fQ0hBTkdFUyIsIm9iamVjdFR5cGUiLCJIYW5kbGViYXJzRW52aXJvbm1lbnQiLCJoZWxwZXJzIiwicGFydGlhbHMiLCJkZWNvcmF0b3JzIiwicmVnaXN0ZXJEZWZhdWx0SGVscGVycyIsInJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnMiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsImxvZ2dlciIsImxvZyIsInJlZ2lzdGVySGVscGVyIiwibmFtZSIsImZuIiwidG9TdHJpbmciLCJjYWxsIiwiRXhjZXB0aW9uIiwiZXh0ZW5kIiwidW5yZWdpc3RlckhlbHBlciIsInJlZ2lzdGVyUGFydGlhbCIsInBhcnRpYWwiLCJ1bnJlZ2lzdGVyUGFydGlhbCIsInJlZ2lzdGVyRGVjb3JhdG9yIiwidW5yZWdpc3RlckRlY29yYXRvciIsInJlc2V0TG9nZ2VkUHJvcGVydHlBY2Nlc3NlcyIsInJlc2V0TG9nZ2VkUHJvcGVydGllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFFTyxJQUFNQSxPQUFPLEdBQUcsT0FBaEI7Ozs7QUFDQSxJQUFNQyxpQkFBaUIsR0FBRyxDQUExQjs7OztBQUNBLElBQU1DLGlDQUFpQyxHQUFHLENBQTFDOzs7O0FBRUEsSUFBTUMsZ0JBQWdCLEdBQUc7QUFDOUIsS0FBRyxhQUQyQjtBQUNaO0FBQ2xCLEtBQUcsZUFGMkI7QUFHOUIsS0FBRyxlQUgyQjtBQUk5QixLQUFHLFVBSjJCO0FBSzlCLEtBQUcsa0JBTDJCO0FBTTlCLEtBQUcsaUJBTjJCO0FBTzlCLEtBQUcsaUJBUDJCO0FBUTlCLEtBQUc7QUFSMkIsQ0FBekI7Ozs7QUFXUCxJQUFNQyxVQUFVLEdBQUcsaUJBQW5COztBQUVPLFNBQVNDLHFCQUFULENBQStCQyxPQUEvQixFQUF3Q0MsUUFBeEMsRUFBa0RDLFVBQWxELEVBQThEO0FBQ25FLE9BQUtGLE9BQUwsR0FBZUEsT0FBTyxJQUFJLEVBQTFCO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQkEsUUFBUSxJQUFJLEVBQTVCO0FBQ0EsT0FBS0MsVUFBTCxHQUFrQkEsVUFBVSxJQUFJLEVBQWhDOztBQUVBO0FBQUE7QUFBQUM7QUFBQUE7QUFBQUE7QUFBQUEsMEJBQXVCLElBQXZCOztBQUNBO0FBQUE7QUFBQUM7QUFBQUE7QUFBQUE7QUFBQUEsNkJBQTBCLElBQTFCO0FBQ0Q7O0FBRURMLHFCQUFxQixDQUFDTSxTQUF0QixHQUFrQztBQUNoQ0MsRUFBQUEsV0FBVyxFQUFFUCxxQkFEbUI7QUFHaENRLEVBQUFBLE1BQU07QUFBRUE7QUFBQUE7QUFBQUE7QUFBQUEsWUFId0I7QUFJaENDLEVBQUFBLEdBQUc7QUFBRUQ7QUFBQUE7QUFBQUE7QUFBQUEsYUFBT0MsR0FKb0I7QUFNaENDLEVBQUFBLGNBQWMsRUFBRTtBQUFBO0FBQUEsaUJBQVNDLElBQVQsRUFBZUMsRUFBZixFQUFtQjtBQUNqQztBQUFJQztBQUFBQTtBQUFBQTtBQUFBQSxhQUFTQyxJQUFULENBQWNILElBQWQsTUFBd0JaLFVBQTVCLEVBQXdDO0FBQ3RDLFVBQUlhLEVBQUosRUFBUTtBQUNOLGNBQU07QUFBSUc7QUFBQUE7QUFBQUE7QUFBQUEsa0JBQUosQ0FBYyx5Q0FBZCxDQUFOO0FBQ0Q7O0FBQ0Q7QUFBQTtBQUFBQztBQUFBQTtBQUFBQTtBQUFBQSxjQUFPLEtBQUtmLE9BQVosRUFBcUJVLElBQXJCO0FBQ0QsS0FMRCxNQUtPO0FBQ0wsV0FBS1YsT0FBTCxDQUFhVSxJQUFiLElBQXFCQyxFQUFyQjtBQUNEO0FBQ0YsR0FmK0I7QUFnQmhDSyxFQUFBQSxnQkFBZ0IsRUFBRTtBQUFBO0FBQUEsbUJBQVNOLElBQVQsRUFBZTtBQUMvQixXQUFPLEtBQUtWLE9BQUwsQ0FBYVUsSUFBYixDQUFQO0FBQ0QsR0FsQitCO0FBb0JoQ08sRUFBQUEsZUFBZSxFQUFFO0FBQUE7QUFBQSxrQkFBU1AsSUFBVCxFQUFlUSxPQUFmLEVBQXdCO0FBQ3ZDO0FBQUlOO0FBQUFBO0FBQUFBO0FBQUFBLGFBQVNDLElBQVQsQ0FBY0gsSUFBZCxNQUF3QlosVUFBNUIsRUFBd0M7QUFDdEM7QUFBQTtBQUFBaUI7QUFBQUE7QUFBQUE7QUFBQUEsY0FBTyxLQUFLZCxRQUFaLEVBQXNCUyxJQUF0QjtBQUNELEtBRkQsTUFFTztBQUNMLFVBQUksT0FBT1EsT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUNsQyxjQUFNO0FBQUlKO0FBQUFBO0FBQUFBO0FBQUFBLGtCQUFKO0FBQUE7QUFBQSw0REFDd0NKLElBRHhDLHFCQUFOO0FBR0Q7O0FBQ0QsV0FBS1QsUUFBTCxDQUFjUyxJQUFkLElBQXNCUSxPQUF0QjtBQUNEO0FBQ0YsR0EvQitCO0FBZ0NoQ0MsRUFBQUEsaUJBQWlCLEVBQUU7QUFBQTtBQUFBLG9CQUFTVCxJQUFULEVBQWU7QUFDaEMsV0FBTyxLQUFLVCxRQUFMLENBQWNTLElBQWQsQ0FBUDtBQUNELEdBbEMrQjtBQW9DaENVLEVBQUFBLGlCQUFpQixFQUFFO0FBQUE7QUFBQSxvQkFBU1YsSUFBVCxFQUFlQyxFQUFmLEVBQW1CO0FBQ3BDO0FBQUlDO0FBQUFBO0FBQUFBO0FBQUFBLGFBQVNDLElBQVQsQ0FBY0gsSUFBZCxNQUF3QlosVUFBNUIsRUFBd0M7QUFDdEMsVUFBSWEsRUFBSixFQUFRO0FBQ04sY0FBTTtBQUFJRztBQUFBQTtBQUFBQTtBQUFBQSxrQkFBSixDQUFjLDRDQUFkLENBQU47QUFDRDs7QUFDRDtBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLGNBQU8sS0FBS2IsVUFBWixFQUF3QlEsSUFBeEI7QUFDRCxLQUxELE1BS087QUFDTCxXQUFLUixVQUFMLENBQWdCUSxJQUFoQixJQUF3QkMsRUFBeEI7QUFDRDtBQUNGLEdBN0MrQjtBQThDaENVLEVBQUFBLG1CQUFtQixFQUFFO0FBQUE7QUFBQSxzQkFBU1gsSUFBVCxFQUFlO0FBQ2xDLFdBQU8sS0FBS1IsVUFBTCxDQUFnQlEsSUFBaEIsQ0FBUDtBQUNELEdBaEQrQjs7QUFBQTs7QUFpRGhDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0VZLEVBQUFBLDJCQXJEZ0MseUNBcURGO0FBQzVCO0FBQUE7QUFBQUM7QUFBQUE7QUFBQUE7QUFBQUE7QUFDRDtBQXZEK0IsQ0FBbEM7QUEwRE8sSUFBSWYsR0FBRztBQUFHRDtBQUFBQTtBQUFBQTtBQUFBQSxXQUFPQyxHQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUZyYW1lLCBleHRlbmQsIHRvU3RyaW5nIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vZXhjZXB0aW9uJztcbmltcG9ydCB7IHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMgfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IHsgcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyB9IGZyb20gJy4vZGVjb3JhdG9ycyc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IHJlc2V0TG9nZ2VkUHJvcGVydGllcyB9IGZyb20gJy4vaW50ZXJuYWwvcHJvdG8tYWNjZXNzJztcblxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSAnNC43LjcnO1xuZXhwb3J0IGNvbnN0IENPTVBJTEVSX1JFVklTSU9OID0gODtcbmV4cG9ydCBjb25zdCBMQVNUX0NPTVBBVElCTEVfQ09NUElMRVJfUkVWSVNJT04gPSA3O1xuXG5leHBvcnQgY29uc3QgUkVWSVNJT05fQ0hBTkdFUyA9IHtcbiAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcbiAgMjogJz09IDEuMC4wLXJjLjMnLFxuICAzOiAnPT0gMS4wLjAtcmMuNCcsXG4gIDQ6ICc9PSAxLngueCcsXG4gIDU6ICc9PSAyLjAuMC1hbHBoYS54JyxcbiAgNjogJz49IDIuMC4wLWJldGEuMScsXG4gIDc6ICc+PSA0LjAuMCA8NC4zLjAnLFxuICA4OiAnPj0gNC4zLjAnXG59O1xuXG5jb25zdCBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMsIGRlY29yYXRvcnMpIHtcbiAgdGhpcy5oZWxwZXJzID0gaGVscGVycyB8fCB7fTtcbiAgdGhpcy5wYXJ0aWFscyA9IHBhcnRpYWxzIHx8IHt9O1xuICB0aGlzLmRlY29yYXRvcnMgPSBkZWNvcmF0b3JzIHx8IHt9O1xuXG4gIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnModGhpcyk7XG4gIHJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnModGhpcyk7XG59XG5cbkhhbmRsZWJhcnNFbnZpcm9ubWVudC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBIYW5kbGViYXJzRW52aXJvbm1lbnQsXG5cbiAgbG9nZ2VyOiBsb2dnZXIsXG4gIGxvZzogbG9nZ2VyLmxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpO1xuICAgICAgfVxuICAgICAgZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcbiAgdW5yZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLmhlbHBlcnNbbmFtZV07XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBwYXJ0aWFsKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGV4dGVuZCh0aGlzLnBhcnRpYWxzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBwYXJ0aWFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgICAgIGBBdHRlbXB0aW5nIHRvIHJlZ2lzdGVyIGEgcGFydGlhbCBjYWxsZWQgXCIke25hbWV9XCIgYXMgdW5kZWZpbmVkYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHBhcnRpYWw7XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLnBhcnRpYWxzW25hbWVdO1xuICB9LFxuXG4gIHJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoZm4pIHtcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBkZWNvcmF0b3JzJyk7XG4gICAgICB9XG4gICAgICBleHRlbmQodGhpcy5kZWNvcmF0b3JzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWNvcmF0b3JzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdG9yc1tuYW1lXTtcbiAgfSxcbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtZW1vcnkgb2YgaWxsZWdhbCBwcm9wZXJ0eSBhY2Nlc3NlcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIGxvZ2dlZC5cbiAgICogQGRlcHJlY2F0ZWQgc2hvdWxkIG9ubHkgYmUgdXNlZCBpbiBoYW5kbGViYXJzIHRlc3QtY2FzZXNcbiAgICovXG4gIHJlc2V0TG9nZ2VkUHJvcGVydHlBY2Nlc3NlcygpIHtcbiAgICByZXNldExvZ2dlZFByb3BlcnRpZXMoKTtcbiAgfVxufTtcblxuZXhwb3J0IGxldCBsb2cgPSBsb2dnZXIubG9nO1xuXG5leHBvcnQgeyBjcmVhdGVGcmFtZSwgbG9nZ2VyIH07XG4iXX0=
