(function () {

  var nameTag = function nameTag(parser, decl, options) {
    decl.setQualName(options.trim());
  };

  var memberOfTag = function memberOfTag(actions, decl, options) {
    decl.scopeQuals = options.trim().split(".");
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;

}());

