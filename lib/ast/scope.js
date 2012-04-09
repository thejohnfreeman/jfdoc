define(function (require) {

  var assert = require("assert");
  var Name   = require("./name");
  var Decl   = require("./decl");
  var Doclet = require("./doclet");

  /**
   * Any decl that can have properties and a prototype, i.e., any object or
   * function, can serve as a scope for other decls.
   */
  var Scope = function Scope(name, parent, description) {
    Decl.call(this, name, parent); // base constructor
    this.decls       = {};  // String -> Decl
    /* Undocumented scopes must be namespaces. */
    var qname        = new Name(name);
    this.doclet      = new Doclet(qname, "namespace");
    this.doclet.desc = description || "";
    /* Constructors are just functions that build a class. They get an extra
     * doclet for the class. */
    this.docClass    = undefined;
  };

  Scope.prototype = Object.create(Decl.prototype);

  Scope.prototype.add = function add(decl, name) {
    name = name || decl.name;
    assert.ok(name, "expected name for new declaration");
    this.decls[name] = decl;
  };

  /**
   * Retrieve the inner scope from inside the outer scope, and create it if
   * it does not exist.
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

