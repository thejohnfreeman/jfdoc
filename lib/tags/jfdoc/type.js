define(function (require) {

  var jsparse = require("jsparse");

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

  return parseType;

});

