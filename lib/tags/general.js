(function () {

  var rePath = /^(?:(\w+)\.)*(\w+)$/;

  var nameTag = function nameTag(parsers, symbol, options) {
    options = options.trim();
    var m = options.match(rePath);
    if (!m) {
      console.error("cannot parse name for @name tag: " + options);
      return;
    }
    /* A path may be given, in which case we defer to @memberOf for all the
     * qualifiers. */
    if (m.length > 2) {
      /* TODO: Use actions instead of parsers so that options do not need to
       * be re-parsed. */
      parsers["memberOf"](parsers, symbol, m.slice(1,-1).join("."));
    }

    symbol.name = m[m.length - 1];
  };

  var memberOfTag = function memberOfTag(actions, symbol, options) {
    options = options.trim();
    var m = options.match(rePath);
    if (!m) {
      console.error("cannot parse path for @memberOf tag: " + options);
      return;
    }

    symbol.qualifiers = m.slice(1);
  };

  jfdoc.tags["name"] = nameTag;
  jfdoc.tags["memberOf"] = memberOfTag;

}());

