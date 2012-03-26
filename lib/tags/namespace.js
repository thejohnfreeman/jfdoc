(function () {

  var namespaceTag = function namespaceTag(parser, decl, options) {
    decl.setNamespaceKind();

    options = options.trim();
    if (options.length > 0) {
      decl.setQualName(options);
    }
  };

  jfdoc.tags["namespace"] = namespaceTag;

}());

