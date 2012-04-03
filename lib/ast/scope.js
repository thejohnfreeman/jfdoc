(function () {

  var assert = require("assert");

  /**
   * Any decl that can have properties and a prototype, i.e., any object or
   * function, can serve as a scope for other decls.
   */
  var Scope = function Scope(name, parent, description) {
    jfdoc.Decl.call(this, name, parent); // base constructor
    this.decls  = {};                    // String -> Decl
    /* Undocumented scopes must be namespaces. */
    this.doclet = new jfdoc.Doclet(description || "");
    this.doclet.setKind("namespace");
  };

  Scope.prototype = Object.create(jfdoc.Decl.prototype);

  /* Constructors are just functions that build a class. They get an extra
   * doclet for the class. */
  Scope.prototype.setClassDoclet = function setClassDoclet(doclet) {
    if (this.classDoclet) {
      console.warn(this.classDoclet + " documented more than once; " +
        "some information will be lost");
      console.warn("dropping documentation from " + this.classDoclet.getLoc());
    }
    this.classDoclet = doclet;
  };

  /**
   * Retrieve the inner scope from inside the outer scope, and create it if it
   * does not exist.
   */
  Scope.prototype.enter = function enter(inner) {
    assert.ok(inner, "expected name for inner scope");
    if (!this.decls.hasOwnProperty(inner)) {
      /* Why create a Scope instead of a Decl? Undeclared scopes may be documented
       * later. We cannot easily change a Decl into a Scope, and if this function is
       * being called, then we know the inner name refers to a scope. */
      this.decls[inner] = new jfdoc.Scope(inner, this);
      /* Assume prototypes are manipulated only on constructors. */
      if (inner === "prototype") this.doclet.setKind("constructor");
    }
    var scope = this.decls[inner];
    return scope;
  };

  Scope.prototype.enterPath = function enterPath(path) {
    var outer = this;
    for (var i = 0; i < path.length; ++i) {
      outer = outer.enter(path[i]);
    }
    return outer;
  };

  /* Similar to enterPath, but will fail if a scope does not exist. */
  Scope.prototype.lookdown = function lookdown(path) {
    var outer = this;
    for (var i = 0; i < path.length; ++i) {
      if (!outer.decls.hasOwnProperty(path[i])) return;
      outer = outer[path[i]];
    }
    return outer;
  };

  Scope.prototype.markdownify = function markdownify() {
    jfdoc.Decl.prototype.markdownify.call(this);
    if (this.classDoclet) this.classDoclet.markdownify();
    Object.keys(this.decls).forEach(function (name) {
      this.decls[name].markdownify();
    }, this);
  };

  jfdoc.Scope = Scope;

}());

