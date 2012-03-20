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
      var symbol = ns.decls[name];

      switch (symbol.kind) {
        case "function": context.functions.push({
            name : symbol.baseName,
            params : symbol.params,
            description : symbol.markdown
          }); break;
        case "class": context.classes.push({
            name : symbol.baseName,
          }); break;
        case "namespace": context.namespaces.push({
            name : symbol.baseName,
          }); break;
        default: console.log("unsupported kind in namespace: " + symbol.kind);
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

