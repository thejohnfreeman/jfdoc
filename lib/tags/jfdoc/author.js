define(function () {

  /** "@author" name...  */
  var authorTag = function authorTag(doclet, options) {
    doclet.kind = "file";
    doclet.addTag("author", { name : options });
  };

  return authorTag;

});

