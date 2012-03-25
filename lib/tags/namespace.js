(function () {

  var namespaceTag = function namespaceTag(parser, decl, options) {
    options = options.trim();
    if (options.length > 0) {
      decl.setQualName(options);
    }
    decl.kind = "namespace";
  };

  jfdoc.tags["namespace"] = namespaceTag;

}());

