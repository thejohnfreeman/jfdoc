(function () {

  /* Classes get a separate description from their constructor, but they are
   * represented in the symbol table by the constructor, just like in
   * JavaScript. */

  /**
   * "@class" name
   */
  var classTag = function classTag(parser, doclet, options) {
    doclet.setKind("Class");

    options = options.trim();
    if (options.length > 0) {
      doclet.setLocalName(options);
    }
  };

  /**
   * "@constructor" name
   */
  var constructorTag = function constructorTag(parser, doclet, options) {
    doclet.setKind("Constructor");

    options = options.trim();
    if (options.length > 0) {
      doclet.setLocalName(options);
    }
  };

  jfdoc.tags["class"] = classTag;
  jfdoc.tags["constructor"] = constructorTag;

}());

