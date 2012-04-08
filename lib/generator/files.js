define(function () {

  emitFiles = function emitFiles() {
    var context = {
      files : []
    };

    this.symtab.files.forEach(function (file) {
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
          href : this.urlTo(decl),
          name : decl.name
        };

        if (decl.doclet.kind === "function") {
          declContext.name += "()";
        }

        fileContext.decls.push(declContext);
      }, this);

      context.files.push(fileContext);
    }, this);

    this.instantiate(this.docDir + "/files.html", "files", context);
  };

  return emitFiles;

});

