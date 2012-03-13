(function () {

  var fileTag = function fileTag(symbol, options) {
    if (options.trim().length > 0) {
      console.warn("no options are supported for the @file tag");
    }

    symbol.kind = "file";
  };

  var authorTag = function authorTag(symbol, options) {
    symbol.author = options.trim();
  };

  jfdoc.tags.file = fileTag;
  jfdoc.tags.author = authorTag;

}());

