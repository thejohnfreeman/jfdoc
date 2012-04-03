(function () {

  /** @constructor */
  Foo1 = function () {};

  /** @function */
  Foo1.prototype.foo2 = function () {};

  /** Explicit doclet. */
  Foo3 = function () {};

  /** Explicit doclet. */
  Foo3.prototype.foo4 = function () {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("infer-method", {
    setup : function () {
      this.decls = help.parse("inferMethod.js").globals.decls;
      this.foo2 = this.decls.Foo1.decls.prototype.decls.foo2;
      this.foo4 = this.decls.Foo3.decls.prototype.decls.foo4;
    }
  });

  q.test("kind", function () {
    q.expect(2);
    q.strictEqual(this.foo2.doclet.kind, "method",
      "inferred method kind for function on a prototype");
    q.strictEqual(this.foo4.doclet.kind, "method",
      "inferred method kind for inferred function on a prototype");
  });

}());

