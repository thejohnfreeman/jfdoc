(function () {

  /**
   * "@author" name...
   */
  var authorTag = function authorTag(actions, decl, options) {
    decl.kind = "file";
    decl.author = options.trim();
  };

  jfdoc.tags["author"] = authorTag;

}());

