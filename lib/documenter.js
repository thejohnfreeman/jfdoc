(function () {

  var fs = require("fs");
  /* Cannot use Mustache because it does not preserve empty lines. Switched
   * from Hogan to get template inheritance. Do not like complexity or
   * whitespace preservation of Dust. */
  var handlebars = require("handlebars");

  var Documenter = function Documenter(docDir, templateDir) {
    this.config = {
      parser : {
        spacesPerTab : 2,
      },
      generator : {
        docDir : docDir,
        templateDir : templateDir
      }
    };

    this.reset();
  };

  Documenter.prototype.reset = function reset() {
    /* Symbol table. */
    this.symbols = {
      files : [],
      globals : new jfdoc.Scope(null, "globals")
    };
  };

  Documenter.prototype.add = function add(filename, source) {
    if (!source) source = fs.readFileSync(filename, "utf8");
    var parser = new jfdoc.Parser(this.symbols, this.config.parser);
    parser.parseFile(filename, source);
  };

  Documenter.prototype.flush = function flush() {
    var genner = new jfdoc.Generator(this.symbols, this.config.generator);
    genner.emitAll();
    this.reset();
  };

  jfdoc.Documenter = Documenter;

}());

