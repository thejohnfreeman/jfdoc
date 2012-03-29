(function () {

  var fs = require("fs");
  /* Cannot use Mustache because it does not preserve empty lines. Switched
   * from Hogan to get template inheritance. Do not like complexity or
   * whitespace preservation of Dust. */
  var handlebars = require("handlebars");

  var Documenter = function Documenter(config) {
    this.config = {
      parser : {
        spacesPerTab : 2,
      },
      generator : {
        docDir      : config.docDir,
        templateDir : config.templateDir
      }
    };

    this.reset();
  };

  Documenter.prototype.reset = function reset() {
    this.symbols = new jfdoc.SymbolTable();
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

