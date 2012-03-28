(function () {

  var fs = require("fs");
  var esprima = require("esprima");

  var Parser = function Parser(symbols, spacesPerTab) {
    this.symbols = symbols;
    this.spacesPerTab = spacesPerTab;
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
    esprima.attachComments(root);

    root.comments.forEach(this.parseComment, this);
  };

  Parser.prototype.parseComment = function parseComment(comment) {
    /* Filter JSDoc comments. */
    if (comment.type !== "Block" || comment.value[0] !== '*') return;

    var node = comment.subject;

    /* Unindent the comment and split on tag delimiters. */
    var parts = Parser.unindent(this.context.source, comment.range);
    parts = Parser.uncomment(parts);
    parts = parts.split(/^ *@/gm);

    /* The first part is the description. */
    var description = parts.shift().trim();
    /* The rest of the parts are tags. */

    var doclet = new jfdoc.Doclet(
      description, this.context.filename, this.context.source, node);

    parts.forEach(function (str) {
      this.parseTag(doclet, str);
    }, this);

    /* TODO: Find the correct node and infer anything left unspecified.
     * Allow ourselves to use hints from the tags. */

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
    var tagp = jfdoc.tags[tag];
    if (tagp) {
      tagp(this, doclet, options);
    } else {
      doclet.addTag(tag, { options : options });
      /* Make sure you remembered to register your tag parser. */
      console.error("unsupported tag: @" + tag);
    }
  };

  jfdoc.Parser = Parser;

  jfdoc.Documenter.prototype.add = function add(filename, source) {
    if (!source) source = fs.readFileSync(filename, "utf8");
    var parser = new Parser(this.symbols, this.spacesPerTab);
    parser.parseFile(filename, source);
  };

}());

