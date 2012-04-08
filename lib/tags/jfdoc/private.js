define(function (require) {

  /** "@private" */
  var privateTag = function privateTag(doclet, options) {
    doclet.setTag("private", true);
  };

  return privateTag;

});

