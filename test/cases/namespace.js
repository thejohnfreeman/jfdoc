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
    var symbols = help.parse("namespace.js");

    q.expect(4);
    q.ok(symbols.globals.decls, "global decls");
    q.strictEqual(Object.keys(symbols.globals.decls).length, 2,
      "number of namespaces");
    q.ok(symbols.globals.decls.Foo1, "Foo1 exists");
    q.ok(symbols.globals.decls.Foo2, "Foo2 exists");
  });

  q.test("kind", function () {
    var symbols = help.parse("namespace.js");

    q.expect(2);
    q.strictEqual(symbols.globals.decls.Foo1.kind, "namespace", "matches");
    q.strictEqual(symbols.globals.decls.Foo2.kind, "namespace", "matches");
  });

  q.test("name", function () {
    var symbols = help.parse("namespace.js");

    q.expect(2);
    q.strictEqual(symbols.globals.decls.Foo1.baseName, "Foo1", "matches");
    q.strictEqual(symbols.globals.decls.Foo2.baseName, "Foo2", "matches");
  });

}());

