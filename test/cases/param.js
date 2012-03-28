(function () {

  /**
   * @function Foo1
   * @param zero Untyped parameter.
   * @param one General description.
   * @param one {Car} Typed parameter.
   * @param two {String -> Car}
   *   A function parameter. Multi-line description. Whitespace and
   *   punctuation in type.
   * @param two {Hash {String -> Car}}
   *   Nested, matching braces in type. Multi-type parameter.
   */
  var Foo1 = function () {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("param");

  q.test("size", function () {
    var params = help.parse("param.js").globals.decls.
      Foo1.doclet.tags["param"];

    q.expect(2);
    q.ok(Array.isArray(params), "parameters exist");
    q.strictEqual(params.length, 5, "number of parameters");
  });

  q.test("order", function () {
    var params = help.parse("param.js").globals.decls.
      Foo1.doclet.tags["param"];

    q.expect(6);
    help.tagsEqual(params, "name",
      ["zero", "one", "one", "two", "two"]);
  });

  q.test("types", function () {
    var params = help.parse("param.js").globals.decls.
      Foo1.doclet.tags["param"];

    q.expect(6);
    help.tagsEqual(params, "type",
      ["", "", "Car", "String -> Car", "Hash {String -> Car}"]);
  });

  q.test("description", function () {
    var params = help.parse("param.js").globals.decls.
      Foo1.doclet.tags["param"];

    q.expect(6);
    help.tagsEqual(params, "description", [
      "Untyped parameter.",
      "General description.",
      "Typed parameter.",
      "A function parameter. Multi-line description. Whitespace and\n" +
        "   punctuation in type.",
      "Nested, matching braces in type. Multi-type parameter."]);
  });

}());

