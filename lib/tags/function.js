(function () {

  /**
   * "@function" name
   */
  var functionTag = function functionTag(parser, doclet, options) {
    doclet.setFunctionKind();

    options = options.trim();
    if (options.length > 0) {
      doclet.setLocalName(options);
    }
  };

  /**
   * "@returns" ["{" type "}"] [description...]
   */
  var returnsTag = function returnsTag(parser, doclet, options) {
    doclet.setFunctionKind();

    options = options.trim();
    var m = parser.parseType(options);
    var type = m[0];
    var description = m[1];

    doclet.returns = {
      type : type,
      description : description
    };
  };

  jfdoc.tags["function"] = functionTag;
  jfdoc.tags["returns"] = returnsTag;

}());

