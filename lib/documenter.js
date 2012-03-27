(function () {

  var fs = require("fs");
  /* Cannot use Mustache because it does not preserve empty lines. Switched
   * from Hogan to get template inheritance. Do not like complexity or
   * whitespace preservation of Dust. */
  var handlebars = require("handlebars");

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
      globals : new jfdoc.Scope(null, "globals")
    };
  };

  /* The templates directory should contain at least these templates:
   *   - file.hbs
   *   - namespace.hbs
   *   - class.hbs
   * Any addtional templates present will be available as partials.
   */
  compileTemplates = function compileTemplates(doc) {
    var filenames = fs.readdirSync(doc.tmplDir);

    filenames.forEach(function (filename) {
      var m = filename.match(/^(\w*)\.hbs$/);
      if (!m) {
        console.log("unhandled template file: " + filename);
        return;
      }
      var name = m[1];

      var source = fs.readFileSync(doc.tmplDir + "/" + filename, "utf8");
      handlebars.registerPartial(name, source);
    }, this);
  };

  jfdoc.Documenter = Documenter;

}());

