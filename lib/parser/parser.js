(function () {

  var fs = require("fs");
  var esprima = require("esprima");

  var Parser = function Parser(symbols, config) {
    this.symbols = symbols;
    this.spacesPerTab = config.spacesPerTab;
    this.context = null;
  };

  Parser.prototype.parseFile = function parseFile(filename, source) {
    console.log("Parsing " + filename + "...");
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

    var it = new jfdoc.ScopedIterator(root);
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
    var doclet = new jfdoc.Doclet(
      description, this.context.filename, this.context.source, node);

    parts.forEach(function (str) {
      this.parseTag(doclet, str);
    }, this);

    this.addDoclet(doclet);
  };

  Parser.prototype.parseTag = function parseTag(doclet, str) {
    var m = str.trim().match(/(\w+) *([\s\S]*)/);
    if (!m) {
      console.error("could not parse tag name: " + str.slice(0, 10) + "...");
      return;
    }
    /* The tag is the first word. */
    var tag = m[1];
    /* Everything after the tag can only be comprehended by the tag parser. */
    var options = m[2].trim();
    /* Call the named tag parser if it exists. */
    if (jfdoc.tags.hasOwnProperty(tag)) {
      var tagp = jfdoc.tags[tag];
      tagp(this, doclet, options);
    } else {
      doclet.addTag(tag, { options : options });
      /* Make sure you remembered to register your tag parser. */
      console.error("unsupported tag: @" + tag);
    }
  };

  jfdoc.Parser = Parser;

}());

