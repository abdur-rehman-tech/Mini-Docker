/*istanbul ignore next*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

/*istanbul ignore next*/
var _default = SafeString;

/*istanbul ignore next*/
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIl0sIm5hbWVzIjpbIlNhZmVTdHJpbmciLCJzdHJpbmciLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsInRvSFRNTCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBLFNBQVNBLFVBQVQsQ0FBb0JDLE1BQXBCLEVBQTRCO0FBQzFCLE9BQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNEOztBQUVERCxVQUFVLENBQUNFLFNBQVgsQ0FBcUJDLFFBQXJCLEdBQWdDSCxVQUFVLENBQUNFLFNBQVgsQ0FBcUJFLE1BQXJCLEdBQThCLFlBQVc7QUFDdkUsU0FBTyxLQUFLLEtBQUtILE1BQWpCO0FBQ0QsQ0FGRDs7O2VBSWVELFUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59XG5cblNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gU2FmZVN0cmluZy5wcm90b3R5cGUudG9IVE1MID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnJyArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2FmZVN0cmluZztcbiJdfQ==
