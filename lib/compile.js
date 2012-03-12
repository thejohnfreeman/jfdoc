(function () {

  var fs = require("fs");
  var markdown = require("markdown");
  var wrench = require("wrench");

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.flush = function flush() {
    wrench.rmdirSyncRecursive(this.docDir, /*failSilently=*/true);
    fs.mkdirSync(this.docDir);

    this.compile();

    this.files = [];
  };

  Documenter.prototype.compile = function compile() {
    this.instantiate("files", "files", { files : this.symbols.files });
  };

  Documenter.prototype.instantiate
    = function instantiate(fileBasePath, tmplName, data)
  {
    /* This must wait until after the symbol table is finished. */
    this.markdownify(data);

    var filename = this.docDir + "/" + fileBasePath + ".html";
    console.log("writing " + filename);

    var template = this.templates[tmplName];
    var page = template.render(data, this.templates);
    fs.writeFileSync(filename, page);
  };

  /* Compile markdown for all descriptions. */
  Documenter.prototype.markdownify = function markdownify(obj) {
    if (!(typeof obj === "object" && obj)) return;

    if ("description" in obj) {
      /* TODO: Resolve references. */
      obj.description = markdown.markdown.toHTML(obj.description);
    }

    Object.keys(obj).forEach(function (key) {
      this.markdownify(obj[key]);
    }, this);
  };

}());

