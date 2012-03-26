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

    q.expect(3);
    q.strictEqual(Object.keys(decls).length, 2,
      "number of functions");
    q.ok(decls.Foo1, "Foo1 exists");
    q.ok(decls.Foo2, "Foo2 exists");
  });

  q.test("kind", function () {
    var decls = help.parse("function.js").globals.decls;

    q.expect(2);
    q.strictEqual(decls.Foo1.kind, "function", "matches");
    q.strictEqual(decls.Foo2.kind, "function", "matches");
  });

  q.test("name", function () {
    var decls = help.parse("function.js").globals.decls;

    q.expect(4);
    help.stringEqual(decls.Foo1.baseName, "Foo1");
    help.stringEqual(decls.Foo2.baseName, "Foo2");
  });

}());

