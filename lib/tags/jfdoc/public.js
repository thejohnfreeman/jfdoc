define(function (require) {

  /** "@public" */
  var publicTag = function publicTag(doclet, options) {
    doclet.setTag("public", true);
  };

  return publicTag;

});

