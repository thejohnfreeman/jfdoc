define(function (require) {

  var q = require("qunit");

  var parse     = require("../common/parse");
  var tagsEqual = require("../common/tags-equal");

  q.module("param tag", {
    setup : function () {
      this.params = parse("samples/tag-param.js").globalScope.decls.
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
    tagsEqual(this.params, "name",
      ["zero", "one", "one", "two", "two"]);
  });

  q.test("types", function () {
    q.expect(6);
    tagsEqual(this.params, "type",
      ["", "", "Car", "String -> Car", "Hash {String -> Car}"]);
  });

  q.test("description", function () {
    q.expect(6);
    tagsEqual(this.params, "description", [
      "Untyped parameter.",
      "General description.",
      "Typed parameter.",
      "A function parameter. Multi-line description. Whitespace and\n" +
        "   punctuation in type.",
      "Nested, matching braces in type. Multi-type parameter."]);
  });

});

