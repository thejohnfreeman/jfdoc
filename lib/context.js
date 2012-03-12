(function () {

  var fs = require("fs");
  /* Cannot use mustache.js because it does not preserve empty lines. Hogan
   * also lets us pre-compile templates. */
  var hogan = require("hogan");

  var Context = function Context() {
    this.docDir = "doc";
    this.tmplDir = "templates";
    this.spacesPerTab = 2;
    this.tagParsers = {};
    this.templates = {};

    this.files = [];

    /* Object.extend would be nice. */
    ["file", "author"].forEach(function (tag) {
      this.tagParsers[tag] = jsdoc.tags[tag];
    }, this);

    this.compileTemplates();
  };

  /* The templates directory should contain these templates:
   *   - file.mustache
   *   - namespace.mustache
   *   - class.mustache
   * Any addtional templates present will be available as partials.
   */
  Context.prototype.compileTemplates = function compileTemplates() {
    var filenames = fs.readdirSync(this.tmplDir);

    filenames.forEach(function (filename) {
      var kindMatch = filename.match(/^(\w*)\.mustache$/);
      if (!kindMatch) {
        console.warn("unhandled template file: " + filename);
        return;
      }
      var kind = kindMatch[1];

      var file = fs.readFileSync(this.tmplDir + "/" + filename, "utf8");
      var template = hogan.compile(file);
      this.templates[kind] = template;
    }, this);

    ["file", "namespace", "class"].forEach(function (kind) {
      if (!(kind in this.templates)) {
        console.error("missing template file: " +
          this.tmplDir + "/" + kind + ".mustache");
      }
    }, this);
  };

  /* Compile markdown for all descriptions. */
  Context.prototype.markdownify = function markdownify(obj) {
    if (!(typeof obj === "object" && obj)) return;

    if ("description" in obj) {
      /* TODO: Resolve references. */
      obj.description = markdown.markdown.toHTML(obj.description);
    }

    Object.keys(obj).forEach(function (key) {
      this.markdownify(obj[key]);
    }, this);
  };

  Context.prototype.instantiate
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

  Context.prototype.compile = function compile() {
    var fileList = Object.keys(this.files).map(function (filename) {
      return this.files[filename];
    }, this);
    util.inspect(fileList);
    this.instantiate("files", "files", { files : fileList });
  };

  Context.prototype.add = Context.prototype.parse;

  Context.prototype.flush = function flush() {
    try {
      fs.rmdirSync(this.docDir);
    } catch (e) {
      /* Directory does not exist. Ok. */
      console.log("could not clean output directory: " + e);
    }
    fs.mkdirSync(this.docDir);

    this.compile();

    this.symbols = [];
  };

  jsdoc.Context = Context;

}());

