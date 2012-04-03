(function () {

  /**
   * @returns {Boolean} True if the moon is full.
   */
  Foo1 = function () {};

  /**
   * @returns Nothing.
   */
  Foo2 = function () {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("returns", {
    setup : function () {
      this.decls = help.parse("returns.js").globals.decls;
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
    help.tagsEqual(this.Foo1.doclet.tags["returns"], "type", ["Boolean"]);
    help.tagsEqual(this.Foo2.doclet.tags["returns"], "type", [""]);
  });

  q.test("description", function () {
    q.expect(4);
    help.tagsEqual(this.Foo1.doclet.tags["returns"], "description", [
      "True if the moon is full."]);
    help.tagsEqual(this.Foo2.doclet.tags["returns"], "description", [
      "Nothing."]);
  });

}());

