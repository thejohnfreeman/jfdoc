define(function (require) {

  var kindTag = require("./kind");

  /* Classes get a separate description from their constructor, but they are
   * represented in the symbol table by the constructor, just like in
   * JavaScript. */

  /** "@class" name */
  return kindTag("class");

});

