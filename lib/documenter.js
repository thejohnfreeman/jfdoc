(function () {

  var fs = require("fs");
  /* Cannot use Mustache because it does not preserve empty lines. Switched
   * from Hogan to get template inheritance. */
  var dust = require("dust");

  var Documenter = function Documenter() {
    this.docDir = "doc";
    this.tmplDir = "templates";
    this.spacesPerTab = 2;
    this.tagParsers = {};

    /* Symbol table. */
    this.symbols = {
      files : [],
      globals : []
    };

    /* Object.extend would be nice. */
    Object.keys(jfdoc.tags).forEach(function (tag) {
      this.tagParsers[tag] = jfdoc.tags[tag];
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
    /* Disable whitespace compression in dust. */
    dust.optimizers.format = function (ctx, node) { return node; };

    var filenames = fs.readdirSync(this.tmplDir);

    filenames.forEach(function (filename) {
      var nameMatch = filename.match(/^(\w*)\.dust$/);
      if (!nameMatch) {
        console.warn("unhandled template file: " + filename);
        return;
      }
      var tmplName = nameMatch[1];

      var tmplSrc = fs.readFileSync(this.tmplDir + "/" + filename, "utf8");
      var tmpl = dust.compileFn(tmplSrc, tmplName);
    }, this);
  };

  jfdoc.Documenter = Documenter;

}());

