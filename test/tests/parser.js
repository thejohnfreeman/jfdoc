define(function (require) {

  var q = require("qunit");

  var SymbolTable = require("lib/ast/symtab");
  var Parser      = require("lib/parser/parser");

  q.module("parser");

  q.test("parses empty file", function () {
    q.expect(1);

    var symtab = new SymbolTable("window");
    var parser = new Parser(symtab);
    parser.parseFile("filename.js", /*source=*/"");

    q.ok(true, "made it through parsing with no exceptions");
  });

});

