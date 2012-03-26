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

    q.expect(4);
    q.ok(decls, "global decls");
    q.strictEqual(Object.keys(decls).length, 2,
      "number of namespaces");
    q.ok(decls.Foo1, "Foo1 exists");
    q.ok(decls.Foo2, "Foo2 exists");
  });

  q.test("kind", function () {
    var decls = help.parse("namespace.js").globals.decls;

    q.expect(2);
    q.strictEqual(decls.Foo1.kind, "namespace", "matches");
    q.strictEqual(decls.Foo2.kind, "namespace", "matches");
  });

  q.test("name", function () {
    var decls = help.parse("namespace.js").globals.decls;

    q.expect(2);
    q.strictEqual(decls.Foo1.baseName, "Foo1", "matches");
    q.strictEqual(decls.Foo2.baseName, "Foo2", "matches");
  });

}());

