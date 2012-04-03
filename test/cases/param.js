(function () {

  /**
   * @param zero Untyped parameter.
   * @param one General description.
   * @param one {Car} Typed parameter.
   * @param two {String -> Car}
   *   A function parameter. Multi-line description. Whitespace and
   *   punctuation in type.
   * @param two {Hash {String -> Car}}
   *   Nested, matching braces in type. Multi-type parameter.
   */
  Foo1 = function () {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("param", {
    setup : function () {
      this.params = help.parse("param.js").globals.decls.
        Foo1.doclet.tags["param"];
    }
  });

  q.test("tags", function () {
    q.expect(2);
    q.ok(Array.isArray(this.params), "parameters exist");
    q.strictEqual(this.params.length, 5, "number of parameters");
  });

  q.test("order", function () {
    q.expect(6);
    help.tagsEqual(this.params, "name",
      ["zero", "one", "one", "two", "two"]);
  });

  q.test("types", function () {
    q.expect(6);
    help.tagsEqual(this.params, "type",
      ["", "", "Car", "String -> Car", "Hash {String -> Car}"]);
  });

  q.test("description", function () {
    q.expect(6);
    help.tagsEqual(this.params, "description", [
      "Untyped parameter.",
      "General description.",
      "Typed parameter.",
      "A function parameter. Multi-line description. Whitespace and\n" +
        "   punctuation in type.",
      "Nested, matching braces in type. Multi-type parameter."]);
  });

}());

