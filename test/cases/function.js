(function () {

  /**
   * @function Foo1
   */
  var Foo1 = function () {};

  /**
   * @function
   * @name Foo2
   */
  var Foo2 = function () {};

}());

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("function");

  q.test("function", function () {
    var symbols = help.parse("function.js");

    q.expect(3);
    q.strictEqual(Object.keys(symbols.globals.decls).length, 2,
      "number of functions");
    q.ok(symbols.globals.decls.Foo1, "Foo1 exists");
    q.ok(symbols.globals.decls.Foo2, "Foo2 exists");
  });

  q.test("function", function () {
    var symbols = help.parse("function.js");

    q.expect(2);
    q.strictEqual(symbols.globals.decls.Foo1.kind, "function", "matches");
    q.strictEqual(symbols.globals.decls.Foo2.kind, "function", "matches");
  });

  q.test("function", function () {
    var symbols = help.parse("function.js");

    q.expect(2);
    q.strictEqual(symbols.globals.decls.Foo1.baseName, "Foo1", "matches");
    q.strictEqual(symbols.globals.decls.Foo2.baseName, "Foo2", "matches");
  });

}());

