(function () {

  /**
   * "@author" name...
   */
  var authorTag = function authorTag(actions, doclet, options) {
    doclet.setKind("File");
    doclet.author = options.trim();
  };

  jfdoc.tags["author"] = authorTag;

}());

