(function () {

  var fs = require("fs");
  var esprima = require("esprima");

  var Parser = function Parser(symbols, spacesPerTab) {
    this.symbols = symbols;
    this.spacesPerTab = spacesPerTab;
  };

  Parser.prototype.parseFile = function parseFile(filename, source) {
    console.log("Parsing " + filename + "...");

    /* Start the file information. */
    this.symbols.files.unshift(new jfdoc.File(filename));

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
      var parts = Parser.unindent(source, comment.range);
      parts = Parser.uncomment(parts);
      parts = parts.split(/^ *@/gm);

      /* The first part is the description. */
      var description = parts.shift().trim();
      /* The rest of the parts are tags. */

      var decl = new jfdoc.Decl(description, filename, source, node);

      parts.forEach(function (str) {
        this.parseTag(decl, str);
      }, this);

      /* TODO: Find the correct node and infer anything left unspecified.
       * Allow ourselves to use hints from the tags. */

      this.addDecl(decl);
    }, this);
  };

  Parser.prototype.parseTag = function parseTag(decl, str) {
    var m = str.trim().match(/(\w+) *(.*)/);
    if (!m) {
      console.error("could not parse tag name: " + str.slice(0, 10));
      return;
    }
    /* The tag is the first word. */
    var tag = m[1];
    /* Everything after the tag can only be comprehended by the tag parser. */
    var options = m[2];
    /* Document the tag in the decl. */
    decl.tags.push({ tag : tag, options : options });
    /* Call the named tag parser if it exists. */
    var tagp = jfdoc.tags[tag];
    if (tagp) {
      tagp(this, decl, options);
    } else {
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

