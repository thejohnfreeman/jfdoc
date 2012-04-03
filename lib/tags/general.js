(function () {

  var Parser = jfdoc.Parser;

  var nameTag = function nameTag(parser, doclet, options) {
    Parser.assert(!doclet.name.setName(options), doclet,
      "parameter for @name is not an identifier");
  };

  var memberOfTag = function memberOfTag(parser, doclet, options) {
    Parser.assert(!doclet.name.setQualifier(options), doclet,
      "parameter for @memberOf is not an identifier or member expression");
  };

  var globalTag = function globalTag(parser, doclet, options) {
    doclet.isGlobal = true;
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;
  jfdoc.tags["global"] = globalTag;

}());

