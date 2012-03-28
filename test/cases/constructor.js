(function () {

  /**
   * @constructor Foo1
   */

  /**
   * @constructor
   * @name Foo2
   */

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("constructor");

  q.test("placement", function () {
    var decls = help.parse("constructor.js").globals.decls;

    q.expect(5);
    q.strictEqual(Object.keys(decls).length, 2,
      "number of constructors");
    q.ok(decls.Foo1, "Foo1 exists");
    q.ok(decls.Foo1 instanceof jfdoc.Scope, "Foo1 is a scope");
    q.ok(decls.Foo2, "Foo2 exists");
    q.ok(decls.Foo2 instanceof jfdoc.Scope, "Foo2 is a scope");
  });

  q.test("kind", function () {
    var decls = help.parse("constructor.js").globals.decls;

    q.expect(2);
    q.ok(decls.Foo1.doclet.kind === "constructor", "Foo1 is a constructor");
    q.ok(decls.Foo2.doclet.kind === "constructor", "Foo2 is a constructor");
  });

  q.test("name", function () {
    var decls = help.parse("constructor.js").globals.decls;

    q.expect(4);
    help.stringEqual(decls.Foo1.name, "Foo1");
    help.stringEqual(decls.Foo2.name, "Foo2");
  });

}());

