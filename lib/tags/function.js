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
  var returnsTag = function returnsTag(parser, decl, options) {
    decl.setFunctionKind();

    var m = options.match(/^(\w+)\s*(.*)$/m);
    if (!m) {
      console.error("no name given for @returns");
      return;
    }
    var name = m[1];
    var rest = m[2];

    m = parser.parseType(rest);
    var type = m[0];
    var description = m[1];

    decl.returns = {
      name : name,
      type : type,
      description : description
    };
  };

  jfdoc.tags["function"] = functionTag;
  jfdoc.tags["returns"] = returnsTag;

}());

