(function () {

  /**
   * Any decl that can have properties and a prototype, i.e., any object or
   * function, can serve as a scope for other decls.
   */
  var Scope = function Scope(parent, name) {
    jfdoc.Decl.call(this, parent, name); // base constructor
    this.decls = {};                     // String -> Decl
  };

  Scope.prototype = new jfdoc.Decl();

  /* Constructors are just functions that build a class. They get an extra
   * doclet for the class. */
  Scope.prototype.setClassDoclet = function setClassDoclet(doclet) {
    if (this.classDoclet) {
      console.warn("class (" + this.getQualName() +
        ") documented more than once; some information will be lost");
      console.warn("dropping documentation from " + this.classDoclet.getLoc());
    }
    this.classDoclet = doclet;
  };

  /**
   * Retrieve the inner scope from inside the outer scope, and create it if it
   * does not exist.
   */
  Scope.prototype.enterScope = function enterScope(inner) {
    /* TODO: Any special treatment required for "prototype"? */
    var scope = this.decls[inner];
    if (!scope) {
      /* Why create a Scope instead of a Decl? Undeclared scopes may be documented
       * later. We cannot easily change a Decl into a Scope, and if this function is
       * being called, then we know the inner name refers to a scope. */
      scope = this.decls[inner] = new jfdoc.Scope(this, inner);
    }
    return scope;
  };

  Scope.prototype.enterScopeChain = function enterScopeChain(chain) {
    if (typeof chain === "string") chain = chain.split(".");
    var outer = this;
    chain.forEach(function (inner) {
      outer = outer.enterScope(inner);
    });
    return outer;
  };

  Scope.prototype.markdownify = function markdownify() {
    jfdoc.Decl.prototype.markdownify.call(this);
    Object.keys(this.decls).forEach(function (name) {
      this.decls[name].markdownify();
    }, this);
  };

  jfdoc.Scope = Scope;

}());
