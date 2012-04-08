define(function (require) {

  var assert = require("assert");

  var Scope = require("../ast/scope");
  var diag  = require("../diagnostic");

  /** Any scope with a prototype must be a constructor. */
  var maybeMarkConstructor = function maybeMarkConstructor(scope) {
    if (scope.decls.hasOwnProperty("prototype") || scope.classDoclet) {
      scope.doclet.kind = "constructor";
    }

    Object.keys(scope.decls).forEach(function (name) {
      if (name === "prototype") return;
      var decl = scope.decls[name];
      if (decl instanceof Scope) maybeMarkConstructor(decl);
    });
  };

  var markConstructors = function markConstructors(symtab) {
    assert.ok(!symtab.globalScope.decls.prototype,
      "do not change the prototype of the global object");
    maybeMarkConstructor(symtab.globalScope);
  };

  return markConstructors;

});

