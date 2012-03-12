(function () {

  var fs = require("fs");
  /* Cannot use mustache.js because it does not preserve empty lines. Hogan
   * also lets us pre-compile templates. */
  var hogan = require("hogan");

  var Documenter = function Documenter() {
    this.docDir = "doc";
    this.tmplDir = "templates";
    this.spacesPerTab = 2;
    this.tagParsers = {};
    this.templates = {};

    /* Symbol table. */
    this.symbols = {
      files : [],
      globals : []
    };

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
  Documenter.prototype.compileTemplates = function compileTemplates() {
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

  jsdoc.Documenter = Documenter;

}());

