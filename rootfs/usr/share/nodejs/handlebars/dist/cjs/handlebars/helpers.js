/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDefaultHelpers = registerDefaultHelpers;
exports.moveHelperToHooks = moveHelperToHooks;

var
/*istanbul ignore next*/
_blockHelperMissing = _interopRequireDefault(require("./helpers/block-helper-missing"));

var
/*istanbul ignore next*/
_each = _interopRequireDefault(require("./helpers/each"));

var
/*istanbul ignore next*/
_helperMissing = _interopRequireDefault(require("./helpers/helper-missing"));

var
/*istanbul ignore next*/
_if = _interopRequireDefault(require("./helpers/if"));

var
/*istanbul ignore next*/
_log = _interopRequireDefault(require("./helpers/log"));

var
/*istanbul ignore next*/
_lookup = _interopRequireDefault(require("./helpers/lookup"));

var
/*istanbul ignore next*/
_with = _interopRequireDefault(require("./helpers/with"));

/*istanbul ignore next*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function registerDefaultHelpers(instance) {
  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _blockHelperMissing[
  /*istanbul ignore next*/
  "default"])(instance);

  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _each[
  /*istanbul ignore next*/
  "default"])(instance);

  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _helperMissing[
  /*istanbul ignore next*/
  "default"])(instance);

  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _if[
  /*istanbul ignore next*/
  "default"])(instance);

  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _log[
  /*istanbul ignore next*/
  "default"])(instance);

  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _lookup[
  /*istanbul ignore next*/
  "default"])(instance);

  /*istanbul ignore next*/
  (0,
  /*istanbul ignore next*/
  _with[
  /*istanbul ignore next*/
  "default"])(instance);
}

function moveHelperToHooks(instance, helperName, keepHelper) {
  if (instance.helpers[helperName]) {
    instance.hooks[helperName] = instance.helpers[helperName];

    if (!keepHelper) {
      delete instance.helpers[helperName];
    }
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMuanMiXSwibmFtZXMiOlsicmVnaXN0ZXJEZWZhdWx0SGVscGVycyIsImluc3RhbmNlIiwicmVnaXN0ZXJCbG9ja0hlbHBlck1pc3NpbmciLCJyZWdpc3RlckVhY2giLCJyZWdpc3RlckhlbHBlck1pc3NpbmciLCJyZWdpc3RlcklmIiwicmVnaXN0ZXJMb2ciLCJyZWdpc3Rlckxvb2t1cCIsInJlZ2lzdGVyV2l0aCIsIm1vdmVIZWxwZXJUb0hvb2tzIiwiaGVscGVyTmFtZSIsImtlZXBIZWxwZXIiLCJoZWxwZXJzIiwiaG9va3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7OztBQUVPLFNBQVNBLHNCQUFULENBQWdDQyxRQUFoQyxFQUEwQztBQUMvQztBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLGNBQTJCRCxRQUEzQjs7QUFDQTtBQUFBO0FBQUFFO0FBQUFBO0FBQUFBO0FBQUFBLGNBQWFGLFFBQWI7O0FBQ0E7QUFBQTtBQUFBRztBQUFBQTtBQUFBQTtBQUFBQSxjQUFzQkgsUUFBdEI7O0FBQ0E7QUFBQTtBQUFBSTtBQUFBQTtBQUFBQTtBQUFBQSxjQUFXSixRQUFYOztBQUNBO0FBQUE7QUFBQUs7QUFBQUE7QUFBQUE7QUFBQUEsY0FBWUwsUUFBWjs7QUFDQTtBQUFBO0FBQUFNO0FBQUFBO0FBQUFBO0FBQUFBLGNBQWVOLFFBQWY7O0FBQ0E7QUFBQTtBQUFBTztBQUFBQTtBQUFBQTtBQUFBQSxjQUFhUCxRQUFiO0FBQ0Q7O0FBRU0sU0FBU1EsaUJBQVQsQ0FBMkJSLFFBQTNCLEVBQXFDUyxVQUFyQyxFQUFpREMsVUFBakQsRUFBNkQ7QUFDbEUsTUFBSVYsUUFBUSxDQUFDVyxPQUFULENBQWlCRixVQUFqQixDQUFKLEVBQWtDO0FBQ2hDVCxJQUFBQSxRQUFRLENBQUNZLEtBQVQsQ0FBZUgsVUFBZixJQUE2QlQsUUFBUSxDQUFDVyxPQUFULENBQWlCRixVQUFqQixDQUE3Qjs7QUFDQSxRQUFJLENBQUNDLFVBQUwsRUFBaUI7QUFDZixhQUFPVixRQUFRLENBQUNXLE9BQVQsQ0FBaUJGLFVBQWpCLENBQVA7QUFDRDtBQUNGO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVnaXN0ZXJCbG9ja0hlbHBlck1pc3NpbmcgZnJvbSAnLi9oZWxwZXJzL2Jsb2NrLWhlbHBlci1taXNzaW5nJztcbmltcG9ydCByZWdpc3RlckVhY2ggZnJvbSAnLi9oZWxwZXJzL2VhY2gnO1xuaW1wb3J0IHJlZ2lzdGVySGVscGVyTWlzc2luZyBmcm9tICcuL2hlbHBlcnMvaGVscGVyLW1pc3NpbmcnO1xuaW1wb3J0IHJlZ2lzdGVySWYgZnJvbSAnLi9oZWxwZXJzL2lmJztcbmltcG9ydCByZWdpc3RlckxvZyBmcm9tICcuL2hlbHBlcnMvbG9nJztcbmltcG9ydCByZWdpc3Rlckxvb2t1cCBmcm9tICcuL2hlbHBlcnMvbG9va3VwJztcbmltcG9ydCByZWdpc3RlcldpdGggZnJvbSAnLi9oZWxwZXJzL3dpdGgnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0SGVscGVycyhpbnN0YW5jZSkge1xuICByZWdpc3RlckJsb2NrSGVscGVyTWlzc2luZyhpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyRWFjaChpbnN0YW5jZSk7XG4gIHJlZ2lzdGVySGVscGVyTWlzc2luZyhpbnN0YW5jZSk7XG4gIHJlZ2lzdGVySWYoaW5zdGFuY2UpO1xuICByZWdpc3RlckxvZyhpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyTG9va3VwKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJXaXRoKGluc3RhbmNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdmVIZWxwZXJUb0hvb2tzKGluc3RhbmNlLCBoZWxwZXJOYW1lLCBrZWVwSGVscGVyKSB7XG4gIGlmIChpbnN0YW5jZS5oZWxwZXJzW2hlbHBlck5hbWVdKSB7XG4gICAgaW5zdGFuY2UuaG9va3NbaGVscGVyTmFtZV0gPSBpbnN0YW5jZS5oZWxwZXJzW2hlbHBlck5hbWVdO1xuICAgIGlmICgha2VlcEhlbHBlcikge1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmhlbHBlcnNbaGVscGVyTmFtZV07XG4gICAgfVxuICB9XG59XG4iXX0=
