define(function (require) {

  var fs      = require("fs");

  var SymbolTable = require("lib/ast/symtab");
  var Parser      = require("lib/parser/parser");

  var parse = function parse(filename) {
    var symtab = new SymbolTable("window");
    var parser = new Parser(symtab);
    var source = fs.readFileSync("test/" + filename, "utf8");
    parser.parseFile(filename, source);
    return symtab;
  };

  return parse;

});

