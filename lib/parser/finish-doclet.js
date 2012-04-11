define(function (require) {

  var diag  = require("../diagnostic");
  var Scope = require("../ast/scope");

  /* Attach the doclet to the Decl it targets. Create the Decl under the
   * correct Scope if necessary.
   * @param doclet {Doclet}
   * @returns {Decl}
   *   The Decl targeted by the doclet, or null if one does not exist.
   */
  var finishDoclet = function finishDoclet(doclet) {
    if (doclet.kind === "file") {
      this.symtab.files[0].doclet = doclet;
      return;
    }

    /* Every other doclet manages some sort of declaration and thus needs a
     * name and kind. */
    var qname = doclet.name;

    if (!qname.getName()) {
      diag.error(doclet, "could not infer name for " + doclet.kind + "; " +
          "please add a @name tag");
      return;
    }

    if (doclet.kind === "unknown") {
      if (doclet.isExplicit) {
        diag.error(doclet, "cannot document " + qname +
          " with unknown kind; please add a kind-tag, e.g., @function");
      }
      return;
    }

    /* Let authors omit ".prototype" if they document methods or fields. */
    if (doclet.kind === "method" || doclet.kind === "field") {
      if (qname.qualifiers[qname.qualifiers.length - 1] !== "prototype") {
        qname.qualifiers.push("prototype");
      }
    }

    //diag.log(doclet, "doclet for " + doclet);

    var decl = null;

    switch (doclet.kind) {
      case "namespace":
      case "function":
      case "constructor":
        decl = new Scope(qname.getName());
        decl.doclet = doclet;
        break;

      case "class":
        decl = new Scope(qname.getName());
        decl.docClass = doclet;
        break;

      case "alias":
        /* Try to find the decl named. */
        var path = doclet.tags["alias"].getPath();
        /* Look up. */
        decl = this.chain.lookup(path.shift());
        if (!decl) break;
        /* Look down. */
        decl = decl.lookdown(path);
        break;

      default:
        diag.error(doclet, "unhandled kind '" + doclet.kind + "'");
    }

    if (decl) this.addDecl(qname, decl);
  };

  return finishDoclet;

});

