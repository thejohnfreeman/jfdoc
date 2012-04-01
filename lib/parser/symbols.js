(function () {

  var assert = require("assert");

  var Parser = jfdoc.Parser;

  /* Create the proper Decl for the doclet and place it in the proper Scope. */
  Parser.prototype.addDoclet = function addDoclet(doclet) {
    console.log("doclet for " + doclet.name.getQualifiedName() + " (" +
      doclet.kind + ")");

    if (doclet.kind === "unknown") {
      if (doclet.hasTags()) {
        console.error("dropping doclet with unknown kind");
      }
      /* Otherwise it was just a comment with two leading asterisks. */
    }

    if (doclet.kind === "file") {
      this.symbols.files[0].setDoclet(doclet);
      return;
    }

    if (!doclet.name.getName()) {
      console.error("could not infer name for " + doclet.kind + " at " +
        doclet.getLoc() + "; please add a @name tag");
      return;
    }

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
        console.error("forgot case for " + doclet.kind);
    }
  };

}());

