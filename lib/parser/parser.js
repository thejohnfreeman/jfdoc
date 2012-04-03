(function () {

  var fs = require("fs");
  var esprima = require("esprima");

  var Parser = function Parser(symbols, config) {
    this.symbols = symbols;
    this.spacesPerTab = config.spacesPerTab;
    this.context = null;
  };

  Parser.error = function error(doclet, message) {
    console.error(doclet.getLoc() + ": error: " + message);
  };

  Parser.warn = function warn(doclet, message) {
    console.warn(doclet.getLoc() + ": warning: " + message);
  };

  Parser.log = function log(doclet, message) {
    console.log(doclet.getLoc() + ": log: " + message);
  };

  Parser.prototype.parseFile = function parseFile(filename, source) {
    console.log("parsing " + filename + "...");
    this.context = {
      filename : filename,
      source : source
    };

    /* Start the file information. */
    this.symbols.files.unshift(new jfdoc.File(filename));

    /* Normalize the indentation. */
    source = source.replace("\t", Array(this.spacesPerTab + 1).join(" "));

    /* Parse and attach comments to following nodes. */
    var root = esprima.parse(source,
      { comment : true, range : true, loc : true });

    var it = new Parser.ScopedIterator(root, this.symbols.globals);
    it = new esprima.CommentIterator(it, root.comments);

    while (!it.pastEnd()) {
      this.parseComment(it);
      it.next();
    }
  };

  Parser.prototype.parseComment = function parseComment(it) {
    var comment = it.get();
    /* Filter JSDoc comments. */
    if (comment.type !== "Block" || comment.value[0] !== '*') return;

    /* Remove the comment wrapping from the text. */
    var text = Parser.unindent(this.context.source, comment.range);
    text = Parser.uncomment(text);
    /* Must strip leading asterisks so that we do not treat horizontal-rule
     * comments as descriptions. */
    text = text.replace(/^\*+/, "");
    if (text.trim() === "") return;

    var parts = text.split(/^ *@/gm);

    /* The first part is the description. */
    var description = parts.shift().trim();
    /* The rest of the parts are tags. */

    var node = comment.subject;
    var doclet = new jfdoc.Doclet(description, /*isExplicit=*/true);
    doclet.setLoc(this.context.filename, this.context.source, node);

    parts.forEach(function (str) {
      this.parseTag(doclet, str);
    }, this);

    this.addDoclet(doclet);
  };

  jfdoc.Parser = Parser;

}());

