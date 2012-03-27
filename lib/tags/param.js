(function () {

  /**
   * "@param" ["{" type "}"] name [description...]
   * "@param" name ["{" type "}"] [description...]
   * Only one type may be given, either before or after the identifier. The
   * second form is not backwards-compatible, but is preferred for polymorphic
   * parameters. The parameter can be marked as optional by wrapping the name
   * in square brackets.
   */
  var paramTag = function paramTag(parser, doclet, options) {
    doclet.setKind("Function");

    var m = parser.parseType(options);
    var type = m[0];
    var rest = m[1];

    m = rest.match(/^(?:\[(\w+)\]|(\w+))\s*(.*)$/m);
    if (!m) {
      console.error("no name given for @param");
      return;
    }
    var name = m[1] || m[2];
    rest = m[3];

    if (!type) {
      m = parser.parseType(rest);
      type = m[0];
      rest = m[1];
    }

    var description = rest;

    /* Extend the last parameter if it exists with the same name. */
    /* The parameter list is built in reverse order and reversed when added to
     * the symbol table. */
    var param = doclet.params[0];
    if (!param || (param.name !== name)) {
      param = { name : name, types : [] };
      doclet.params.unshift(param);
    }

    /* If a type is present, then the description is for it. If not, then the
     * description is general. */
    if (type) {
      param.types.push({ type : type, description : description });
    } else {
      param.description = description;
    }
  };

  jfdoc.tags["param"] = paramTag;

}());

