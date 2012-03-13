(function () {

  var functionTag = function functionTag(parser, symbol, options) {
    if (options.trim().length > 0) {
      console.warn("no options are supported for the @function tag");
    }
    symbol.kind = "function";
  };

  jfdoc.tags["function"] = functionTag;

}());

