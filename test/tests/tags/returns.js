define(function (require) {

  var q = require("qunit");

  var parse     = require("../common/parse");
  var tagsEqual = require("../common/tags-equal");

  q.module("returns tag", {
    setup : function () {
      this.decls = parse("samples/tag-returns.js").globalScope.decls;
      this.Foo1 = this.decls.Foo1;
      this.Foo2 = this.decls.Foo2;
    }
  });

  q.test("tags", function () {
    q.expect(2);
    q.ok(this.Foo1.doclet.tags["returns"], "Foo1 has returns tag");
    q.ok(this.Foo2.doclet.tags["returns"], "Foo2 has returns tag");
  });

  q.test("type", function () {
    q.expect(4);
    tagsEqual(this.Foo1.doclet.tags["returns"], "type", ["Boolean"]);
    tagsEqual(this.Foo2.doclet.tags["returns"], "type", [""]);
  });

  q.test("description", function () {
    q.expect(4);
    tagsEqual(this.Foo1.doclet.tags["returns"], "description", [
      "True if the moon is full."]);
    tagsEqual(this.Foo2.doclet.tags["returns"], "description", [
      "Nothing."]);
  });

});

