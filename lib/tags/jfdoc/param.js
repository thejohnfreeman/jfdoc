define(function (require) {

  var diag      = require("../../diagnostic");
  var parseType = require("./type");

  /**
   * "@param" ["{" type "}"] name [description...]
   * "@param" name ["{" type "}"] [description...]
   * Only one type may be given, either before or after the identifier. The
   * second form is not backwards-compatible, but is preferred for polymorphic
   * parameters. The parameter can be marked as optional by wrapping the name
   * in square brackets.
   */
  var paramTag = function paramTag(doclet, options) {
    var match = parseType(options);
    var type = match[0];
    var rest = match[1];

    match = rest.match(/^(?:\[(\w+)\]|(\w+))\s*([\s\S]*)$/);
    if (diag.assert(match, doclet, "no name given for @param")) return;
    var name = match[1] || match[2];
    rest = match[3];

    if (!type) {
      match = parseType(rest);
      type = match[0];
      rest = match[1];
    }

    var description = rest;

    doclet.addTag("param", {
      name : name,
      type : type,
      description : description
    });
  };

  return paramTag;

});

