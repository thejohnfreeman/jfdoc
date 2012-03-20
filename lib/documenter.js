(function () {

  var fs = require("fs");
  /* Cannot use Mustache because it does not preserve empty lines. Switched
   * from Hogan to get template inheritance. */
  var dust = require("dust");

  var Documenter = function Documenter() {
    this.docDir = "doc";
    this.tmplDir = "templates";
    this.spacesPerTab = 2;

    this.reset();
    compileTemplates(this);
  };

  Documenter.prototype.reset = function reset() {
    /* Symbol table. */
    this.symbols = {
      files : [],
      globals : {
        baseName : "(globals)",
        scopeQuals : [],
        tags : [],
        decls : {}
      }
    };
  };

  /* The templates directory should contain these templates:
   *   - file.mustache
   *   - namespace.mustache
   *   - class.mustache
   * Any addtional templates present will be available as partials.
   */
  compileTemplates = function compileTemplates(doc) {
    /* Disable whitespace compression in dust. */
    dust.optimizers.format = function (ctx, node) { return node; };

    var filenames = fs.readdirSync(this.tmplDir);

    filenames.forEach(function (filename) {
      var m = filename.match(/^(\w*)\.dust$/);
      if (!m) {
        console.warn("unhandled template file: " + filename);
        return;
      }
      var name = m[1];

      var source = fs.readFileSync(doc.tmplDir + "/" + filename, "utf8");
      dust.compileFn(source, name);
    });
  };

  jfdoc.Documenter = Documenter;

}());

