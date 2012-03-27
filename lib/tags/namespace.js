(function () {

  var namespaceTag = function namespaceTag(parser, doclet, options) {
    doclet.setNamespaceKind();

    options = options.trim();
    if (options.length > 0) {
      doclet.setLocalName(options);
    }
  };

  jfdoc.tags["namespace"] = namespaceTag;

}());

