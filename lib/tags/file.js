(function () {

  var authorTag = function authorTag(actions, symbol, options) {
    symbol.kind = "file";
    symbol.author = options.trim();
  };

  jfdoc.tags["author"] = authorTag;

}());

