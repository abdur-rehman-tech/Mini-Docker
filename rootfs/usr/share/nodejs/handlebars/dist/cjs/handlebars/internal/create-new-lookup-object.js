/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNewLookupObject = createNewLookupObject;

var
/*istanbul ignore next*/
_utils = require("../utils");

/**
 * Create a new object with "null"-prototype to avoid truthy results on prototype properties.
 * The resulting object can be used with "object[property]" to check if a property exists
 * @param {...object} sources a varargs parameter of source objects that will be merged
 * @returns {object}
 */
function createNewLookupObject() {
  /*istanbul ignore next*/
  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  return (
    /*istanbul ignore next*/

    /*istanbul ignore next*/
    _utils.
    /*istanbul ignore next*/
    extend.apply(
    /*istanbul ignore next*/
    void 0,
    /*istanbul ignore next*/
    [Object.create(null)].concat(sources))
  );
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2ludGVybmFsL2NyZWF0ZS1uZXctbG9va3VwLW9iamVjdC5qcyJdLCJuYW1lcyI6WyJjcmVhdGVOZXdMb29rdXBPYmplY3QiLCJzb3VyY2VzIiwiZXh0ZW5kIiwiT2JqZWN0IiwiY3JlYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTQSxxQkFBVCxHQUEyQztBQUFBO0FBQUEsb0NBQVRDLE9BQVM7QUFBVEEsSUFBQUEsT0FBUztBQUFBOztBQUNoRCxTQUFPO0FBQUE7O0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBT0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUFQLFNBQStCSCxPQUEvQjtBQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHRlbmQgfSBmcm9tICcuLi91dGlscyc7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IG9iamVjdCB3aXRoIFwibnVsbFwiLXByb3RvdHlwZSB0byBhdm9pZCB0cnV0aHkgcmVzdWx0cyBvbiBwcm90b3R5cGUgcHJvcGVydGllcy5cbiAqIFRoZSByZXN1bHRpbmcgb2JqZWN0IGNhbiBiZSB1c2VkIHdpdGggXCJvYmplY3RbcHJvcGVydHldXCIgdG8gY2hlY2sgaWYgYSBwcm9wZXJ0eSBleGlzdHNcbiAqIEBwYXJhbSB7Li4ub2JqZWN0fSBzb3VyY2VzIGEgdmFyYXJncyBwYXJhbWV0ZXIgb2Ygc291cmNlIG9iamVjdHMgdGhhdCB3aWxsIGJlIG1lcmdlZFxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5ld0xvb2t1cE9iamVjdCguLi5zb3VyY2VzKSB7XG4gIHJldHVybiBleHRlbmQoT2JqZWN0LmNyZWF0ZShudWxsKSwgLi4uc291cmNlcyk7XG59XG4iXX0=
