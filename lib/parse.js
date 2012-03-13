(function () {

  var esprima = require("esprima");

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.parseTag = function parseTag(symbol, str) {
    var m = str.trim().match(/(\w+) *(.*)/);
    if (!m) {
      console.error("could not parse tag name: " + str.slice(0, 10));
      return;
    }
    /* The tag is the first word. */
    var tag = m[1];
    /* Everything after the tag can only be comprehended by the tag parser. */
    var options = m[2];
    /* Document the tag in the symbol. */
    symbol.tags.push({ tag : tag, options : options });
    /* Call the named tag parser if it exists. */
    var parser = this.tagParsers[tag];
    if (parser) {
      parser(this.tagParsers, symbol, options);
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
        tags : [],
        name : "",
        qualifiers : []
      };

      parts.forEach(function (str) {
        this.parseTag(symbol, str);
      }, this);

      /* TODO: Find the correct node and infer anything left unspecified.
       * Allow ourselves to use hints from the tags. */

      this.addSymbol(filename, symbol);
    }, this);
  };

  /* Place a symbol into the table. */
  Documenter.prototype.addSymbol = function addSymbol(filename, symbol) {
    switch (symbol.kind) {
      case "file":
        symbol.filename = filename;
        this.symbols.files.push(symbol);
        break;

      case "namespace":
        var qualifiers = symbol.qualifiers;
        var name = symbol.name;
        var scope = this.symbols.globals;
        qualifiers.forEach(function (qualifier) {
          scope = this.pushScope(scope, qualifier);
        });
        this.pushScope(scope, name, symbol);
        break;

      default: console.error("unsupported kind: " + symbol.kind);
    };
  };

  /* Retrieve the inner scope from inside the outer scope. If it does not yet
   * exist, create it using the given symbol as its representative. There is an
   * error if a symbol is given but the scope already exists. */
  Documenter.prototype.pushScope = function pushScope(outer, inner, symbol) {
    if (inner in outer) {
      if (symbol) {
        console.error("scope " + inner + " already exists in " + outer);
      }
      return outer[inner];
    }
    /* Users may not document any entity named "__symbol". */
    return outer[inner] = { __symbol : symbol };
  };

  Documenter.prototype.add = Documenter.prototype.parse;

}());

