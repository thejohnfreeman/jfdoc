define(function (require) {

  var diag  = require("../diagnostic");
  var Scope = require("../ast/scope");

  var buildDecl = function buildDecl(doclet) {
    if (!doclet.name.getName()) {
      diag.error(doclet, "could not infer name for " + doclet.kind + "; " +
          "please add a @name tag");
      return null;
    }

    diag.log(doclet, "doclet for " + doclet);

    /* TODO: We may want to create simple Decls for constants and fields. */
    var decl = new Scope(doclet.name.getName());

    if (doclet.kind === "class") {
      decl.mergeClassDoclet(doclet);
    } else {
      decl.mergeDoclet(doclet);
    }

    return decl;
  };

  /* Attach the doclet to the Decl it targets. Create the Decl under the
   * correct Scope if necessary.
   * @param doclet {Doclet}
   * @returns {Decl}
   *   The Decl targeted by the doclet, or null if one does not exist.
   */
  var finishDoclet = function finishDoclet(doclet) {
    if (doclet.kind === "unknown") {
      if (doclet.isExplicit) {
        diag.error(doclet, "cannot document " + doclet.name +
          " with unknown kind; please add a kind-tag, e.g., @function");
      }
      return;
    }

    if (doclet.kind === "file") {
      this.symtab.files[0].setDoclet(doclet);
      return;
    }

    /* Let authors omit ".prototype" if they document methods or fields. */
    if (doclet.kind === "method" || doclet.kind === "field") {
      var qname = doclet.name;
      if (qname.qualifiers[qname.qualifiers.length - 1] !== "prototype") {
        qname.qualifiers.push("prototype");
      }
    }

    var decl = buildDecl(doclet);
    if (decl) this.addDecl(doclet.name, decl);
  };

  return finishDoclet;

});

