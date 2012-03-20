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
        case "class": context.classes.push(symbol); break;
        case "function": context.functions.push(symbol); break;
        case "namespace": context.namespaces.push(symbol); break;
        default: console.log("unsupported kind in namespace: " + symbol.kind);
      }
    });

    this.instantiate(path + ns.baseName, "namespace", context);

    //var nestedPath = path + ns.baseName + "/";
    //fs.mkdirSync(this.docDir + "/" + nestedPath);
    //context.namespaces.forEach(function (nestedNs) {
      //this.generateNamespace(nestedNs, nestedPath);
    //}, this);
  };

}());

