(function () {

  /** @namespace */
  Foo1 = {};

  /** @function */
  Foo1.Foo2 = function () {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("infer-name", {
    setup : function () {
      this.decls = help.parse("inferName.js").globals.decls;
    }
  });

  q.test("scope", function () {
    q.expect(2);
    q.ok(this.decls.Foo1, "Foo1 exists");
    q.ok(this.decls.Foo1.decls.Foo2, "Foo2 exists");
  });

  q.test("name", function () {
    q.expect(4);
    help.stringEqual(this.decls.Foo1.name, "Foo1");
    help.stringEqual(this.decls.Foo1.decls.Foo2.name, "Foo2");
  });

}());

