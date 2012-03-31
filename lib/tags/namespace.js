(function () {

  var namespaceTag = function namespaceTag(parser, doclet, options) {
    doclet.setKind("namespace");
    if (options) doclet.name.setName(options);
  };

  jfdoc.tags["namespace"] = namespaceTag;

}());

