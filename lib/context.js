(function () {

  var fs = require("fs");
  var esprima = require("esprima");
  /* Cannot use mustache.js because it does not preserve empty lines. Hogan
   * also lets us pre-compile templates. */
  var hogan = require("hogan");

  var Context = function Context() {
    this.docDir = "doc";
    this.spacesPerTab = 2;
    this.tagParsers = {};
  };

  Context.prototype.setup = function setup() {
    try {
      fs.rmdirSync(this.docDir);
    } catch (e) {
      /* Directory does not exist. Ok. */
      console.log("could not clean output directory: " + e);
    }
    fs.mkdirSync(this.docDir);
  };

  Context.prototype.parseTag = function parseTag(str) {
    var words = str.split(/ +/);
    /* The tag is the first word. */
    var tag = words.shift().trim();
    /* Everything after the tag can only be comprehended by the tag parser. */
    var options = words.join(" ");
    /* Call the named tag parser. If none exists, the default is to just return
     * the tag and options. */
    var parser = this.tagParsers[tag];
    return (parser ? parser(options) : { tag : tag, options : options });
  };

  Context.prototype.parse = function parse(inFileName, source) {
    /* Normalize the indentation. */
    source = source.replace("\t", Array(this.spacesPerTab + 1).join(" "));

    /* Parse and attach comments to following nodes. */
    var root = esprima.parse(source,
      { comment : true, range : true, loc : true });
    esprima.attachComments(root);

    var symbols = [];

    root.comments.forEach(function (comment) {
      /* Filter JSDoc comments. */
      if (comment.type !== "Block" || comment.value[0] !== '*') return;

      /* Unindent the comment and split on tag delimiters. */
      var parts = jsdoc.unindent(source, comment.range);
      parts = jsdoc.uncomment(parts);
      parts = parts.split(/^ *@/gm);

      var description = parts.shift().trim();
      var tags = parts.map(this.parseTag.bind(this));

      /* TODO: Pass descriptions through Markdown. */
      /* TODO: Find the symbol. */

      var node = comment.subject;

      /* This is the object that will be passed to a Mustache template. */
      symbols.push({
        node : node,
        comment : {
          description : description,
          tags : tags
        },
        source : {
          line : node.loc.start.line,
          code : jsdoc.unindent(source, node.range)
        }
      });

    }, this);

    return symbols;
  };

  Context.prototype.compile = function compile(symbols) {
    /* TODO: Compile template library. */
    var template = fs.readFileSync("templates/file.mustache", "utf8");
    template = hogan.compile(template);

    symbols.forEach(function (symbol) {
      /* TODO: Resolve references in descriptions. */
      var outFileName = this.docDir + "/" + symbol.node.range[0] + ".html";
      console.log("writing " + outFileName);
      var page = template.render(symbol);
      fs.writeFileSync(outFileName, page);
    }, this);
  };

  jsdoc.Context = Context;

}());

