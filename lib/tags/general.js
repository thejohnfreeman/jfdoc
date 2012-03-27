(function () {

  var nameTag = function nameTag(parser, doclet, options) {
    doclet.setLocalName(options.trim());
  };

  var memberOfTag = function memberOfTag(parser, doclet, options) {
    doclet.setScopeName(options.trim());
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;

}());

