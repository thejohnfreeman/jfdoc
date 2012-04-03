(function () {

  var Parser = jfdoc.Parser;

  /**
   * "@function" name
   */
  var functionTag = function functionTag(parser, doclet, options) {
    Parser.setKindAndName(doclet, "function", options);
  };

  /**
   * "@returns" ["{" type "}"] [description...]
   */
  var returnsTag = function returnsTag(parser, doclet, options) {
    var m = Parser.parseType(options);
    var type = m[0];
    var description = m[1];

    doclet.addTag("returns", {
      type : type,
      description : description
    });
  };

  jfdoc.tags["function"] = functionTag;
  jfdoc.tags["returns"] = returnsTag;

}());

