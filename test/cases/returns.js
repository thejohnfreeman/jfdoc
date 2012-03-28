(function () {

  /**
   * @function Foo1
   * @returns {Boolean} True if the moon is full.
   */
  var Foo1 = function () {};

  /**
   * @function Foo2
   * @returns Nothing.
   */
  var Foo2 = function () {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("returns");

  q.test("placement", function () {
    var decls = help.parse("returns.js").globals.decls;

    q.expect(2);
    q.ok(decls.Foo1.doclet.tags["returns"], "Foo1 has returns tag");
    q.ok(decls.Foo2.doclet.tags["returns"], "Foo2 has returns tag");
  });

  q.test("type", function () {
    var decls = help.parse("returns.js").globals.decls;

    q.expect(4);
    help.tagsEqual(decls.Foo1.doclet.tags["returns"], "type", ["Boolean"]);
    help.tagsEqual(decls.Foo2.doclet.tags["returns"], "type", [""]);
  });

  q.test("description", function () {
    var decls = help.parse("returns.js").globals.decls;

    q.expect(4);
    help.tagsEqual(decls.Foo1.doclet.tags["returns"], "description", [
      "True if the moon is full."]);
    help.tagsEqual(decls.Foo2.doclet.tags["returns"], "description", [
      "Nothing."]);
  });

}());

