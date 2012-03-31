(function () {

  var fs = require("fs");

  jfdoc.Generator.prototype.emitNamespace = function emitNamespace(ns) {
    var context = {
      name : ns.name,
      functions : [],
      classes : [],
      namespaces : []
    };

    if (ns.doclet) {
      context.description = ns.doclet.markdown;
    }

    Object.keys(ns.decls).forEach(function (name) {
      var decl = ns.decls[name];

      if (!decl.doclet) return;

      switch (decl.doclet.kind) {
        case "function": context.functions.push({
            href : this.urlTo(decl),
            name : decl.name,
            params : decl.doclet.tags.param,
            description : decl.doclet.markdown,
            source : decl.doclet.source
          }); break;
        case "constructor": context.classes.push({
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

    if (context.namespaces.length) {
      fs.mkdirSync(this.pathToDirectory(ns));
      context.namespaces.forEach(function (nestedNs) {
        this.emitNamespace(ns.decls[nestedNs.name]);
      }, this);
    }
  };

}());

