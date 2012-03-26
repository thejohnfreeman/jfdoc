(function () {

  /**
   * "@class" name
   */
  var classTag = function classTag(parser, decl, options) {
    decl.setClassKind();

    options = options.trim();
    if (options.length > 0) {
      decl.setQualName(options);
    }
  };

  jfdoc.tags["class"] = classTag;

}());

