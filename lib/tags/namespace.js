(function () {

  var namespaceTag = function namespaceTag(parser, doclet, options) {
    jfdoc.tag.setKindAndName(doclet, "namespace", options);
  };

  jfdoc.tags["namespace"] = namespaceTag;

}());

