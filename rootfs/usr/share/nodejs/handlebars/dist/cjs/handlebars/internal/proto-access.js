/*istanbul ignore next*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProtoAccessControl = createProtoAccessControl;
exports.resultIsAllowed = resultIsAllowed;
exports.resetLoggedProperties = resetLoggedProperties;

var
/*istanbul ignore next*/
_createNewLookupObject = require("./create-new-lookup-object");

var
/*istanbul ignore next*/
logger = _interopRequireWildcard(require("../logger"));

/*istanbul ignore next*/ function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var loggedProperties = Object.create(null);

function createProtoAccessControl(runtimeOptions) {
  var defaultMethodWhiteList = Object.create(null);
  defaultMethodWhiteList['constructor'] = false;
  defaultMethodWhiteList['__defineGetter__'] = false;
  defaultMethodWhiteList['__defineSetter__'] = false;
  defaultMethodWhiteList['__lookupGetter__'] = false;
  var defaultPropertyWhiteList = Object.create(null); // eslint-disable-next-line no-proto

  defaultPropertyWhiteList['__proto__'] = false;
  return {
    properties: {
      whitelist:
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _createNewLookupObject.
      /*istanbul ignore next*/
      createNewLookupObject)(defaultPropertyWhiteList, runtimeOptions.allowedProtoProperties),
      defaultValue: runtimeOptions.allowProtoPropertiesByDefault
    },
    methods: {
      whitelist:
      /*istanbul ignore next*/
      (0,
      /*istanbul ignore next*/
      _createNewLookupObject.
      /*istanbul ignore next*/
      createNewLookupObject)(defaultMethodWhiteList, runtimeOptions.allowedProtoMethods),
      defaultValue: runtimeOptions.allowProtoMethodsByDefault
    }
  };
}

function resultIsAllowed(result, protoAccessControl, propertyName) {
  if (typeof result === 'function') {
    return checkWhiteList(protoAccessControl.methods, propertyName);
  } else {
    return checkWhiteList(protoAccessControl.properties, propertyName);
  }
}

function checkWhiteList(protoAccessControlForType, propertyName) {
  if (protoAccessControlForType.whitelist[propertyName] !== undefined) {
    return protoAccessControlForType.whitelist[propertyName] === true;
  }

  if (protoAccessControlForType.defaultValue !== undefined) {
    return protoAccessControlForType.defaultValue;
  }

  logUnexpecedPropertyAccessOnce(propertyName);
  return false;
}

function logUnexpecedPropertyAccessOnce(propertyName) {
  if (loggedProperties[propertyName] !== true) {
    loggedProperties[propertyName] = true;
    logger.log('error',
    /*istanbul ignore next*/
    "Handlebars: Access has been denied to resolve the property \"".concat(propertyName, "\" because it is not an \"own property\" of its parent.\n") +
    /*istanbul ignore next*/
    "You can add a runtime option to disable the check or this warning:\n" +
    /*istanbul ignore next*/
    "See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details");
  }
}

