(function () {

  var fileTag = function fileTag(symbol, options) {
    if (options.length > 0) {
      console.warn("no options are supported for the @file tag");
    }

    symbol.kind = "file";
  };

  var authorTag = function fileTag(symbol, options) {
    symbol.author = options.join(" ");
  };

  jsdoc.tags.file = fileTag;
  jsdoc.tags.author = authorTag;

}());

