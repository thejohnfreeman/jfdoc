(function () {

  var nameTag = function nameTag(parser, symbol, options) {
    var path = options.trim().split(".");
    parser.setName(symbol, path);
  };

  var memberOfTag = function memberOfTag(actions, symbol, options) {
    symbol.qualifiers = options.trim().split(".");
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;

}());

