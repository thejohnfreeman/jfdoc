define(function (require) {

  var q = require("qunit");

  var Scope = require("lib/ast/scope");

  var parse       = require("../common/parse");
  var stringEqual = require("../common/string-equal");

  q.module("namespace tag", {
    setup : function () {
      this.decls = parse("samples/tag-namespace.js").globalScope.decls;
      this.Foo1 = this.decls.Foo1;
      this.Foo2 = this.decls.Foo2;
    }
  });

  q.test("scope", function () {
    q.expect(6);
    q.ok(this.decls, "global decls");
    q.strictEqual(Object.keys(this.decls).length, 2, "number of namespaces");
    q.ok(this.Foo1, "Foo1 exists");
    q.ok(this.Foo1 instanceof Scope, "Foo1 is a scope");
    q.ok(this.Foo2, "Foo2 exists");
    q.ok(this.Foo2 instanceof Scope, "Foo2 is a scope");
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
    stringEqual(this.Foo1.name, "Foo1");
    stringEqual(this.Foo2.name, "Foo2");
  });

});

