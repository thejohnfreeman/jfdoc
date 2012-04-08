define(function () {

  /** "@author" name...  */
  var authorTag = function authorTag(doclet, options) {
    doclet.setKind("file");
    doclet.addTag("author", { name : options });
  };

  return authorTag;

});

