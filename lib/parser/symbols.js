(function () {

  var Parser = jfdoc.Parser;

  /* Create the proper Decl for the doclet and place it in the proper Scope. */
  Parser.prototype.addDoclet = function addDoclet(doclet) {
    switch (doclet.kind.name) {
      case "file":
        this.symbols.files[0].setDoclet(doclet);
        break;

      case "function":
      case "constructor":
        /* The parameter list was built in reverse order. */
        doclet.params.reverse();
        /* Fall-through intended. */
      case "namespace":
        var decl
          = enterScopeChain(this.symbols.globals, doclet.getQualName());
        decl.setDoclet(doclet);
        this.symbols.files[0].decls.push(decl);
        break;

      case "class":
        var decl
          = enterScopeChain(this.symbols.globals, doclet.getQualName());
        decl.setClassDoclet(doclet);
        break;

      default: console.error("unsupported doclet kind: " + doclet.kind.name);
    };
  };

  enterScopeChain = function enterScopeChain(outer, chain) {
    if (typeof chain === "string") chain = chain.split(".");
    chain.forEach(function (inner) {
      outer = outer.enterScope(inner);
    });
    return outer;
  };

}());

