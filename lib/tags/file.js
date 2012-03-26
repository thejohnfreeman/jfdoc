(function () {

  /**
   * "@author" name...
   */
  var authorTag = function authorTag(actions, decl, options) {
    decl.setFileKind();
    decl.author = options.trim();
  };

  jfdoc.tags["author"] = authorTag;

}());

