define(function (require) {

  var q = require("qunit");

  var parse = require("../common/parse");

  q.module("infer kind", {
    setup : function () {
      this.decls = parse("samples/infer-kind.js").globalScope.decls;
      this.Foo1 = this.decls.Foo1;
      this.Foo2 = this.decls.Foo1.decls.Foo2;
    }
  });

  q.test("kind", function () {
    q.expect(2);
    q.strictEqual(this.Foo1.doclet.kind, "namespace",
      "inferred namespace kind for object literal");
    q.strictEqual(this.Foo2.doclet.kind, "function",
      "inferred function kind for function on namespace");
  });

});

