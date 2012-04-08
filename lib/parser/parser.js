define(function (require) {

  var esprima = require("esprima");

  var wrap           = require("../utility/esprima/wrap");
  var scan           = require("../scanner/scan");
  var File           = require("../ast/file");
  var SourceLocation = require("../ast/source-location");
  var ScopeChain     = require("./scope-chain");

  var Parser = function Parser(symtab, config) {
    config = config || {};

    this.symtab = symtab;

    this.config = {
      spacesPerTab : 2,
      infer : true
    };
    Object.keys(config).forEach(function (key) {
      this.config[key] = config[key];
    }, this);
  };

  Parser.prototype.parseFile = function parseFile(filename, source) {
    console.log("parsing " + filename + "...");
    /* Start the file information. */
    var file = new File(filename);
    this.symtab.files.unshift(file);
    this.loc = new SourceLocation(file, 0);

    /* Normalize the indentation. */
    source = source
      .replace("\t", Array(this.config.spacesPerTab + 1).join(" "));
    this.source = source;

    /* Our Parser's "token stream" is actually the Mozilla AST. */
    var root = esprima.parse(source,
      { comment : true, range : true, loc : true });
    root = wrap(root);

    this.chain = new ScopeChain(root, this.symtab.globalScope);

    var self = this;
    scan(root, self.loc, self.chain, function (comment, node) {
      self.buildDoclet(comment, node);
    });
  };

  Parser.prototype.getLoc = function getLoc() {
    return this.loc;
  };

  Parser.prototype.splitComment = require("./split-comment");
  Parser.prototype.buildDoclet  = require("./build-doclet");
  Parser.prototype.parseTag     = require("./tag");
  Parser.prototype.finishDoclet = require("./finish-doclet");
  Parser.prototype.addDecl      = require("./add-decl");

  return Parser;

});

