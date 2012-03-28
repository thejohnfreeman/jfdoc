(function () {

  var namespaceTag = function namespaceTag(parser, doclet, options) {
    doclet.setKind("namespace");
    if (options) doclet.setName(options);
  };

  jfdoc.tags["namespace"] = namespaceTag;

}());

