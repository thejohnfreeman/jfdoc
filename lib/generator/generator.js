(function () {

  var fs = require("fs");
  var wrench = require("wrench");
  var handlebars = require("handlebars");
  var pretty = require("pretty-data").pd;

  var Generator = function Generator(symbols, config) {
    this.symbols     = symbols;
    this.docDir      = config.docDir      || "doc";
    this.templateDir = config.templateDir || "templates";
    initialize(this);
  };

  /**
   * Compiles templates as partials.
   *
   * The templates directory should contain at least these templates:
   *
   *   - file.hbs
   *   - namespace.hbs
   *   - class.hbs
   *
   * Any addtional templates present will be available as partials.
   */
  var initialize = function initialize(genner) {
    var dir = genner.templateDir;
    console.log("looking for templates in " + dir + "...");
    var filenames = fs.readdirSync(dir);

    filenames.forEach(function (filename) {
      var m = filename.match(/^(\w*)\.hbs$/);
      if (!m) {
        console.log("unhandled template file: " + filename);
        return;
      }
      var name = m[1];

      var source = fs.readFileSync(dir + "/" + filename, "utf8");
      handlebars.registerPartial(name, source);
    });
  };

  Generator.prototype.instantiate
    = function instantiate(fileBasePath, templateName, context)
  {
    /* TODO: Sanitize file names. */
    var filename = this.docDir + "/" + fileBasePath + ".html";
    console.log("generating " + filename);
    var template = handlebars.loadPartial(templateName);
    var page = pretty.xml(template(context));
    fs.writeFileSync(filename, page);
  };

  Generator.prototype.emitAll = function emitAll(symbols) {
    wrench.rmdirSyncRecursive(this.docDir, /*failSilently=*/true);
    wrench.mkdirSyncRecursive(this.docDir);

    /* This must wait until after the symbol table is finished. */
    this.symbols.globals.markdownify();

    this.emitFiles();
    this.emitNamespace(this.symbols.globals, "");
  };

  jfdoc.Generator = Generator;

}());

