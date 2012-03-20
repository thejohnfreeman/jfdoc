(function () {

  var namespaceTag = function namespaceTag(parser, symbol, options) {
    options = options.trim();
    if (options.length > 0) {
      parser.setQualName(symbol, options.split("."));
    }
    symbol.kind = "namespace";
  };

  jfdoc.tags["namespace"] = namespaceTag;

}());

