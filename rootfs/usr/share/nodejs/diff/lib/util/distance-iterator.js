/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
/*istanbul ignore end*/
// Iterator that traverses in the range of [min, max], stepping
// by distance from a given start position. I.e. for [0, 4], with
// start of 2, this will iterate 2, 3, 1, 4, 0.
function
/*istanbul ignore start*/
_default
/*istanbul ignore end*/
(start, minLine, maxLine) {
  var wantForward = true,
    backwardExhausted = false,
    forwardExhausted = false,
    localOffset = 1;
  return function iterator() {
    if (wantForward && !forwardExhausted) {
      if (backwardExhausted) {
        localOffset++;
      } else {
        wantForward = false;
      }

      // Check if trying to fit beyond text length, and if not, check it fits
      // after offset location (or desired location on first iteration)
      if (start + localOffset <= maxLine) {
        return localOffset;
      }
      forwardExhausted = true;
    }
    if (!backwardExhausted) {
      if (!forwardExhausted) {
        wantForward = true;
      }

      // Check if trying to fit before text beginning, and if not, check it fits
      // before offset location
      if (minLine <= start - localOffset) {
        return -localOffset++;
      }
      backwardExhausted = true;
      return iterator();
    }

    // We tried to fit hunk before text beginning and beyond text length, then
    // hunk can't fit on the text. Return undefined
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzdGFydCIsIm1pbkxpbmUiLCJtYXhMaW5lIiwid2FudEZvcndhcmQiLCJiYWNrd2FyZEV4aGF1c3RlZCIsImZvcndhcmRFeGhhdXN0ZWQiLCJsb2NhbE9mZnNldCIsIml0ZXJhdG9yIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvZGlzdGFuY2UtaXRlcmF0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gSXRlcmF0b3IgdGhhdCB0cmF2ZXJzZXMgaW4gdGhlIHJhbmdlIG9mIFttaW4sIG1heF0sIHN0ZXBwaW5nXG4vLyBieSBkaXN0YW5jZSBmcm9tIGEgZ2l2ZW4gc3RhcnQgcG9zaXRpb24uIEkuZS4gZm9yIFswLCA0XSwgd2l0aFxuLy8gc3RhcnQgb2YgMiwgdGhpcyB3aWxsIGl0ZXJhdGUgMiwgMywgMSwgNCwgMC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0YXJ0LCBtaW5MaW5lLCBtYXhMaW5lKSB7XG4gIGxldCB3YW50Rm9yd2FyZCA9IHRydWUsXG4gICAgICBiYWNrd2FyZEV4aGF1c3RlZCA9IGZhbHNlLFxuICAgICAgZm9yd2FyZEV4aGF1c3RlZCA9IGZhbHNlLFxuICAgICAgbG9jYWxPZmZzZXQgPSAxO1xuXG4gIHJldHVybiBmdW5jdGlvbiBpdGVyYXRvcigpIHtcbiAgICBpZiAod2FudEZvcndhcmQgJiYgIWZvcndhcmRFeGhhdXN0ZWQpIHtcbiAgICAgIGlmIChiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgICBsb2NhbE9mZnNldCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2FudEZvcndhcmQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZXlvbmQgdGV4dCBsZW5ndGgsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgIC8vIGFmdGVyIG9mZnNldCBsb2NhdGlvbiAob3IgZGVzaXJlZCBsb2NhdGlvbiBvbiBmaXJzdCBpdGVyYXRpb24pXG4gICAgICBpZiAoc3RhcnQgKyBsb2NhbE9mZnNldCA8PSBtYXhMaW5lKSB7XG4gICAgICAgIHJldHVybiBsb2NhbE9mZnNldDtcbiAgICAgIH1cblxuICAgICAgZm9yd2FyZEV4aGF1c3RlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgaWYgKCFmb3J3YXJkRXhoYXVzdGVkKSB7XG4gICAgICAgIHdhbnRGb3J3YXJkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZWZvcmUgdGV4dCBiZWdpbm5pbmcsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgIC8vIGJlZm9yZSBvZmZzZXQgbG9jYXRpb25cbiAgICAgIGlmIChtaW5MaW5lIDw9IHN0YXJ0IC0gbG9jYWxPZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIC1sb2NhbE9mZnNldCsrO1xuICAgICAgfVxuXG4gICAgICBiYWNrd2FyZEV4aGF1c3RlZCA9IHRydWU7XG4gICAgICByZXR1cm4gaXRlcmF0b3IoKTtcbiAgICB9XG5cbiAgICAvLyBXZSB0cmllZCB0byBmaXQgaHVuayBiZWZvcmUgdGV4dCBiZWdpbm5pbmcgYW5kIGJleW9uZCB0ZXh0IGxlbmd0aCwgdGhlblxuICAgIC8vIGh1bmsgY2FuJ3QgZml0IG9uIHRoZSB0ZXh0LiBSZXR1cm4gdW5kZWZpbmVkXG4gIH07XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ2U7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFTQSxLQUFLLEVBQUVDLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0VBQy9DLElBQUlDLFdBQVcsR0FBRyxJQUFJO0lBQ2xCQyxpQkFBaUIsR0FBRyxLQUFLO0lBQ3pCQyxnQkFBZ0IsR0FBRyxLQUFLO0lBQ3hCQyxXQUFXLEdBQUcsQ0FBQztFQUVuQixPQUFPLFNBQVNDLFFBQVEsR0FBRztJQUN6QixJQUFJSixXQUFXLElBQUksQ0FBQ0UsZ0JBQWdCLEVBQUU7TUFDcEMsSUFBSUQsaUJBQWlCLEVBQUU7UUFDckJFLFdBQVcsRUFBRTtNQUNmLENBQUMsTUFBTTtRQUNMSCxXQUFXLEdBQUcsS0FBSztNQUNyQjs7TUFFQTtNQUNBO01BQ0EsSUFBSUgsS0FBSyxHQUFHTSxXQUFXLElBQUlKLE9BQU8sRUFBRTtRQUNsQyxPQUFPSSxXQUFXO01BQ3BCO01BRUFELGdCQUFnQixHQUFHLElBQUk7SUFDekI7SUFFQSxJQUFJLENBQUNELGlCQUFpQixFQUFFO01BQ3RCLElBQUksQ0FBQ0MsZ0JBQWdCLEVBQUU7UUFDckJGLFdBQVcsR0FBRyxJQUFJO01BQ3BCOztNQUVBO01BQ0E7TUFDQSxJQUFJRixPQUFPLElBQUlELEtBQUssR0FBR00sV0FBVyxFQUFFO1FBQ2xDLE9BQU8sQ0FBQ0EsV0FBVyxFQUFFO01BQ3ZCO01BRUFGLGlCQUFpQixHQUFHLElBQUk7TUFDeEIsT0FBT0csUUFBUSxFQUFFO0lBQ25COztJQUVBO0lBQ0E7RUFDRixDQUFDO0FBQ0gifQ==