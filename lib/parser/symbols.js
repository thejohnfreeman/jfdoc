(function () {

  var Parser = jfdoc.Parser;

  /* Create the proper Decl for the doclet and place it in the proper Scope. */
  Parser.prototype.addDoclet = function addDoclet(doclet) {
    switch (doclet.kind) {
      case "file":
        this.symbols.files[0].setDoclet(doclet);
        break;

      case "method":
      case "function":
      case "constructor":
      case "namespace":
        var decl
          = this.symbols.globals.enterScopeChain(doclet.getQualifiedName());
        decl.setDoclet(doclet);
        this.symbols.files[0].decls.push(decl);
        break;

      case "class":
        var decl
          = this.symbols.globals.enterScopeChain(doclet.getQualifiedName());
        decl.setClassDoclet(doclet);
        break;

      default:
        if (Object.keys(doclet.tags)) {
          console.error("dropping doclet with unknown kind");
        }
        /* Otherwise it was just a comment with two leading asterisks. */
    };
  };

}());

