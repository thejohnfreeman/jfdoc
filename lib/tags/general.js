(function () {

  var nameTag = function nameTag(parser, decl, options) {
    var qualName = options.trim().split(".");
    parser.setQualName(decl, qualName);
  };

  var memberOfTag = function memberOfTag(actions, decl, options) {
    decl.scopeQuals = options.trim().split(".");
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;

}());

