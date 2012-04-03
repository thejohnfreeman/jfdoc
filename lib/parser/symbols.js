(function () {

  var assert = require("assert");

  var Parser = jfdoc.Parser;

  /* Create the proper Decl for the doclet and place it in the proper Scope. */
  Parser.prototype.addDoclet = function addDoclet(doclet) {
    if (doclet.kind === "unknown") {
      if (doclet.isExplicit) {
        Parser.error(doclet, "dropping doclet with unknown kind; " +
          "please add a kind-tag, e.g., @function");
      }
      return;
    }

    if (doclet.kind === "file") {
      this.symbols.files[0].setDoclet(doclet);
      return;
    }

    if (!doclet.name.getName()) {
      Parser.error(doclet, "could not infer name for " + doclet.kind + "; " +
          "please add a @name tag");
      return;
    }

    Parser.log(doclet, "doclet for " + doclet.kind + " " +
      doclet.name.getQualifiedName());

    var parent = this.symbols.globals.enterPath(doclet.name.getQualifiers());

    /* Let authors leave off ".prototype" if they document methods. */
    if (doclet.kind === "method") {
      if (parent.name !== "prototype") parent = parent.enter("prototype");
    }

    /* Recognize functions on prototypes as methods. */
    if (parent.name === "prototype") {
      if (doclet.kind === "function") doclet.setKind("method");
    }

    switch (doclet.kind) {
      case "method":
      case "function":
      case "constructor":
      case "namespace":
        var decl = parent.enter(doclet.name.getName());
        decl.setDoclet(doclet);
        this.symbols.files[0].decls.push(decl);
        break;

      case "class":
        var decl = parent.enter(doclet.name.getName());
        decl.setClassDoclet(doclet);
        /* In case the user documents the class but not the constructor. */
        decl.doclet.setKind("constructor");
        break;

      default:
        console.error("forgot case for " + doclet.kind + " doclet");
    }
  };

}());

