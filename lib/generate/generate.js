(function () {

  var fs = require("fs");
  var markdown = require("markdown");
  var wrench = require("wrench");
  var handlebars = require("handlebars");

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.flush = function flush() {
    wrench.rmdirSyncRecursive(this.docDir, /*failSilently=*/true);
    fs.mkdirSync(this.docDir);

    /* This must wait until after the symbol table is finished. */
    this.markdownify(this.symbols);

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
    fs.writeFileSync(filename, template(context));
  };

  /* Compile markdown for all descriptions. */
  Documenter.prototype.markdownify = function markdownify(obj) {
    if (!(typeof obj === "object" && obj)) return;

    if ("description" in obj && !("markdown" in obj)) {
      /* TODO: Resolve references. */
      obj.markdown = markdown.markdown.toHTML(obj.description);
    }

    Object.keys(obj).forEach(function (key) {
      this.markdownify(obj[key]);
    }, this);
  };

}());

