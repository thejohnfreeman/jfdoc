(function () {

  /* Classes get a separate description from their constructor, but they are
   * represented in the symbol table by the constructor, just like in
   * JavaScript. */

  /**
   * "@class" name
   */
  var classTag = function classTag(parser, doclet, options) {
    doclet.setKind("class");
    if (options) doclet.setName(options);
  };

  /**
   * "@constructor" name
   */
  var constructorTag = function constructorTag(parser, doclet, options) {
    doclet.setKind("constructor");
    if (options) doclet.setName(options);
  };

  /**
   * "@method" name
   */
  var methodTag = function methodTag(parser, doclet, options) {
    doclet.setKind("method");
    if (options) doclet.setName(options);
  };

  /**
   * "@public"
   */
  var publicTag = function publicTag(parser, doclet, options) {
    doclet.audience = "public";
  };

  /**
   * "@private"
   */
  var privateTag = function privateTag(parser, doclet, options) {
    doclet.audience = "private";
  };

  jfdoc.tags["class"] = classTag;
  jfdoc.tags["constructor"] = constructorTag;
  jfdoc.tags["method"] = methodTag;
  jfdoc.tags["public"] = publicTag;
  jfdoc.tags["private"] = privateTag;

}());

