(function () {

  /* Classes get a separate description from their constructor, but they are
   * represented in the symbol table by the constructor, just like in
   * JavaScript. */

  var tags = jfdoc.tags

  /**
   * "@class" name
   */
  var classTag = function classTag(parser, doclet, options) {
    jfdoc.tag.setKindAndName(doclet, "class", options);
  };

  /**
   * "@constructor" name
   */
  var constructorTag = function constructorTag(parser, doclet, options) {
    jfdoc.tag.setKindAndName(doclet, "constructor", options);
  };

  /**
   * "@method" name
   */
  var methodTag = function methodTag(parser, doclet, options) {
    jfdoc.tag.setKindAndName(doclet, "method", options);
  };

  /**
   * "@public"
   */
  var publicTag = function publicTag(parser, doclet, options) {
    doclet.setTag("public", true);
  };

  /**
   * "@private"
   */
  var privateTag = function privateTag(parser, doclet, options) {
    doclet.setTag("private", true);
  };

  jfdoc.tags["class"] = classTag;
  jfdoc.tags["constructor"] = constructorTag;
  jfdoc.tags["method"] = methodTag;
  jfdoc.tags["public"] = publicTag;
  jfdoc.tags["private"] = privateTag;

}());

