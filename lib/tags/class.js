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

  /**
   * "@method" name
   */
  var methodTag = function methodTag(parser, doclet, options) {
    doclet.setKind("Method");

    options = options.trim();
    if (options.length > 0) {
      doclet.setLocalName(options);
    }
  };

  /**
   * "@public"
   */
  var publicTag = function publicTag(parser, doclet, options) {
    doclet.access = "public";
  };

  /**
   * "@private"
   */
  var privateTag = function privateTag(parser, doclet, options) {
    doclet.access = "private";
  };

  jfdoc.tags["class"] = classTag;
  jfdoc.tags["constructor"] = constructorTag;
  jfdoc.tags["method"] = methodTag;
  jfdoc.tags["public"] = publicTag;
  jfdoc.tags["private"] = privateTag;

}());

