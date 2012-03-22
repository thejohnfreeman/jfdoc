(function () {

  /**
   * @function Foo1
   * @param zero Untyped parameter.
   * @param one General description.
   * @param one {Car} Typed parameter.
   * @param two {String -> Car}
   *   A function parameter. Multi-line description. Whitespace and punctuation
   *   in type.
   * @param two {Hash {String -> Car}}
   *   Nested, matching braces in type. Multi-type parameter.
   */
  var Foo1 = function () {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("param");

  q.test("placement", function () {
    var symbols = help.parse("function.js");
    var Foo1 = symbols.globals.decls.Foo1;

    q.expect(2);
    q.ok(Array.isArray(Foo1.params), "parameters exist");
    q.strictEqual(Foo1.params.length, 3, "number of parameters");
  });

  q.test("order", function () {
    var symbols = help.parse("function.js");
    var Foo1 = symbols.globals.decls.Foo1;

    q.expect(3);
    q.strictEqual(Foo1.params[0].name, "one",
      "parameters in declaration order");
    q.strictEqual(Foo1.params[1].name, "two",
      "parameters in declaration order");
    q.strictEqual(Foo1.params[2].name, "three",
      "parameters in declaration order");
  });

  q.test("types", function () {
    var symbols = help.parse("function.js");
    var Foo1 = symbols.globals.decls.Foo1;

    q.expect(7);
    q.strictEqual(Foo1.params[0].types.length, 0,
      "number of parameter types");

    q.ok(Array.isArray(Foo1.params[1].types), "parameter types exist");
    q.strictEqual(Foo1.params[1].types.length, 1,
      "number of parameter types");
    q.strictEqual(Foo1.params[1].types[0].type, "Car", "matches");

    q.strictEqual(Foo1.params[2].types.length, 2,
      "number of parameter types");
    q.strictEqual(Foo1.params[2].types[0].type, "String -> Car", "matches");
    q.strictEqual(Foo1.params[2].types[1].type, "Hash {String -> Car}",
      "matches");
  });

  q.test("description", function () {
    var symbols = help.parse("function.js");
    var Foo1 = symbols.globals.decls.Foo1;

    q.expect(4);
    q.strictEqual(Foo1.params[0].description, "Untyped parameter", "matches");

    q.strictEqual(Foo1.params[1].description, "General description",
      "matches");
    q.strictEqual(Foo1.params[1].types[0].description, "Typed parameter.",
      "matches");

    q.strictEqual(Foo1.params[2].description, undefined, "matches");
  });

}());

