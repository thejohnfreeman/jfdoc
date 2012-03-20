(function () {

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.generateFiles = function generateFiles() {
    var context = {
      files : []
    };

    this.symbols.files.forEach(function (symbol) {
      var subctx = {
        file : symbol.file,
        author : symbol.tags.author,
        description : symbol.description,
        decls : []
      };

      symbol.decls.forEach(function (decl) {
        var subsubctx = {
          href : ["globals"].concat(decl.scopeQuals).join("/"),
          name : decl.baseName
        };

        if (decl.kind === "function") {
          subsubctx.href += ".html#" + decl.baseName;
          subsubctx.name += "()";
        } else {
          /* Class or namespace. */
          subsubctx.href += "/" + decl.baseName + ".html";
        }

        subctx.decls.push(subsubctx);
      });

      context.files.push(subctx);
    });

    this.instantiate("files", "files", context);
  };

}());

