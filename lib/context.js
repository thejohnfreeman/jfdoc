(function () {

  var fs = require("fs");
  var esprima = require("esprima");
  var markdown = require("markdown");
  /* Cannot use mustache.js because it does not preserve empty lines. Hogan
   * also lets us pre-compile templates. */
  var hogan = require("hogan");

  var Context = function Context() {
    this.docDir = "doc";
    this.spacesPerTab = 2;
    this.tagParsers = {};
    this.symbols = [];
  };

  Context.prototype.parseTag = function parseTag(symbol, str) {
    var words = str.trim().split(/ +/);
    /* The tag is the first word. */
    var tag = words.shift();
    /* Everything after the tag can only be comprehended by the tag parser.
     * Document the options in the symbol. */
    symbol.comment.tags.push({ tag : tag, options : words.join(" ") });
    /* Call the named tag parser if it exists. */
    var parser = this.tagParsers[tag];
    if (parser) parser(symbol, words);
  };

  Context.prototype.parse = function parse(inFileName, source) {
    /* Normalize the indentation. */
    source = source.replace("\t", Array(this.spacesPerTab + 1).join(" "));

    /* Parse and attach comments to following nodes. */
    var root = esprima.parse(source,
      { comment : true, range : true, loc : true });
    esprima.attachComments(root);

    root.comments.forEach(function (comment) {
      /* Filter JSDoc comments. */
      if (comment.type !== "Block" || comment.value[0] !== '*') return;

      var node = comment.subject;

      /* Unindent the comment and split on tag delimiters. */
      var parts = jsdoc.unindent(source, comment.range);
      parts = jsdoc.uncomment(parts);
      parts = parts.split(/^ *@/gm);

      /* The first part is the description. */
      var description = parts.shift().trim();
      /* The rest of the parts are tags. */

      /* This is the object that will be passed to a Mustache template. */
      var symbol = {
        node : node,
        source : {
          line : node.loc.start.line,
          code : jsdoc.unindent(source, node.range)
        },
        comment : {
          description : description,
          tags : []
        }
      };

      parts.forEach(function (str) {
        this.parseTag(symbol, str);
      }, this);

      /* TODO: Find the correct node and infer anything left unspecified. Allow
       * ourselves to use hints from the tags. */

      this.symbols.push(symbol);
    }, this);
  };

  /* Compile markdown for all descriptions. */
  Context.prototype.markdownify = function markdownify(obj) {
    if (!(typeof obj === "object" && "description" in obj)) return;
    /* TODO: Resolve references. */
    obj.description = markdown.markdown.toHTML(obj.description);
  };

  Context.prototype.compile = function compile() {
    /* TODO: Compile template library. Maybe move to initialization. */
    var template = fs.readFileSync("templates/file.mustache", "utf8");
    template = hogan.compile(template);

    this.symbols.forEach(function (symbol) {
      /* This must wait until after the symbol table is finished. */
      this.markdownify(symbol.comment);
      symbol.comment.tags.forEach(this.markdownify.bind(this));

      var outFileName = this.docDir + "/" + symbol.node.range[0] + ".html";
      console.log("writing " + outFileName);

      var page = template.render(symbol);
      fs.writeFileSync(outFileName, page);
    }, this);
  };

  Context.prototype.add = Context.prototype.parse;

  Context.prototype.flush = function flush() {
    try {
      fs.rmdirSync(this.docDir);
    } catch (e) {
      /* Directory does not exist. Ok. */
      console.log("could not clean output directory: " + e);
    }
    fs.mkdirSync(this.docDir);

    this.compile();

    this.symbols = [];
  };

  jsdoc.Context = Context;

}());

