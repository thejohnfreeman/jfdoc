define(function (require) {

  var fs         = require("fs");
  /* Cannot use Mustache because it does not preserve empty lines. Switched
   * from Hogan to get template inheritance. Do not like complexity or
   * whitespace preservation of Dust. */
  var handlebars = require("handlebars");

  var SymbolTable      = require("./ast/symtab");
  var Parser           = require("./parser/parser");
  var Generator        = require("./generator/generator");

  /**
   * @global
   */
  var Documenter = function Documenter(config) {
    this.config = {
      globalScopeName : "window",
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
    this.symtab = new SymbolTable(this.config.globalScopeName);
  };

  Documenter.prototype.add = function add(filename, source) {
    if (!source) source = fs.readFileSync(filename, "utf8");
    var parser = new Parser(this.symtab, this.config.parser);
    parser.parseFile(filename, source);
  };

  Documenter.prototype.flush = function flush() {
    /* The secret scope is only useful during parsing. Pretend that it never
     * existed. */
    this.symtab.globalScope.parent = null;

    /* Semantic analysis. */
    [
      "markConstructors",
      "copyDeclsToFiles",
      "markdownify",
    ].forEach(function (pass) {
      require("./sema/" + pass)(this.symtab);
    }, this);

    console.log(this.symtab.toPrettyString());

    var genner = new Generator(this.config.generator);
    genner.emitAll(this.symtab);
    this.reset();
  };

  return Documenter;

});

