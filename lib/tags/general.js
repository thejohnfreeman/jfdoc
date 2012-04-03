(function () {

  var Parser = jfdoc.Parser;

  var nameTag = function nameTag(parser, doclet, options) {
    if (doclet.name.setName(options)) {
      Parser.error(doclet, "parameter for @name tag is not an identifier");
    }
  };

  var memberOfTag = function memberOfTag(parser, doclet, options) {
    if (doclet.name.setQualifier(options)) {
      Parser.error(doclet, "parameter for @memberOf tag is not " +
        "an identifier or member expression");
    }
  };

  var globalTag = function globalTag(parser, doclet, options) {
    doclet.isGlobal = true;
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;
  jfdoc.tags["global"] = globalTag;

}());

