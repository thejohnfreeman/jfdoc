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
    q.ok(decls.Foo1.returns, "Foo1 exists");
    q.ok(decls.Foo2.returns, "Foo2 exists");
  });

  q.test("type", function () {
    var decls = help.parse("returns.js").globals.decls;

    q.expect(4);
    help.stringEqual(decls.Foo1.returns.type, "Boolean")
    help.stringEqual(decls.Foo2.returns.type, "")
  });

  q.test("description", function () {
    var decls = help.parse("returns.js").globals.decls;

    q.expect(4);
    help.stringEqual(decls.Foo1.returns.description, "True if the moon is full.")
    help.stringEqual(decls.Foo2.returns.description, "Nothing.")
  });

}());

