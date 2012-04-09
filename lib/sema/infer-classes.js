define(function (require) {

  var assert   = require("assert");
  var traverse = require("./traverse");

  var inferClassVisitor = {
    visitScope : function (scope) {
      /** Any scope with a prototype must be a constructor. */
      if (scope.decls.hasOwnProperty("prototype") || scope.docClass) {
        scope.doclet.kind = "constructor";
      }
    }
  };

  var inferClasses = function inferClasses(symtab) {
    assert.ok(!symtab.globalScope.decls.prototype,
      "do not change the prototype of the global object");
    traverse(symtab.globalScope, inferClassVisitor);
  };

  return inferClasses;

});

