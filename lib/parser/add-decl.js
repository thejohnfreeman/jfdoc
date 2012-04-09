define(function (require) {

  var diag   = require("../diagnostic");
  var Doclet = require("../ast/doclet");
  var Scope  = require("../ast/scope");

  var addDecl = function addDecl(qname, decl) {
    var parent = null;
    /* Find the owning scope. */
    if (qname.isLocal()) {
      diag.assert(!qname.isQualified(), this,
        "expected unqualified name for local variable");
      parent = this.chain.top().scope;

    } else {
      diag.assert(qname.isGlobal(), this, "confused by name");

      if (qname.isQualified()) {
        var path = qname.getQualifiers().slice();
        /* Look up in case qualifiers do not start at global scope. */
        var start = path.shift();
        parent = this.chain.lookup(start);
        /* If nothing found, treat first qualifier as global. */
        if (!parent) parent = this.symtab.globalScope.enter(start);
        parent = parent.enterPath(path);

      } else {
        parent = this.symtab.globalScope;
      }
    }

    diag.assert(parent && (parent instanceof Scope), this,
      "expected to build scope for " + qname);
    /* If the decl exists because it was documented or inferred elsewhere,
     * just copy the information. Otherwise, add it. */
    var target = parent.lookdown([decl.name]);
    if (target) {
      target.doclet = Doclet.merge(target.doclet, decl.doclet);
      target.docClass = Doclet.merge(target.docClass, decl.docClass);
    } else {
      /* When importing or exporting a decl, we want to make it available in
       * the new scope. However, we want to change its qualifier only when
       * exporting. */
      parent.add(decl);
      if (qname.isGlobal()) {
        decl.parent = parent;
      }
    }
  };

  return addDecl;

});

