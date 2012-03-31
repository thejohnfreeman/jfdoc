(function () {

  /* Classes get a separate description from their constructor, but they are
   * represented in the symbol table by the constructor, just like in
   * JavaScript. */

  /**
   * "@class" name
   */
  var classTag = function classTag(parser, doclet, options) {
    doclet.setKind("class");
    if (options) doclet.name.setName(options);
  };

  /**
   * "@constructor" name
   */
  var constructorTag = function constructorTag(parser, doclet, options) {
    doclet.setKind("constructor");
    if (options) doclet.name.setName(options);
  };

  /**
   * "@method" name
   */
  var methodTag = function methodTag(parser, doclet, options) {
    doclet.setKind("method");
    if (options) doclet.name.setName(options);
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

