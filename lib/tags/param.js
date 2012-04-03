(function () {

  var Parser = jfdoc.Parser;

  /**
   * "@param" ["{" type "}"] name [description...]
   * "@param" name ["{" type "}"] [description...]
   * Only one type may be given, either before or after the identifier. The
   * second form is not backwards-compatible, but is preferred for polymorphic
   * parameters. The parameter can be marked as optional by wrapping the name
   * in square brackets.
   */
  var paramTag = function paramTag(parser, doclet, options) {
    var m = Parser.parseType(options);
    var type = m[0];
    var rest = m[1];

    m = rest.match(/^(?:\[(\w+)\]|(\w+))\s*([\s\S]*)$/);
    if (!m) {
      Parser.error(doclet, "no name given for @param");
      return;
    }
    var name = m[1] || m[2];
    rest = m[3];

    if (!type) {
      m = Parser.parseType(rest);
      type = m[0];
      rest = m[1];
    }

    var description = rest;

    doclet.addTag("param", {
      name : name,
      type : type,
      description : description
    });
  };

  jfdoc.tags["param"] = paramTag;

}());

