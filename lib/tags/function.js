(function () {

  var jsparse = require("jsparse");

  var functionTag = function functionTag(parser, decl, options) {
    options = options.trim();
    if (options.length > 0) {
      parser.setQualName(decl, options.split("."));
    }
    decl.kind = "function";
    if (!decl.params) decl.params = [];
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

  /* "@param" ["{" type "}"] name [description]
   * "@param" name ["{" type "}"] [description]
   * Only one type may be given, either before or after the identifier. The
   * second form is not backwards-compatible, but is preferred for polymorphic
   * parameters.
   */
  var paramTag = function paramTag(parser, decl, options) {
    decl.kind = "function";
    if (!decl.params) decl.params = [];

    var m = parseType(options);
    var type = m[0];
    var rest = m[1];

    m = rest.match(/^(\w+) *([\s\S]*)$/);
    if (!m) {
      console.error("no name given for parameter");
      return;
    }
    var name = m[1];
    rest = m[2];

    if (!type) {
      m = parseType(rest);
      type = m[0];
      rest = m[1];
    }

    var description = rest;

    /* Extend the last parameter if it exists with the same name. */
    var param = decl.params.pop();
    if (!param || (param.name !== name)) {
      if (param) decl.params.push(param);
      param = {
        name : name,
        types : []
      };
    }

    decl.params.push(param);

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

  jfdoc.tags["function"] = functionTag;
  jfdoc.tags["param"] = paramTag;

}());

