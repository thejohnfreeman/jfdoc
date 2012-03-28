(function () {

  /* Any value (object, function, or otherwise) that has a qualified name is a
   * Decl. */
  var Decl = function Decl(parent, name) {
    this.name = name;     // String
    /* A single decl can belong to multiple scopes, but this will be the
     * developer's preferred path to this decl. */
    this.parent = parent; // Scope
    /* A decl with a null doclet has unknown type - all we know is a name. */
    this.doclet = null;   // Doclet
  };

  Decl.prototype.getQualifiers = function getQualifiers() {
    var path = [];
    var outer = this.parent;
    while (outer) {
      path.unshift(outer.name);
      outer = outer.parent;
    }
    return path;
  };

  Decl.prototype.getQualifiedName = function getQualifiedName() {
    /* TODO: Cache the result? */
    var qualName = this.getQualifiers().join(".") + this.name;
    return qualName;
  };

  Decl.prototype.setDoclet = function setDoclet(doclet) {
    if (this.doclet) {
      console.warn("decl (" + this.getQualifiedName() +
        ") documented more than once; some information will be lost");
      console.warn("dropping documentation from " + this.doclet.getLoc());
    }
    this.doclet = doclet;
  };

  Decl.prototype.markdownify = function markdownify() {
    if (this.doclet) {
      this.doclet.markdownify();
    }
  };

  jfdoc.Decl = Decl;

}());

