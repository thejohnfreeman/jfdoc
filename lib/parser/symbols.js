(function () {

  var assert = require("assert");

  var Parser = jfdoc.Parser;

  /* Create the proper Decl for the doclet and place it in the proper Scope. */
  Parser.prototype.addDoclet = function addDoclet(doclet) {
    if (doclet.kind !== "unknown") {
      console.log("adding doclet for " +
        doclet.name.getQualifiedName() + " (" + doclet.kind + ")");
    }

    if (doclet.kind !== "file" && !doclet.name.getName()) {
      console.error("could not infer name for " + doclet.kind + " at " +
        doclet.getLoc() + "; please add a @name tag");
      return;
    }

    switch (doclet.kind) {
      case "file":
        this.symbols.files[0].setDoclet(doclet);
        break;

      case "method":
      case "function":
      case "constructor":
      case "namespace":
        var decl = this.symbols.globals.enterPath(doclet.name.getPath());
        decl.setDoclet(doclet);
        this.symbols.files[0].decls.push(decl);
        break;

      case "class":
        var decl = this.symbols.globals.enterPath(doclet.name.getPath());
        decl.setClassDoclet(doclet);
        /* In case the user documents the class but not the constructor. */
        decl.doclet.setKind("constructor");
        break;

      default:
        assert.strictEqual(doclet.kind, "unknown",
          "forgot case for " + doclet.kind);
        if (Object.keys(doclet.tags)) {
          console.error("dropping doclet with unknown kind");
        }
        /* Otherwise it was just a comment with two leading asterisks. */
    };
  };

}());

