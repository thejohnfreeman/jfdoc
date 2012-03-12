(function () {

  var esprima = require("esprima");

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.parseTag = function parseTag(symbol, str) {
    var words = str.trim().split(/ +/);
    /* The tag is the first word. */
    var tag = words.shift();
    /* Everything after the tag can only be comprehended by the tag parser.
     * Document the options in the symbol. */
    symbol.tags.push({ tag : tag, options : words.join(" ") });
    /* Call the named tag parser if it exists. */
    var parser = this.tagParsers[tag];
    if (parser) {
      parser(symbol, words);
    } else {
      /* Make sure you remembered to register your tag parser. */
      console.error("unsupported tag: @" + tag);
    }
  };

  Documenter.prototype.parse = function parse(filename, source) {
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
      var parts = jfdoc.unindent(source, comment.range);
      parts = jfdoc.uncomment(parts);
      parts = parts.split(/^ *@/gm);

      /* The first part is the description. */
      var description = parts.shift().trim();
      /* The rest of the parts are tags. */

      /* This is the object that will be passed to a Mustache template. */
      var symbol = {
        source : {
          line : node.loc.start.line,
          code : jfdoc.unindent(source, node.range)
        },
        description : description,
        tags : []
      };

      parts.forEach(function (str) {
        this.parseTag(symbol, str);
      }, this);

      /* TODO: Find the correct node and infer anything left unspecified.
       * Allow ourselves to use hints from the tags. */

      /* Place this symbol correctly. */
      switch (symbol.kind) {
        case "file":
          symbol.filename = filename;
          this.symbols.files.push(symbol);
          break;
        default: console.error("unsupported kind: " + symbol.kind);
      };
    }, this);
  };

  Documenter.prototype.add = Documenter.prototype.parse;

}());

