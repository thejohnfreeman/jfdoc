(function () {

  var nameTag = function nameTag(parser, doclet, options) {
    doclet.setName(options);
  };

  var memberOfTag = function memberOfTag(parser, doclet, options) {
    doclet.setQualifier(options);
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;

}());

