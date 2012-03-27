(function () {

  /**
   * @class Foo1
   */

  /**
   * @class
   * @name Foo2
   */

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("class");

  q.test("placement", function () {
    var decls = help.parse("class.js").globals.decls;

    q.expect(5);
    q.strictEqual(Object.keys(decls).length, 2,
      "number of classes");
    q.ok(decls.Foo1, "Foo1 exists");
    q.ok(decls.Foo1 instanceof jfdoc.Scope, "Foo1 is a scope");
    q.ok(decls.Foo2, "Foo2 exists");
    q.ok(decls.Foo2 instanceof jfdoc.Scope, "Foo2 is a scope");
  });

  q.test("kind", function () {
    var decls = help.parse("class.js").globals.decls;

    q.expect(4);
    q.ok(decls.Foo1.classDoclet, "Foo1 has a class doclet");
    q.ok(decls.Foo1.classDoclet.kind instanceof jfdoc.ClassKind,
      "Foo1 class doclet has proper kind");
    q.ok(decls.Foo2.classDoclet, "Foo2 has a class doclet");
    q.ok(decls.Foo2.classDoclet.kind instanceof jfdoc.ClassKind,
      "Foo2 class doclet has proper kind");
  });

  q.test("name", function () {
    var decls = help.parse("class.js").globals.decls;

    q.expect(4);
    help.stringEqual(decls.Foo1.name, "Foo1");
    help.stringEqual(decls.Foo2.name, "Foo2");
  });

}());