function resetLoggedProperties() {
  Object.keys(loggedProperties).forEach(function (propertyName) {
    delete loggedProperties[propertyName];
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2ludGVybmFsL3Byb3RvLWFjY2Vzcy5qcyJdLCJuYW1lcyI6WyJsb2dnZWRQcm9wZXJ0aWVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiY3JlYXRlUHJvdG9BY2Nlc3NDb250cm9sIiwicnVudGltZU9wdGlvbnMiLCJkZWZhdWx0TWV0aG9kV2hpdGVMaXN0IiwiZGVmYXVsdFByb3BlcnR5V2hpdGVMaXN0IiwicHJvcGVydGllcyIsIndoaXRlbGlzdCIsImNyZWF0ZU5ld0xvb2t1cE9iamVjdCIsImFsbG93ZWRQcm90b1Byb3BlcnRpZXMiLCJkZWZhdWx0VmFsdWUiLCJhbGxvd1Byb3RvUHJvcGVydGllc0J5RGVmYXVsdCIsIm1ldGhvZHMiLCJhbGxvd2VkUHJvdG9NZXRob2RzIiwiYWxsb3dQcm90b01ldGhvZHNCeURlZmF1bHQiLCJyZXN1bHRJc0FsbG93ZWQiLCJyZXN1bHQiLCJwcm90b0FjY2Vzc0NvbnRyb2wiLCJwcm9wZXJ0eU5hbWUiLCJjaGVja1doaXRlTGlzdCIsInByb3RvQWNjZXNzQ29udHJvbEZvclR5cGUiLCJ1bmRlZmluZWQiLCJsb2dVbmV4cGVjZWRQcm9wZXJ0eUFjY2Vzc09uY2UiLCJsb2dnZXIiLCJsb2ciLCJyZXNldExvZ2dlZFByb3BlcnRpZXMiLCJrZXlzIiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsZ0JBQWdCLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsQ0FBekI7O0FBRU8sU0FBU0Msd0JBQVQsQ0FBa0NDLGNBQWxDLEVBQWtEO0FBQ3ZELE1BQUlDLHNCQUFzQixHQUFHSixNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLENBQTdCO0FBQ0FHLEVBQUFBLHNCQUFzQixDQUFDLGFBQUQsQ0FBdEIsR0FBd0MsS0FBeEM7QUFDQUEsRUFBQUEsc0JBQXNCLENBQUMsa0JBQUQsQ0FBdEIsR0FBNkMsS0FBN0M7QUFDQUEsRUFBQUEsc0JBQXNCLENBQUMsa0JBQUQsQ0FBdEIsR0FBNkMsS0FBN0M7QUFDQUEsRUFBQUEsc0JBQXNCLENBQUMsa0JBQUQsQ0FBdEIsR0FBNkMsS0FBN0M7QUFFQSxNQUFJQyx3QkFBd0IsR0FBR0wsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUEvQixDQVB1RCxDQVF2RDs7QUFDQUksRUFBQUEsd0JBQXdCLENBQUMsV0FBRCxDQUF4QixHQUF3QyxLQUF4QztBQUVBLFNBQU87QUFDTEMsSUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLE1BQUFBLFNBQVM7QUFBRTtBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLDZCQUNUSCx3QkFEUyxFQUVURixjQUFjLENBQUNNLHNCQUZOLENBREQ7QUFLVkMsTUFBQUEsWUFBWSxFQUFFUCxjQUFjLENBQUNRO0FBTG5CLEtBRFA7QUFRTEMsSUFBQUEsT0FBTyxFQUFFO0FBQ1BMLE1BQUFBLFNBQVM7QUFBRTtBQUFBO0FBQUFDO0FBQUFBO0FBQUFBO0FBQUFBLDZCQUNUSixzQkFEUyxFQUVURCxjQUFjLENBQUNVLG1CQUZOLENBREo7QUFLUEgsTUFBQUEsWUFBWSxFQUFFUCxjQUFjLENBQUNXO0FBTHRCO0FBUkosR0FBUDtBQWdCRDs7QUFFTSxTQUFTQyxlQUFULENBQXlCQyxNQUF6QixFQUFpQ0Msa0JBQWpDLEVBQXFEQyxZQUFyRCxFQUFtRTtBQUN4RSxNQUFJLE9BQU9GLE1BQVAsS0FBa0IsVUFBdEIsRUFBa0M7QUFDaEMsV0FBT0csY0FBYyxDQUFDRixrQkFBa0IsQ0FBQ0wsT0FBcEIsRUFBNkJNLFlBQTdCLENBQXJCO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBT0MsY0FBYyxDQUFDRixrQkFBa0IsQ0FBQ1gsVUFBcEIsRUFBZ0NZLFlBQWhDLENBQXJCO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTQyxjQUFULENBQXdCQyx5QkFBeEIsRUFBbURGLFlBQW5ELEVBQWlFO0FBQy9ELE1BQUlFLHlCQUF5QixDQUFDYixTQUExQixDQUFvQ1csWUFBcEMsTUFBc0RHLFNBQTFELEVBQXFFO0FBQ25FLFdBQU9ELHlCQUF5QixDQUFDYixTQUExQixDQUFvQ1csWUFBcEMsTUFBc0QsSUFBN0Q7QUFDRDs7QUFDRCxNQUFJRSx5QkFBeUIsQ0FBQ1YsWUFBMUIsS0FBMkNXLFNBQS9DLEVBQTBEO0FBQ3hELFdBQU9ELHlCQUF5QixDQUFDVixZQUFqQztBQUNEOztBQUNEWSxFQUFBQSw4QkFBOEIsQ0FBQ0osWUFBRCxDQUE5QjtBQUNBLFNBQU8sS0FBUDtBQUNEOztBQUVELFNBQVNJLDhCQUFULENBQXdDSixZQUF4QyxFQUFzRDtBQUNwRCxNQUFJbkIsZ0JBQWdCLENBQUNtQixZQUFELENBQWhCLEtBQW1DLElBQXZDLEVBQTZDO0FBQzNDbkIsSUFBQUEsZ0JBQWdCLENBQUNtQixZQUFELENBQWhCLEdBQWlDLElBQWpDO0FBQ0FLLElBQUFBLE1BQU0sQ0FBQ0MsR0FBUCxDQUNFLE9BREY7QUFFRTtBQUFBLDJFQUErRE4sWUFBL0Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxxSEFGRjtBQU1EO0FBQ0Y7O0FBRU0sU0FBU08scUJBQVQsR0FBaUM7QUFDdEN6QixFQUFBQSxNQUFNLENBQUMwQixJQUFQLENBQVkzQixnQkFBWixFQUE4QjRCLE9BQTlCLENBQXNDLFVBQUFULFlBQVksRUFBSTtBQUNwRCxXQUFPbkIsZ0JBQWdCLENBQUNtQixZQUFELENBQXZCO0FBQ0QsR0FGRDtBQUdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlTmV3TG9va3VwT2JqZWN0IH0gZnJvbSAnLi9jcmVhdGUtbmV3LWxvb2t1cC1vYmplY3QnO1xuaW1wb3J0ICogYXMgbG9nZ2VyIGZyb20gJy4uL2xvZ2dlcic7XG5cbmNvbnN0IGxvZ2dlZFByb3BlcnRpZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJvdG9BY2Nlc3NDb250cm9sKHJ1bnRpbWVPcHRpb25zKSB7XG4gIGxldCBkZWZhdWx0TWV0aG9kV2hpdGVMaXN0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZGVmYXVsdE1ldGhvZFdoaXRlTGlzdFsnY29uc3RydWN0b3InXSA9IGZhbHNlO1xuICBkZWZhdWx0TWV0aG9kV2hpdGVMaXN0WydfX2RlZmluZUdldHRlcl9fJ10gPSBmYWxzZTtcbiAgZGVmYXVsdE1ldGhvZFdoaXRlTGlzdFsnX19kZWZpbmVTZXR0ZXJfXyddID0gZmFsc2U7XG4gIGRlZmF1bHRNZXRob2RXaGl0ZUxpc3RbJ19fbG9va3VwR2V0dGVyX18nXSA9IGZhbHNlO1xuXG4gIGxldCBkZWZhdWx0UHJvcGVydHlXaGl0ZUxpc3QgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG9cbiAgZGVmYXVsdFByb3BlcnR5V2hpdGVMaXN0WydfX3Byb3RvX18nXSA9IGZhbHNlO1xuXG4gIHJldHVybiB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgd2hpdGVsaXN0OiBjcmVhdGVOZXdMb29rdXBPYmplY3QoXG4gICAgICAgIGRlZmF1bHRQcm9wZXJ0eVdoaXRlTGlzdCxcbiAgICAgICAgcnVudGltZU9wdGlvbnMuYWxsb3dlZFByb3RvUHJvcGVydGllc1xuICAgICAgKSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogcnVudGltZU9wdGlvbnMuYWxsb3dQcm90b1Byb3BlcnRpZXNCeURlZmF1bHRcbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgIHdoaXRlbGlzdDogY3JlYXRlTmV3TG9va3VwT2JqZWN0KFxuICAgICAgICBkZWZhdWx0TWV0aG9kV2hpdGVMaXN0LFxuICAgICAgICBydW50aW1lT3B0aW9ucy5hbGxvd2VkUHJvdG9NZXRob2RzXG4gICAgICApLFxuICAgICAgZGVmYXVsdFZhbHVlOiBydW50aW1lT3B0aW9ucy5hbGxvd1Byb3RvTWV0aG9kc0J5RGVmYXVsdFxuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc3VsdElzQWxsb3dlZChyZXN1bHQsIHByb3RvQWNjZXNzQ29udHJvbCwgcHJvcGVydHlOYW1lKSB7XG4gIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGNoZWNrV2hpdGVMaXN0KHByb3RvQWNjZXNzQ29udHJvbC5tZXRob2RzLCBwcm9wZXJ0eU5hbWUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjaGVja1doaXRlTGlzdChwcm90b0FjY2Vzc0NvbnRyb2wucHJvcGVydGllcywgcHJvcGVydHlOYW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1doaXRlTGlzdChwcm90b0FjY2Vzc0NvbnRyb2xGb3JUeXBlLCBwcm9wZXJ0eU5hbWUpIHtcbiAgaWYgKHByb3RvQWNjZXNzQ29udHJvbEZvclR5cGUud2hpdGVsaXN0W3Byb3BlcnR5TmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBwcm90b0FjY2Vzc0NvbnRyb2xGb3JUeXBlLndoaXRlbGlzdFtwcm9wZXJ0eU5hbWVdID09PSB0cnVlO1xuICB9XG4gIGlmIChwcm90b0FjY2Vzc0NvbnRyb2xGb3JUeXBlLmRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHByb3RvQWNjZXNzQ29udHJvbEZvclR5cGUuZGVmYXVsdFZhbHVlO1xuICB9XG4gIGxvZ1VuZXhwZWNlZFByb3BlcnR5QWNjZXNzT25jZShwcm9wZXJ0eU5hbWUpO1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGxvZ1VuZXhwZWNlZFByb3BlcnR5QWNjZXNzT25jZShwcm9wZXJ0eU5hbWUpIHtcbiAgaWYgKGxvZ2dlZFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSAhPT0gdHJ1ZSkge1xuICAgIGxvZ2dlZFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHRydWU7XG4gICAgbG9nZ2VyLmxvZyhcbiAgICAgICdlcnJvcicsXG4gICAgICBgSGFuZGxlYmFyczogQWNjZXNzIGhhcyBiZWVuIGRlbmllZCB0byByZXNvbHZlIHRoZSBwcm9wZXJ0eSBcIiR7cHJvcGVydHlOYW1lfVwiIGJlY2F1c2UgaXQgaXMgbm90IGFuIFwib3duIHByb3BlcnR5XCIgb2YgaXRzIHBhcmVudC5cXG5gICtcbiAgICAgICAgYFlvdSBjYW4gYWRkIGEgcnVudGltZSBvcHRpb24gdG8gZGlzYWJsZSB0aGUgY2hlY2sgb3IgdGhpcyB3YXJuaW5nOlxcbmAgK1xuICAgICAgICBgU2VlIGh0dHBzOi8vaGFuZGxlYmFyc2pzLmNvbS9hcGktcmVmZXJlbmNlL3J1bnRpbWUtb3B0aW9ucy5odG1sI29wdGlvbnMtdG8tY29udHJvbC1wcm90b3R5cGUtYWNjZXNzIGZvciBkZXRhaWxzYFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0TG9nZ2VkUHJvcGVydGllcygpIHtcbiAgT2JqZWN0LmtleXMobG9nZ2VkUHJvcGVydGllcykuZm9yRWFjaChwcm9wZXJ0eU5hbWUgPT4ge1xuICAgIGRlbGV0ZSBsb2dnZWRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gIH0pO1xufVxuIl19
