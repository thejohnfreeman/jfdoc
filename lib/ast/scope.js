define(function (require) {

  var assert = require("assert");

  var Decl = require("./decl");
  var Doclet = require("./doclet");

  /**
   * Any decl that can have properties and a prototype, i.e., any object or
   * function, can serve as a scope for other decls.
   */
  var Scope = function Scope(name, parent, description) {
    Decl.call(this, name, parent); // base constructor
    this.decls    = {};            // String -> Decl
    /* Undocumented scopes must be namespaces. */
    this.doclet = new Doclet(description || "");
    this.doclet.setKind("namespace");
  };

  Scope.prototype = Object.create(Decl.prototype);

  /* Constructors are just functions that build a class. They get an extra
   * doclet for the class. */
  Scope.prototype.mergeClassDoclet = function mergeClassDoclet(doclet) {
    if (!doclet) return;
    /* Class doclets are always explicit, so they should only ever be set
     * once. */
    if (this.classDoclet) {
      console.warn(this.classDoclet + " documented more than once; " +
        "some information will be lost");
      console.warn("dropping documentation from " +
        this.classDoclet.getLoc());
    }
    this.classDoclet = doclet;
  };

  Scope.prototype.add = function add(decl, name) {
    name = name || decl.name;
    assert.ok(name, "expected name for new declaration");
    this.decls[name] = decl;
  };

  /**
   * Retrieve the inner scope from inside the outer scope, and create it if it
   * does not exist.
   */
  Scope.prototype.enter = function enter(inner) {
    assert.ok(inner, "expected name for inner scope");
    if (!this.decls.hasOwnProperty(inner)) {
      /* Why create a Scope instead of a Decl? Undeclared scopes may be
       * documented later. We cannot easily change a Decl into a Scope, and if
       * this function is being called, then we know the inner name refers to
       * a scope. */
      this.add(new Scope(inner, this));
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
      var name = path[i];
      if (!(outer && outer.decls.hasOwnProperty(name))) return;
      outer = outer.decls[name];
    }
    return outer;
  };

  Scope.prototype.lookup = function lookup(name) {
    var decl = null;
    var scope = this;
    while (scope) {
      if (scope.decls.hasOwnProperty(name)) {
        decl = scope.decls[name];
        break;
      }
      var scope = scope.parent;
    }
    return decl;
  };

  Scope.prototype.toPrettyString = function toPrettyString(level) {
    var indent = Array(2 * level + 1).join(" ");
    var str = indent + this.doclet.kind + " " + this.name +
      (this.parent ? (" < " + this.parent.name) : "") + "\n";

    var body = "";
    Object.keys(this.decls).forEach(function (name) {
      body += this.decls[name].toPrettyString(level + 1);
    }, this);
    if (body) str += indent + "{\n" + body + indent + "}\n";

    return str;
  };

  return Scope;

});

