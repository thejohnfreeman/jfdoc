(function () {

  /**
   * @namespace
   */
  Foo1 = {};

  /**
   * @namespace Foo2
   */
  NotFoo2 = {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("namespace", {
    setup : function () {
      this.decls = help.parse("namespace.js").globals.decls;
      this.Foo1 = this.decls.Foo1;
      this.Foo2 = this.decls.Foo2;
    }
  });

  q.test("scope", function () {
    q.expect(6);
    q.ok(this.decls, "global decls");
    q.strictEqual(Object.keys(this.decls).length, 2, "number of namespaces");
    q.ok(this.Foo1, "Foo1 exists");
    q.ok(this.Foo1 instanceof jfdoc.Scope, "Foo1 is a scope");
    q.ok(this.Foo2, "Foo2 exists");
    q.ok(this.Foo2 instanceof jfdoc.Scope, "Foo2 is a scope");
  });

  q.test("kind", function () {
    q.expect(2);
    q.strictEqual(this.Foo1.doclet.kind, "namespace",
      "Foo1 has namespace kind");
    q.strictEqual(this.Foo2.doclet.kind, "namespace",
      "Foo2 has namespace kind");
  });

  q.test("name", function () {
    q.expect(4);
    help.stringEqual(this.Foo1.name, "Foo1");
    help.stringEqual(this.Foo2.name, "Foo2");
  });

}());

