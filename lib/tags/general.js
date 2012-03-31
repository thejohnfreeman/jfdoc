(function () {

  var nameTag = function nameTag(parser, doclet, options) {
    doclet.name.setName(options);
  };

  var memberOfTag = function memberOfTag(parser, doclet, options) {
    doclet.name.setQualifier(options);
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;

}());

