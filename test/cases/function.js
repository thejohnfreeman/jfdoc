(function () {

  /**
   * @function Foo1
   */
  var Foo1 = function () {};

  /**
   * @function
   * @name Foo2
   */
  var Foo2 = function () {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("function");

  q.test("placement", function () {
    var decls = help.parse("function.js").globals.decls;

    q.expect(5);
    q.strictEqual(Object.keys(decls).length, 2,
      "number of functions");
    q.ok(decls.Foo1, "Foo1 exists");
    q.ok(decls.Foo1 instanceof jfdoc.Scope, "Foo1 is a scope");
    q.ok(decls.Foo2, "Foo2 exists");
    q.ok(decls.Foo2 instanceof jfdoc.Scope, "Foo2 is a scope");
  });

  q.test("kind", function () {
    var decls = help.parse("function.js").globals.decls;

    q.expect(2);
    q.ok(decls.Foo1.doclet.kind === "function", "Foo1 has function kind");
    q.ok(decls.Foo2.doclet.kind === "function", "Foo2 has function kind");
  });

  q.test("name", function () {
    var decls = help.parse("function.js").globals.decls;

    q.expect(4);
    help.stringEqual(decls.Foo1.name, "Foo1");
    help.stringEqual(decls.Foo2.name, "Foo2");
  });

}());

