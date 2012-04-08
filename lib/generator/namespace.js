define(function (require) {

  var fs = require("fs");

  var emitNamespace = function emitNamespace(ns) {
    var context = {
      name         : ns.name,
      crumbs       : this.buildCrumbs(ns),
      description  : ns.doclet.markdown,
      functions    : [],
      constructors : [],
      namespaces   : []
    };

    Object.keys(ns.decls).forEach(function (name) {
      var decl = ns.decls[name];

      if (!decl.doclet) return;

      switch (decl.doclet.kind) {
        case "function":
          context.functions.push(this.buildFunctionContext(decl)); break;
        case "constructor": context.constructors.push({
            href : this.urlTo(decl),
            name : decl.name,
          }); break;
        case "namespace": context.namespaces.push({
            href : this.urlTo(decl),
            name : decl.name,
          }); break;
      }
    }, this);

    this.instantiate(this.pathTo(ns), "namespace", context);

    if (context.namespaces.length || context.constructors.length) {
      fs.mkdirSync(this.pathToDirectory(ns));

      context.namespaces.forEach(function (subns) {
        this.emitNamespace(ns.decls[subns.name]);
      }, this);

      context.constructors.forEach(function (ctor) {
        this.emitClass(ns.decls[ctor.name]);
      }, this);
    }
  };

  return emitNamespace;

});

