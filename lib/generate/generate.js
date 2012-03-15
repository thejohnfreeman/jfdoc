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
   * Template handler for iterating hash entries.
   *
   * For developers:
   *
   *   data.__each = eachHandler;
   *   dust.render(name, data, callback);
   *
   * For designers:
   *
   *   {#__each:obj key="name"}
   *     {name}, {property1}, {property2}
   *   {/__each}
   */
  var eachHandler = function eachHandler(chunk, context, bodies, params) {
    var obj = context.current();
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];
      if (params.key) {
        value[params.key] = key;
      }
      chunk = chunk.render(bodies.block, context.push(value));
      if (params.key) {
        delete value[params.key];
      }
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

