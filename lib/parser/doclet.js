(function () {

  var assert = require("assert");

  var Parser = jfdoc.Parser;

  Parser.buildDecl = function buildDecl(doclet) {
    if (!doclet.name.getName()) {
      Parser.error(doclet, "could not infer name for " + doclet.kind + "; " +
          "please add a @name tag");
      return null;
    }

    Parser.log(doclet, "doclet for " + doclet);

    var decl = null;
    switch (doclet.kind) {
      case "method":
      case "function":
      case "constructor":
      case "namespace":
        decl = new jfdoc.Scope(doclet.name.getName());
        decl.setDoclet(doclet);
        break;

      case "class":
        decl = new jfdoc.Scope(doclet.name.getName());
        decl.setClassDoclet(doclet);
        break;

      case "constant":
        decl = new jfdoc.Decl(doclet.name.getName());
        decl.setDoclet(doclet);
        break;

      default:
        console.error("forgot case for " + doclet.kind + " doclet");
    }

    return decl;
  };

  Parser.prototype.addDecl = function addDecl(qname, decl) {
    this.symbols.files[0].decls.push(decl);

    var parent = null;
    if (qname.isGlobal()) {
      if (qname.isQualified()) {
        var path = qname.getQualifiers().slice();
        /* Look up in case qualifiers do not start at global scope. */
        var start = path.shift();
        parent = this.sit.scopes.lookup(start);
        /* If nothing found, treat first qualifier as global. */
        if (!parent) parent = this.symbols.globals.enter(start);
        parent = parent.enterPath(path);
      } else {
        parent = this.symbols.globals;
      }
    }

    /* Context-sensitive preprocessing. */
    if (parent) {
      var doclet = decl.doclet;

      /* Let authors leave off ".prototype" if they document methods. */
      if (doclet.kind === "method") {
        if (parent.name !== "prototype") parent = parent.enter("prototype");
      }

      /* Recognize functions on prototypes as methods. */
      if (parent.name === "prototype") {
        if (doclet.kind === "function") doclet.setKind("method");
      }
    }

    if (qname.isLocal()) {
      this.sit.remember(decl);
    } else if (qname.isNested()) {
      Parser.warn(decl.doclet, "cannot infer scope for " +
        decl.doclet.kind + " " + qname + "; please add a @memberOf tag");
    } else {
      Parser.assert(parent, decl.doclet,
        "expected to build scope for " + decl);
      decl.moveTo(parent);
    }
  };

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

    var decl = Parser.buildDecl(doclet);
    if (decl) this.addDecl(doclet.name, decl);
  };

}());

