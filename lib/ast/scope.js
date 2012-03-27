(function () {

  /**
   * Any decl that can have properties and a prototype, i.e., any object or
   * function, can serve as a scope for other decls.
   */
  var Scope = function Scope(parent, name) {
    jfdoc.Decl.call(this, parent, name); // base constructor
    this.decls = {};       // String -> Decl
  };

  Scope.prototype = new jfdoc.Decl();

  /**
   * Retrieve the inner scope from inside the outer scope, and create it if it
   * does not exist.
   */
  Scope.prototype.enterScope = function enterScope(inner) {
    var scope = this.decls[inner];
    if (!scope) {
      /* Why create a Scope instead of a Decl? Undeclared scopes may be documented
       * later. We cannot easily change a Decl into a Scope, and if this function is
       * being called, then we know the inner name refers to a scope. */
      scope = this.decls[inner] = new jfdoc.Scope(this, inner);
    }
    return scope;
  };

  Scope.prototype.markdownify = function markdownify() {
    jfdoc.Decl.prototype.markdownify.call(this);
    Object.keys(this.decls).forEach(function (name) {
      this.decls[name].markdownify();
    }, this);
  };

  jfdoc.Scope = Scope;

}());

