(function () {

  var util = require("util");

  var fs = require("fs");
  var esprima = require("esprima");
  var markdown = require("markdown");
  /* Cannot use mustache.js because it does not preserve empty lines. Hogan
   * also lets us pre-compile templates. */
  var hogan = require("hogan");

  var Context = function Context() {
    this.docDir = "doc";
    this.tmplDir = "templates";
    this.spacesPerTab = 2;
    this.tagParsers = {};
    this.templates = {};

    this.files = [];

    /* Object.extend would be nice. */
    ["file", "author"].forEach(function (tag) {
      this.tagParsers[tag] = jsdoc.tags[tag];
    }, this);

    this.compileTemplates();
  };

  /* The templates directory should contain these templates:
   *   - file.mustache
   *   - namespace.mustache
   *   - class.mustache
   * Any addtional templates present will be available as partials.
   */
  Context.prototype.compileTemplates = function compileTemplates() {
    var filenames = fs.readdirSync(this.tmplDir);

    filenames.forEach(function (filename) {
      var kindMatch = filename.match(/^(\w*)\.mustache$/);
      if (!kindMatch) {
        console.warn("unhandled template file: " + filename);
        return;
      }
      var kind = kindMatch[1];

      var file = fs.readFileSync(this.tmplDir + "/" + filename, "utf8");
      var template = hogan.compile(file);
      this.templates[kind] = template;
    }, this);

    ["file", "namespace", "class"].forEach(function (kind) {
      if (!(kind in this.templates)) {
        console.error("missing template file: " +
          this.tmplDir + "/" + kind + ".mustache");
      }
    }, this);
  };

  Context.prototype.parseTag = function parseTag(symbol, str) {
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
      console.error("unsupported tag: @" + tag);
    }
  };

  Context.prototype.parse = function parse(filename, source) {
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
        source : {
          line : node.loc.start.line,
          code : jsdoc.unindent(source, node.range)
        },
        description : description,
        tags : []
      };

      parts.forEach(function (str) {
        this.parseTag(symbol, str);
      }, this);

      /* TODO: Find the correct node and infer anything left unspecified. Allow
       * ourselves to use hints from the tags. */

      /* Place this symbol correctly. */
      switch (symbol.kind) {
        case "file":
          if (filename in this.files) {
            /* TODO: File information for errors? Line information may be
             * impractical since esprima does not track lines for comments. */
            console.error("only one @file tag allowed per file");
          } else {
            symbol.filename = filename;
            this.files[filename] = symbol;
          }
          break;

        default: console.error("unsupported kind: " + symbol.kind);
      };
    }, this);
  };

  /* Compile markdown for all descriptions. */
  Context.prototype.markdownify = function markdownify(obj) {
    if (!(typeof obj === "object" && obj)) return;

    if ("description" in obj) {
      /* TODO: Resolve references. */
      obj.description = markdown.markdown.toHTML(obj.description);
    }

    Object.keys(obj).forEach(function (key) {
      this.markdownify(obj[key]);
    }, this);
  };

  Context.prototype.instantiate
    = function instantiate(fileBasePath, tmplName, data)
  {
    /* This must wait until after the symbol table is finished. */
    this.markdownify(data);

    var filename = this.docDir + "/" + fileBasePath + ".html";
    console.log("writing " + filename);

    var template = this.templates[tmplName];
    var page = template.render(data, this.templates);
    fs.writeFileSync(filename, page);
  };

  Context.prototype.compile = function compile() {
    var fileList = Object.keys(this.files).map(function (filename) {
      return this.files[filename];
    }, this);
    util.inspect(fileList);
    this.instantiate("files", "files", { files : fileList });
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

