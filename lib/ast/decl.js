define(function (require) {

  var assert = require("assert");

  /* Any value (object, function, or otherwise) that has a qualified name is a
   * Decl. */
  var Decl = function Decl(name, parent) {
    this.name   = name;      // String
    /* A single decl can belong to multiple scopes, but the parent will be the
     * developer's preferred path to this decl. Use it for qualifier
     * information only; never for lookup. */
    this.parent = parent;    // Scope
    /* A decl with a null doclet has unknown type - all we know is a name. */
    this.doclet = undefined; // Doclet
  };

  Decl.prototype.moveTo = function moveTo(there) {
    if (this.parent) delete this.parent.decls[this.name];
    this.parent = there;
    this.parent.add(this);
  };

  Decl.prototype.getName = function getName() {
    return this.name;
  };

  Decl.prototype.getQualifiers = function getQualifiers() {
    var quals = [];
    var outer = this.parent;
    while (outer) {
      quals.unshift(outer.name);
      outer = outer.parent;
    }
    return quals;
  };

  Decl.prototype.getPath = function getPath() {
    return this.getQualifiers().concat(this.name);
  };

  Decl.prototype.getQualifiedName = function getQualifiedName() {
    return this.getPath().join(".");
  };

  Decl.prototype.toString = Decl.prototype.getQualifiedName;

  Decl.prototype.toPrettyString = function toPrettyString(level) {
    var indent = Array(2 * level + 1).join(" ");
    return indent + this.doclet.kind + " " + this.name + "\n";
  };

  return Decl;

});

