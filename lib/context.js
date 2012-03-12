(function () {

  var fs = require("fs");
  var esprima = require("esprima");
  var mustache = require("mustache");

  var Context = function Context() {
    this.docDir = "doc";
  };

  Context.prototype.setup = function setup() {
    /* TODO: Configurable. */
    try {
      fs.rmdirSync(this.docDir);
    } catch (e) {
      /* Directory does not exist. Ok. */
    }
    fs.mkdirSync(this.docDir);
  };

  Context.prototype.parse = function parse(inFileName, source) {
    /* Normalize the indentation. */
    /* TODO: Configurable. */
    source = source.replace("\t", "  ");

    /* Parse and attach comments to following nodes. */
    var root = esprima.parse(source,
      { comment : true, range : true, loc : true });
    esprima.attachComments(root);

    var symbols = [];

    root.comments.forEach(function (comment) {
      /* Filter JSDoc comments. */
      if (comment.type !== "Block" || comment.value[0] !== '*') return;

      /* TODO: Parse comment for description and tags. */
      /* TODO: Pass descriptions through Markdown. */
      /* TODO: Find the symbol. */

      var node = comment.subject;
      symbols.push({
        node : node,
        comment : comment.value,
        source : jsdoc.unindent(source, node.range)
      });

    });

    return symbols;
  };

  Context.prototype.compile = function compile(symbols) {
    symbols.forEach(function (symbol) {
      /* TODO: Resolve references in descriptions. */
      var str = symbol.comment + "\napplies to " + symbol.node.type +
        " node at line " + symbol.node.loc.start.line + ":\n\n" +
        symbol.source + "\n";
      console.log(str);

      var outFileName = this.docDir + "/" + symbol.node.range[0] + ".html";
      var template = fs.readFileSync("templates/file.mustache", "utf8");
      var page = mustache.render(template, {});
      fs.writeFile(outFileName, page);
    });
  };

  jsdoc.Context = Context;

}());

