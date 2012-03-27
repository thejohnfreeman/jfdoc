(function () {

  /**
   * "@class" name
   */
  var classTag = function classTag(parser, doclet, options) {
    doclet.setClassKind();

    options = options.trim();
    if (options.length > 0) {
      doclet.setLocalName(options);
    }
  };

  jfdoc.tags["class"] = classTag;

}());

