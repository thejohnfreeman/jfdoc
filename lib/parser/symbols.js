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
        var scope
          = this.enterScopeChain(this.symbols.globals, decl.scopeQuals);
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

  Parser.prototype.enterScopeChain = function enterScopeChain(outer, chain) {
    chain.forEach(function (inner) {
      outer = this.enterScope(outer, inner);
    }, this);
    return outer;
  };

  Parser.prototype.pushScope = function pushScope(outer, decl) {
    outer.decls[decl.baseName] = decl;
  };

}());

