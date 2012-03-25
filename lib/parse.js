(function () {

  var fs = require("fs");
  var esprima = require("esprima");

  var Parser = function Parser(symbols, spacesPerTab) {
    this.symbols = symbols;
    this.spacesPerTab = spacesPerTab;
  };

  var File = function File(filename) {
    this.name = filename;
    this.decls = [];
    this.doc = {};
  };

  var Decl = function Decl(filename, source, node, description) {
    this.source = {
      file : filename,
      line : node.loc.start.line,
      code : jfdoc.unindent(source, node.range)
    };
    this.description = description; // String
    this.tags = [];
    this.baseName = "";             // String
    this.scopeQuals = [];           // Array<String>
    this.decls = {};                // String -> Decl
  };

  Decl.prototype.setQualName = function setQualName(qualName) {
    if (typeof qualName === "string") {
      qualName = qualName.split(".");
    }
    if (qualName.length > 1) this.scopeQuals = qualName.slice(0, -1);
    this.baseName = qualName[qualName.length - 1];
  };

  Parser.prototype.parse = function parse(filename, source) {
    console.log("Parsing " + filename + "...");

    /* Start the file information. */
    this.symbols.files.unshift(new File(filename));

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

      var decl = new Decl(filename, source, node, description);

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

  /* Place a declaration into the table. */
  Parser.prototype.addDecl = function addDecl(decl) {
    switch (decl.kind) {
      case "file":
        this.symbols.files[0].doc = decl;
        break;

      case "function":
        /* The parameter list was built in reverse order. */
        decl.params.reverse();
        /* Fall-through intended. */
      case "namespace":
      case "class":
        var scope = this.symbols.globals;
        decl.scopeQuals.forEach(function (qual) {
          scope = this.enterScope(scope, qual);
        }, this);
        this.pushScope(scope, decl);

        this.symbols.files[0].decls.push(decl);
        break;

      default: console.error("unsupported kind: " + decl.kind);
    };
  };

  /* Retrieve the inner scope from inside the outer scope. */
  Parser.prototype.enterScope = function enterScope(outer, inner) {
    return outer.decls[inner];
  };

  Parser.prototype.pushScope = function pushScope(outer, decl) {
    outer.decls[decl.baseName] = decl;
  };

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.add = function add(filename, source) {
    if (!source) source = fs.readFileSync(filename, "utf8");
    var parser = new Parser(this.symbols, this.spacesPerTab);
    parser.parse(filename, source);
  };

}());

