define(function (require) {

  var assert = require("assert");
  var Scope  = require("../ast/scope");

  var defaultVisitor = {
    visitDecl : function () {},
    visitScope : function () {}
  };

  var traverse = function traverse(scope, visitor) {
    Object.keys(defaultVisitor).forEach(function (key) {
      if (!visitor[key]) visitor[key] = defaultVisitor[key];
    });

    traverseScope(scope, visitor);
  };

  var traverseScope = function traverseScope(scope, visitor) {
    visitor.visitScope(scope);

    Object.keys(scope.decls).forEach(function (name) {
      var decl = scope.decls[name];
      if (decl instanceof Scope) {
        traverseScope(decl, visitor);
      } else {
        assert.ok(decl instanceof Decl, "expected only declarations");
        visitor.visitDecl(decl);
      }
    });
  };

  return traverse;

});

