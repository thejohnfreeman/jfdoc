define(function (require) {

  var fs         = require("fs");
  var wrench     = require("wrench");
  var handlebars = require("handlebars");
  require("../utility/handlebars");
  var pretty     = require("pretty-data").pd;

  var Generator = function Generator(config) {
    this.docDir      = config.docDir      || "doc";
    this.templateDir = config.templateDir || "templates";
    this.baseUrl     = config.baseUrl     ||
      process.cwd() + "/" + this.docDir;
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
    var filenames = fs.readdirSync(dir);

    filenames.forEach(function (filename) {
      var m = filename.match(/^(\w*)\.hbs$/);
      if (!m) {
        console.log("unhandled template file " + filename +
          "; make sure it has .hbs extension");
        return;
      }
      var name = m[1];

      var source = fs.readFileSync(dir + "/" + filename, "utf8");
      handlebars.registerPartial(name, source);
    });
  };

  Generator.prototype.instantiate
    = function instantiate(filename, templateName, context)
  {
    console.log("documenting " + templateName + " at " + filename);
    var template = handlebars.loadPartial(templateName);
    var page = pretty.xml(template(context));
    fs.writeFileSync(filename, page);
  };

  Generator.prototype.emitAll = function emitAll(symtab) {
    this.symtab = symtab;

    wrench.rmdirSyncRecursive(this.docDir, /*failSilently=*/true);
    wrench.mkdirSyncRecursive(this.docDir);

    this.emitFiles();
    this.emitNamespace(symtab.globalScope, "");
  };

  var address = require("./address");
  Generator.prototype.relativePathTo       = address.relativePathTo;
  Generator.prototype.hashTo               = address.hashTo;
  Generator.prototype.pathTo               = address.pathTo;
  Generator.prototype.pathToDirectory      = address.pathToDirectory;
  Generator.prototype.urlTo                = address.urlTo;
  Generator.prototype.emitFiles            = require("./files");
  Generator.prototype.emitNamespace        = require("./namespace");
  Generator.prototype.emitClass            = require("./class");
  Generator.prototype.buildFunctionContext = require("./function");
  Generator.prototype.buildCrumbs          = require("./crumbs");

  return Generator;

});

