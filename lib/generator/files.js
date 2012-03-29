(function () {

  jfdoc.Generator.prototype.emitFiles = function emitFiles() {
    var context = {
      files : []
    };

    this.symbols.files.forEach(function (file) {
      var fileContext = {
        file : file.name,
        decls : []
      };

      if (file.doclet) {
        /* TODO: Do not assume a single author. */
        fileContext.author = file.doclet.tags.author[0].name;
        fileContext.description = file.doclet.markdown;
      };

      file.decls.forEach(function (decl) {
        var declContext = {
          href : decl.getQualifiers().join("/"),
          name : decl.name
        };

        if (decl.doclet.kind === "function") {
          declContext.href += ".html#" + decl.name;
          declContext.name += "()";
        } else {
          /* Class or namespace. */
          declContext.href += "/" + decl.name + ".html";
        }

        fileContext.decls.push(declContext);
      });

      context.files.push(fileContext);
    });

    this.instantiate("files", "files", context);
  };

}());

