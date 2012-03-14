(function () {

  var fs = require("fs");
  var markdown = require("markdown");
  var wrench = require("wrench");
  var dust = require("dust");

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

  /**
   * Template handler for enumerating object properties.
   *
   * For developers:
   *
   *   data.__enum = enumHandler;
   *   dust.render(name, data, writer);
   *
   * For designers:
   *
   *   {#__enum:obj}
   *     {key} = {value}
   *   {/__enum}
   */
  var enumHandler = function enumHandler(chunk, context, bodies) {
    var obj = context.current();
    Object.keys(obj).forEach(function (key) {
      chunk = chunk.render(bodies.block,
        context.push({key: key, value: obj[key]}));
    });
    return chunk;
  };

  Documenter.prototype.instantiate
    = function instantiate(fileBasePath, tmplName, context)
  {
    /* TODO: Sanitize file names. */
    var filename = this.docDir + "/" + fileBasePath + ".html";
    console.log("generating " + filename);
    dust.render(tmplName, context, function (err, page) {
      fs.writeFileSync(filename, page);
    });
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

