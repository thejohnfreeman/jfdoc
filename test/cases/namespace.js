(function () {

  /**
   * @namespace Foo1
   */
  var Foo1 = {};

  /**
   * @namespace
   * @name Foo2
   */
  var Foo2 = {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("namespace");

  q.test("placement", function () {
    var decls = help.parse("namespace.js").globals.decls;

    q.expect(6);
    q.ok(decls, "global decls");
    q.strictEqual(Object.keys(decls).length, 2,
      "number of namespaces");
    q.ok(decls.Foo1, "Foo1 exists");
    q.ok(decls.Foo1 instanceof jfdoc.Scope, "Foo1 is a scope");
    q.ok(decls.Foo2, "Foo2 exists");
    q.ok(decls.Foo2 instanceof jfdoc.Scope, "Foo2 is a scope");
  });

  q.test("kind", function () {
    var decls = help.parse("namespace.js").globals.decls;

    q.expect(2);
    q.ok(decls.Foo1.doclet.kind instanceof jfdoc.NamespaceKind, "Foo1");
    q.ok(decls.Foo2.doclet.kind instanceof jfdoc.NamespaceKind, "Foo2");
  });

  q.test("name", function () {
    var decls = help.parse("namespace.js").globals.decls;

    q.expect(2);
    q.strictEqual(decls.Foo1.name, "Foo1", "Foo1");
    q.strictEqual(decls.Foo2.name, "Foo2", "Foo2");
  });

}());

