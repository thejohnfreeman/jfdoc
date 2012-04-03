(function () {

  var fs = require("fs");
  var esprima = require("esprima");

  var Parser = function Parser(symbols, config) {
    this.symbols = symbols;
    this.spacesPerTab = config.spacesPerTab;
  };

  Parser.assert = function assert(condition, doclet, message) {
    if (!condition) Parser.error(doclet, message);
    return !condition;
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
    this.filename = filename;
    this.source = source;

    /* Start the file information. */
    this.symbols.files.unshift(new jfdoc.File(filename));

    /* Normalize the indentation. */
    source = source.replace("\t", Array(this.spacesPerTab + 1).join(" "));

    /* Parse and attach comments to following nodes. */
    var root = esprima.parse(source,
      { comment : true, range : true, loc : true });

    this.sit = new Parser.ScopedIterator(root, this.symbols.globals);
    this.cit = new esprima.CommentIterator(this.sit, root.comments);

    while (!this.cit.pastEnd()) {
      this.parseComment();
      this.cit.next();
    }
  };

  Parser.prototype.parseComment = function parseComment() {
    var comment = this.cit.get();
    /* Filter JSDoc comments. */
    if (comment.type !== "Block" || comment.value[0] !== '*') return;

    /* Remove the comment wrapping from the text. */
    var text = Parser.unindent(this.source, comment.range);
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
    doclet.setLoc(this.filename, this.source, node);
    Parser.inferNameAndKind(doclet, node);

    parts.forEach(function (str) {
      this.parseTag(doclet, str);
    }, this);

    this.finishDoclet(doclet);
  };

  jfdoc.Parser = Parser;

}());

