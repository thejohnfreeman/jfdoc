(function () {

  var jsparse = require("jsparse");

  var functionTag = function functionTag(parser, symbol, options) {
    if (options.trim().length > 0) {
      console.warn("no options are supported for the @function tag");
    }
    symbol.kind = "function";
    if (!symbol.params) symbol.params = [];
  };

  var matchedp = function (begin, end) {
    /* AST: ["{", "...", "}"] */
    var P = jsparse;
    var outerp = function (state) { return outerp(state); };
    var innerp = P.choice(P.join_action(outerp, ""),
      P.negate(P.choice(begin, end)));
    outerp = P.sequence(begin, P.join_action(P.repeat0(innerp), ""), end);
    return outerp;
  };

  var typep = matchedp("{", "}");

  /* Returns [type (may be empty string), rest]. Rest will be left trimmed. */
  var parseType = function parseType(options) {
    var P = jsparse;
    options = options.trimLeft();
    var r = typep(P.ps(options));
    return (r
      ? [r.ast[1], r.remaining.trimLeft().substring(0)]
      : (["", options]));
  };

  var paramTag = function paramTag(parser, symbol, options) {
    symbol.kind = "function";

    var tr = parseType(options);
    var type = tr[0];
    var rest = tr[1];

    var m = rest.match(/^(\w+) *([\s\S]*)$/);
    if (!m) {
      console.error("no name given for parameter");
      return;
    }
    var baseName = m[1];
    var description = m[2];

    /* Start new parameter. */
    var param = {
      baseName : baseName,
      types : []
    };
    if (!symbol.params) symbol.params = [];
    symbol.params.push(param);

    /* If a type is present, then the description is for it. If not, then the
     * description is general. */
    if (type) {
      param.types.push({
        type : type,
        description : description
      });
    } else {
      param.description = description;
    }
  };

  var paramTypeTag = function paramTypeTag(parser, symbol, options) {
    symbol.kind = "function";

    var tr = parseType(options);
    var type = tr[0];
    var description = tr[1];

    if (!type) {
      console.error("@paramType missing type");
      return;
    }

    var param = symbol.params[symbol.params.length - 1];
    param.types.push({
      type : type,
      description : description
    });
  };

  jfdoc.tags["function"] = functionTag;
  jfdoc.tags["param"] = paramTag;
  jfdoc.tags["paramType"] = paramTypeTag;

}());

