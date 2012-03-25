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
   * "@returns" name ["{" type "}"] [description...]
   */

  jfdoc.tags["function"] = functionTag;

}());

