"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeOptions;
var _helperValidatorOption = require("@babel/helper-validator-option");
const v = new _helperValidatorOption.OptionValidator("@babel/preset-typescript");
function normalizeOptions(options = {}) {
  let {
    allowNamespaces = true,
    jsxPragma,
    onlyRemoveTypeImports
  } = options;
  const TopLevelOptions = {
    allExtensions: "allExtensions",
    allowNamespaces: "allowNamespaces",
    disallowAmbiguousJSXLike: "disallowAmbiguousJSXLike",
    isTSX: "isTSX",
    jsxPragma: "jsxPragma",
    jsxPragmaFrag: "jsxPragmaFrag",
    onlyRemoveTypeImports: "onlyRemoveTypeImports",
    optimizeConstEnums: "optimizeConstEnums"
  };
  ;
  const jsxPragmaFrag = v.validateStringOption(TopLevelOptions.jsxPragmaFrag, options.jsxPragmaFrag, "React.Fragment");
  const allExtensions = v.validateBooleanOption(TopLevelOptions.allExtensions, options.allExtensions, false);
  const isTSX = v.validateBooleanOption(TopLevelOptions.isTSX, options.isTSX, false);
  if (isTSX) {
    v.invariant(allExtensions, "isTSX:true requires allExtensions:true");
  }
  const disallowAmbiguousJSXLike = v.validateBooleanOption(TopLevelOptions.disallowAmbiguousJSXLike, options.disallowAmbiguousJSXLike, false);
  if (disallowAmbiguousJSXLike) {
    v.invariant(allExtensions, "disallowAmbiguousJSXLike:true requires allExtensions:true");
  }
  const optimizeConstEnums = v.validateBooleanOption(TopLevelOptions.optimizeConstEnums, options.optimizeConstEnums, false);
  return {
    allExtensions,
    allowNamespaces,
    disallowAmbiguousJSXLike,
    isTSX,
    jsxPragma,
    jsxPragmaFrag,
    onlyRemoveTypeImports,
    optimizeConstEnums
  };
}

//# sourceMappingURL=normalize-options.js.map
