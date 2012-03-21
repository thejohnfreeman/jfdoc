(function () {

  var fs = require("fs");

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.generateNamespace
    = function generateNamespace(ns, path)
  {
    var context = {
      name : ns.baseName,
      description : ns.markdown,
      functions : [],
      classes : [],
      namespaces : []
    };

    Object.keys(ns.decls).forEach(function (name) {
      var decl = ns.decls[name];

      switch (decl.kind) {
        case "function": context.functions.push({
            name : decl.baseName,
            params : decl.params,
            description : decl.markdown
          }); break;
        case "class": context.classes.push({
            name : decl.baseName,
          }); break;
        case "namespace": context.namespaces.push({
            name : decl.baseName,
          }); break;
        default: console.log("unsupported kind in namespace: " + decl.kind);
      }
    });

    this.instantiate(path + ns.baseName, "namespace", context);

    var nestedPath = path + ns.baseName + "/";
    fs.mkdirSync(this.docDir + "/" + nestedPath);
    context.namespaces.forEach(function (nestedNs) {
      this.generateNamespace(ns.decls[nestedNs.name], nestedPath);
    }, this);
  };

}());

