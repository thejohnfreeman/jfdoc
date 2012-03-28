(function () {

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.generateFiles = function generateFiles() {
    var context = {
      files : []
    };

    this.symbols.files.forEach(function (file) {
      var subctx = {
        file : file.name,
        decls : []
      };

      if (file.doclet) {
        /* TODO: Do not assume a single author. */
        subctx.author = file.doclet.tags.author[0].name;
        subctx.description = file.doclet.markdown;
      };

      file.decls.forEach(function (decl) {
        var subsubctx = {
          href : decl.getQualifiers().join("/"),
          name : decl.name
        };

        if (decl.doclet.kind === "function") {
          subsubctx.href += ".html#" + decl.name;
          subsubctx.name += "()";
        } else {
          /* Class or namespace. */
          subsubctx.href += "/" + decl.name + ".html";
        }

        subctx.decls.push(subsubctx);
      });

      context.files.push(subctx);
    });

    this.instantiate("files", "files", context);
  };

}());

