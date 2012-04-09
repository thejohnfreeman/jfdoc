define(function (require) {

  var assert = require("assert");
  var Scope  = require("../ast/scope");

  var SymbolTable = function SymbolTable(globalScopeName) {
    this.files = [];

    assert.ok(globalScopeName, "expected name for global scope");
    this.globalScope
      = new Scope(globalScopeName, null, "The global namespace.");
  };

  SymbolTable.prototype.toPrettyString = function toPrettyString() {
    return this.globalScope.toPrettyString(0);
  };

  return SymbolTable;

});

