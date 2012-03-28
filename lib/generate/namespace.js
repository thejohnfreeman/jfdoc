(function () {

  var fs = require("fs");

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.generateNamespace
    = function generateNamespace(ns, path)
  {
    var context = {
      path : path,
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
            name : decl.name,
            params : decl.doclet.tags.param,
            description : decl.doclet.markdown,
            source : decl.doclet.source
          }); break;
        case "constructor": context.classes.push({
            name : decl.name,
          }); break;
        case "namespace": context.namespaces.push({
            name : decl.name,
          }); break;
      }
    });

    this.instantiate(path + ns.name, "namespace", context);

    var nestedPath = path + ns.name + "/";
    fs.mkdirSync(this.docDir + "/" + nestedPath);
    context.namespaces.forEach(function (nestedNs) {
      this.generateNamespace(ns.decls[nestedNs.name], nestedPath);
    }, this);
  };

}());

