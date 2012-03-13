(function () {

  var namespaceTag = function namespaceTag(actions, symbol, options) {
    if (options.trim().length > 0) {
      console.warn("no options are supported for the @namespace tag");
    }

    symbol.kind = "namespace";
  };

  jfdoc.tags["namespace"] = namespaceTag;

}());

