(function () {

  var nameTag = function nameTag(parser, symbol, options) {
    var qualName = options.trim().split(".");
    parser.setQualName(symbol, qualName);
  };

  var memberOfTag = function memberOfTag(actions, symbol, options) {
    symbol.scopeQuals = options.trim().split(".");
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;

}());

