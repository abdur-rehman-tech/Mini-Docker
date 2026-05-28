"use strict";

var _patchFs = _interopRequireDefault(require("../patchFs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

describe('patchFs', function () {
  it('should overwrite the .readFileSync method', function () {
    var vol = {
      readFileSync: function readFileSync() {
        return 'foo';
      }
    };
    var fs = {};
    (0, _patchFs["default"])(vol, fs);
    expect(_typeof(fs.readFileSync)).toBe('function');
    expect(fs.readFileSync()).toBe('foo');
  });
  it('should copy constants', function () {
    var vol = {
      F_OK: 123
    };
    var fs = {};
    (0, _patchFs["default"])(vol, fs);
    expect(fs.F_OK).toBe(vol.F_OK);
  });
  describe('unpatch()', function () {
    it('should return "unpatch" method', function () {
      var vol = {
        F_OK: 123
      };
      var fs = {};
      expect(_typeof((0, _patchFs["default"])(vol, fs))).toBe('function');
    });
    it('should restore the original fs', function () {
      var original = function original() {};

      var vol = {
        writeFileSync: function writeFileSync() {}
      };
      var fs = {
        writeFileSync: original
      };
      var unpatch = (0, _patchFs["default"])(vol, fs);
      expect(fs.writeFileSync).not.toBe(original);
      unpatch();
      expect(fs.writeFileSync).toBe(original);
    });
  });
});