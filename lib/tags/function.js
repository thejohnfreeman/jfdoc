(function () {

  /**
   * "@function" name
   */
  var functionTag = function functionTag(parser, decl, options) {
    decl.setFunctionKind();

    options = options.trim();
    if (options.length > 0) {
      decl.setQualName(options);
    }
  };

  /**
   * "@returns" ["{" type "}"] [description...]
   */
  var returnsTag = function returnsTag(parser, decl, options) {
    decl.setFunctionKind();

    options = options.trim();
    var m = parser.parseType(options);
    var type = m[0];
    var description = m[1];

    decl.returns = {
      type : type,
      description : description
    };
  };

  jfdoc.tags["function"] = functionTag;
  jfdoc.tags["returns"] = returnsTag;

}());

