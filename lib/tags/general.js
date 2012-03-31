(function () {

  var nameTag = function nameTag(parser, doclet, options) {
    if (doclet.name.setName(options)) {
      console.error("parameter for @name tag is not an identifier");
    }
  };

  var memberOfTag = function memberOfTag(parser, doclet, options) {
    if (doclet.name.setQualifier(options)) {
      console.error("parameter for @memberOf tag is not a member expression");
    }
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;

}());

