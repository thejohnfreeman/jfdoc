define(function (require) {

  var assert = require("assert");

  var Scope = require("../ast/scope");

  var SymbolTable = function SymbolTable(globalScopeName) {
    this.files = [];

    /* The top-most scope lets name qualifiers start with the global scope
     * name. */
    var secretScope
      = new Scope("<secret>", null, "Should not be documented");

    assert.ok(globalScopeName, "expected name for global scope");
    this.globalScope
      = new Scope(globalScopeName, secretScope, "The global namespace.");
    secretScope.add(this.globalScope);
  };

  SymbolTable.prototype.toPrettyString = function toPrettyString() {
    return this.globalScope.toPrettyString(0);
  };

  return SymbolTable;

});

