(function () {

  /** Explicit doclet. */
  Foo1 = function () {};

  /** Explicit doclet. */
  Foo1.prototype.foo2 = function () {};

  /** @class Foo2 */
  /** Explicit doclet. */
  Foo2 = function () {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("infer-constructor", {
    setup : function () {
      this.decls = help.parse("inferConstructor.js").globals.decls;
      this.Foo1 = this.decls.Foo1;
      this.foo2 = this.Foo1.decls.prototype.decls.foo2;
      this.Foo2 = this.decls.Foo2;
    }
  });

  q.test("kind", function () {
    q.expect(2);
    q.strictEqual(this.Foo1.doclet.kind, "constructor",
      "inferred constructor kind for decl with a prototype");
    q.strictEqual(this.foo2.doclet.kind, "method",
      "inferred method kind for function on a prototype");
    //q.strictEqual(this.Foo2.doclet.kind, "constructor",
      //"inferred constructor kind for decl with a class doclet");
  });

}());

