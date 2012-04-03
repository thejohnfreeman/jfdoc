(function () {

  var assert = require("assert");

  var Parser = jfdoc.Parser;

  /* Attach the doclet to the Decl it targets. Create the Decl under the
   * correct Scope if necessary.
   * @param it {ScopedIterator}
   * @param doclet {Doclet}
   * @returns {Decl}
   *   The Decl targeted by the doclet, or null if one does not exist.
   */
  Parser.prototype.finishDoclet = function finishDoclet(doclet) {
    if (doclet.kind === "unknown") {
      if (doclet.isExplicit) {
        Parser.error(doclet, "dropping doclet with unknown kind; " +
          "please add a kind-tag, e.g., @function");
      }
      return null;
    }

    if (doclet.kind === "file") {
      this.symbols.files[0].setDoclet(doclet);
      return null;
    }

    if (!doclet.name.getName()) {
      Parser.error(doclet, "could not infer name for " + doclet.kind + "; " +
          "please add a @name tag");
      return null;
    }

    Parser.log(doclet, "doclet for " + doclet.kind + " " +
      doclet.name.getQualifiedName());

    var parent = null;
    if (doclet.isGlobal) {
      parent = this.symbols.globals.enterPath(doclet.name.getQualifiers())
    } else if (doclet.name.isQualified()) {
      var path = doclet.name.getQualifiers().slice();
      parent = this.sit.scopes.lookup(path.shift());
      if (parent) parent = parent.enterPath(path);
    }

    /* Context-sensitive preprocessing. */
    if (parent) {
      /* Let authors leave off ".prototype" if they document methods. */
      if (doclet.kind === "method") {
        if (parent.name !== "prototype") parent = parent.enter("prototype");
      }

      /* Recognize functions on prototypes as methods. */
      if (parent.name === "prototype") {
        if (doclet.kind === "function") doclet.setKind("method");
      }
    }

    var decl = null;
    switch (doclet.kind) {
      case "method":
      case "function":
      case "constructor":
      case "namespace":
        decl = new jfdoc.Scope(doclet.name.getName());
        decl.setDoclet(doclet);
        this.symbols.files[0].decls.push(decl);
        break;

      case "class":
        decl = new jfdoc.Scope(doclet.name.getName());
        decl.setClassDoclet(doclet);
        break;

      default:
        console.error("forgot case for " + doclet.kind + " doclet");
    }

    /* Either we know where it belongs, or it is a local variable declaration.
     * */
    if (parent) {
      decl.moveTo(parent);
    } else {
      if (doclet.name.isQualified()) {
        Parser.warn(doclet, "expected to find the scope for " +
          doclet.name.getQualifiedName() + "; did you remember to document " +
          doclet.name.getQualifiers()[0] + "?");
      } else {
        this.sit.remember(decl);
      }
    }

    return decl;
  };

}());

