(function () {

  /**
   * "@author" name...
   */
  var authorTag = function authorTag(actions, doclet, options) {
    doclet.setFileKind();
    doclet.author = options.trim();
  };

  jfdoc.tags["author"] = authorTag;

}());

