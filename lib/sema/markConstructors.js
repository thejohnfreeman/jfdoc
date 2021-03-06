define(function (require) {

  var assert   = require("assert");
  var traverse = require("./traverse");

  var markConstructorVisitor = {
    visitScope : function (scope) {
      /** Any scope with a prototype must be a constructor. */
      if (scope.decls.hasOwnProperty("prototype") || scope.classDoclet) {
        scope.doclet.setKind("constructor");
      }
    }
  };

  var markConstructors = function markConstructors(symtab) {
    assert.ok(!symtab.globalScope.decls.prototype,
      "do not change the prototype of the global object");
    traverse(symtab.globalScope, markConstructorVisitor);
  };

  return markConstructors;

});

