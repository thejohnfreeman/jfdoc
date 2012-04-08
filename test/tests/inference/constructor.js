define(function (require) {

  var q = require("qunit");

  var markConstructors = require("lib/sema/constructor");

  var parse = require("../common/parse");

  q.module("infer constructor", {
    setup : function () {
      var symtab = parse("samples/infer-constructor.js");
      markConstructors(symtab);

      this.decls = symtab.globalScope.decls;
      this.Foo1 = this.decls.Foo1;
      this.foo2 = this.Foo1.decls.prototype.decls.foo2;
      this.Foo2 = this.decls.Foo2;
    }
  });

  q.test("kind", function () {
    q.expect(1);
    q.strictEqual(this.Foo1.doclet.kind, "constructor",
      "inferred constructor kind for decl with a prototype");
    //q.strictEqual(this.Foo2.doclet.kind, "constructor",
      //"inferred constructor kind for decl with a class doclet");
  });

});

