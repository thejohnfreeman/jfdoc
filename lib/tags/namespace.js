(function () {

  var Parser = jfdoc.Parser;

  var namespaceTag = function namespaceTag(parser, doclet, options) {
    Parser.setKindAndName(doclet, "namespace", options);
  };

  jfdoc.tags["namespace"] = namespaceTag;

}());

