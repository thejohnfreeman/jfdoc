(function () {

  var esprima = require("esprima");

  var Parser = function Parser(symbols, spacesPerTab) {
    this.symbols = symbols;
    this.spacesPerTab = spacesPerTab;
  };

  Parser.prototype.parseTag = function parseTag(symbol, str) {
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
    var tagp = jfdoc.tags[tag];
    if (tagp) {
      tagp(this, symbol, options);
    } else {
      /* Make sure you remembered to register your tag parser. */
      console.error("unsupported tag: @" + tag);
    }
  };

  Parser.prototype.parse = function parse(filename, source) {
    this.filename = filename;

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

      this.addSymbol(symbol);
    }, this);
  };

  /* Place a symbol into the table. */
  Parser.prototype.addSymbol = function addSymbol(symbol) {
    switch (symbol.kind) {
      case "file":
        symbol.filename = this.filename;
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
  Parser.prototype.pushScope = function pushScope(outer, inner, symbol) {
    if (inner in outer) {
      if (symbol) {
        console.error("scope " + inner + " already exists in " + outer);
      }
      return outer[inner];
    }

    /* Users may not document any entity named "__symbol". */
    var scope = outer[inner] = {};
    if (symbol) scope.__symbol = symbol;
    return scope;
  };

  /* The actions below are meant to be shared among tag parsers. Checking should
   * be moved here when possible. */
  Parser.prototype.setName = function setName(symbol, path) {
    if (path.length > 1) symbol.qualifiers = path.slice(0, -1);
    symbol.name = path[path.length - 1];
  };

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.add = function add(filename, source) {
    var parser = new Parser(this.symbols, this.spacesPerTab);
    parser.parse(filename, source);
  };

}());

