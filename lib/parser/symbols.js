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
    var scope = outer.decls[inner];
    if (!scope) {
      scope = outer.decls[inner] = new jfdoc.Decl("");
      scope.setNamespaceKind();
    }
    return scope;
  };

  Parser.prototype.enterScopeChain = function enterScopeChain(outer, chain) {
    chain.forEach(function (inner) {
      outer = this.enterScope(outer, inner);
    }, this);
    return outer;
  };

  Parser.prototype.pushScope = function pushScope(outer, decl) {
    var scope = outer.decls[decl.baseName];
    if (scope) {
      if (scope.source) {
        console.warn("scope (" + scope.getQualName() +
          ") documented more than once; some information will be lost");
        console.warn("dropping documentation from " + scope.getLoc());
      }
      /* Copy information from dummy Decl to source Decl. Dummy Decls should
       * only be used as scopes, so nothing other than this should need
       * copying. */
      decl.decls.extend(scope.decls);
    }
    outer.decls[decl.baseName] = decl;
  };

}());

