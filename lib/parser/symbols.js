(function () {

  var Parser = jfdoc.Parser;

  /* Place a declaration into the table. */
  Parser.prototype.addDecl = function addDecl(decl) {
    switch (decl.kind) {
      case "file":
        this.symbols.files[0].doc = decl;
        break;

      case "function":
        /* The parameter list was built in reverse order. */
        decl.params.reverse();
        /* Fall-through intended. */
      case "namespace":
      case "class":
        var scope = this.symbols.globals;
        decl.scopeQuals.forEach(function (qual) {
          scope = this.enterScope(scope, qual);
        }, this);
        this.pushScope(scope, decl);

        this.symbols.files[0].decls.push(decl);
        break;

      default: console.error("unsupported kind: " + decl.kind);
    };
  };

  /* Retrieve the inner scope from inside the outer scope. */
  Parser.prototype.enterScope = function enterScope(outer, inner) {
    return outer.decls[inner];
  };

  Parser.prototype.pushScope = function pushScope(outer, decl) {
    outer.decls[decl.baseName] = decl;
  };

}());

