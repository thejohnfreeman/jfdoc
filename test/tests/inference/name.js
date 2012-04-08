define(function (require) {

  var q = require("qunit");

  var parse       = require("../common/parse");
  var stringEqual = require("../common/string-equal");

  q.module("infer name", {
    setup : function () {
      this.decls = parse("samples/infer-name.js").globalScope.decls;
    }
  });

  q.test("scope", function () {
    q.expect(2);
    q.ok(this.decls.Foo1, "Foo1 exists");
    q.ok(this.decls.Foo1.decls.Foo2, "Foo2 exists");
  });

  q.test("name", function () {
    q.expect(4);
    stringEqual(this.decls.Foo1.name, "Foo1");
    stringEqual(this.decls.Foo1.decls.Foo2.name, "Foo2");
  });

});

