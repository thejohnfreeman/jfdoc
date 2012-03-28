(function () {

  /**
   * "@author" name...
   */
  var authorTag = function authorTag(actions, doclet, options) {
    doclet.setKind("file");
    doclet.addTag("author").push({ name : options });
  };

  jfdoc.tags["author"] = authorTag;

}());

