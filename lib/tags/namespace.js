(function () {

  var namespaceTag = function namespaceTag(parser, decl, options) {
    options = options.trim();
    if (options.length > 0) {
      parser.setQualName(decl, options.split("."));
    }
    decl.kind = "namespace";
  };

  jfdoc.tags["namespace"] = namespaceTag;

}());

