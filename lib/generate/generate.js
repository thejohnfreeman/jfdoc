(function () {

  var fs = require("fs");
  var wrench = require("wrench");
  var handlebars = require("handlebars");
  var pretty = require("pretty-data").pd;

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.flush = function flush() {
    wrench.rmdirSyncRecursive(this.docDir, /*failSilently=*/true);
    fs.mkdirSync(this.docDir);

    /* This must wait until after the symbol table is finished. */
    this.symbols.globals.markdownify();

    this.generateFiles();
    this.generateNamespace(this.symbols.globals, "");

    this.reset();
  };

  Documenter.prototype.instantiate
    = function instantiate(fileBasePath, tmplName, context)
  {
    /* TODO: Sanitize file names. */
    var filename = this.docDir + "/" + fileBasePath + ".html";
    console.log("generating " + filename);
    var template = handlebars.loadPartial(tmplName);
    var page = pretty.xml(template(context));
    fs.writeFileSync(filename, page);
  };

}());

