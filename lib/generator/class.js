define(function (require) {

  var assert = require("assert");
  var Scope  = require("../ast/scope");

  var emitClass = function emitClass(ctor) {
    var context = {
      name       : ctor.name,
      crumbs     : this.buildCrumbs(ctor),
      ctor       : this.buildFunctionContext(ctor),
      functions  : [],
      methods    : [],
      properties : [],
    };

    if (ctor.classDoclet) {
      context.description = ctor.classDoclet.markdown;
    }

    Object.keys(ctor.decls).forEach(function (name) {
      /* Process methods separately. */
      if (name === "prototype") return;
      var decl = ctor.decls[name];

      if (!decl.doclet) return;

      switch (decl.doclet.kind) {
        case "function":
          context.functions.push(this.buildFunctionContext(decl)); break;
        case "method":
          context.methods.push(this.buildFunctionContext(decl)); break;
      }
    }, this);

    if (ctor.decls.hasOwnProperty("prototype")) {
      assert.ok(!ctor.decls.prototype.doclet.hasTags(),
        "unexpected documentation of prototype");
      assert.ok(ctor.decls.prototype instanceof Scope,
        "prototype documented as something other than a method, function, " +
        "constructor, or namespace");
      var ptdecls = ctor.decls.prototype.decls;
      Object.keys(ptdecls).forEach(function (name) {
        var decl = ptdecls[name];
        context.methods.push(this.buildFunctionContext(decl));
      }, this);
    }

    this.instantiate(this.pathTo(ctor), "class", context);
  };

  return emitClass;

});

