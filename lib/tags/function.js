(function () {

  /**
   * "@function" name
   */
  var functionTag = function functionTag(parser, doclet, options) {
    jfdoc.tag.setKindAndName(doclet, "function", options);
  };

  /**
   * "@returns" ["{" type "}"] [description...]
   */
  var returnsTag = function returnsTag(parser, doclet, options) {
    var m = parser.parseType(options);
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

