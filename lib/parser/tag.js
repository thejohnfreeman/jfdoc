(function () {

  var assert = require("assert");
  var jsparse = require("jsparse");

  var Parser = jfdoc.Parser;

  Parser.prototype.parseTag = function parseTag(doclet, str) {
    var m = str.trim().match(/(\w+) *([\s\S]*)/);
    if (!m) {
      Parser.error(doclet, "could not parse tag name: " + str);
      return;
    }
    /* The tag is the first word. */
    var tag = m[1];
    /* Everything after the tag can only be comprehended by the tag parser. */
    var options = m[2].trim();
    /* Call the named tag parser if it exists. */
    if (jfdoc.tags.hasOwnProperty(tag)) {
      var tagp = jfdoc.tags[tag];
      tagp(this, doclet, options);
    } else {
      doclet.addTag(tag, { options : options });
      /* Make sure you remembered to register your tag parser. */
      Parser.warn(doclet, "default tag handler: @" + tag);
    }
  };

  Parser.setKindAndName = function setKindAndName(doclet, kind, name) {
    doclet.setKind(kind);
    /* Name is optional; do not diagnose if it is missing. */
    if (name) {
      /* Diagnose if it is malformed. */
      Parser.assert(!doclet.name.setName(name), doclet,
        "parameter for @" + kind + " is not an identifier");
    }
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
  Parser.parseType = function parseType(options) {
    var P = jsparse;
    options = options.trimLeft();
    var r = typep(P.ps(options));
    return (r
      ? [r.ast[1], r.remaining.trimLeft().substring(0)]
      : (["", options]));
  };

}());

