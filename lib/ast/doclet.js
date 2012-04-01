(function () {

  var assert = require("assert");
  var markdown = require("markdown").markdown;

  var Doclet = function Doclet(description) {
    this.description = description;
    this.tags = {};
    this.kind = "unknown";
    /* This is how we know which decl deserves this doclet. */
    this.name = new jfdoc.Name();
  };

  Doclet.prototype.inferFrom = function inferFrom(node) {
    if (node.type === "VariableDeclaration") {
      /* var name = ...
       * Assume the doclet applies to the first declarator. */
      var varDecl = node.declarations[0];
      assert.strictEqual(varDecl.id.type, "Identifier",
        "did not expect non-identifier for variable name");
      this.name.setName(varDecl.id.name);
      inferKindFrom(this, varDecl.init);
    } else if (node.type === "ExpressionStatement") {
      var expr = node.expression;
      if (expr.type === "AssignmentExpression") {
        /* name = ...
         * Try to pick a qualified name from the left-hand-side. */
        var qname = jfdoc.Name.fromNode(expr.left);
        if (qname) this.name.assign(qname);
        inferKindFrom(this, expr.right);
      }
    } else if (node.type === "Property") {
      if (node.key.type === "Identifier") {
        /* { name : ... }
         * Declaration in an object literal. */
        this.name.setName(node.key.name);
        inferKindFrom(this, node.value);
      }
    }
  };

  var inferKindFrom = function inferKindFrom(doclet, node) {
    if (node.type === "FunctionExpression") {
      doclet.kind = "function";
    } else if (node.type === "ObjectExpression") {
      doclet.kind = "namespace";
    }
  };

  Doclet.prototype.setTag = function setTag(name, value) {
    this.tags[name] = value;
  };

  Doclet.prototype.addTag = function addTag(name, value) {
    if (!this.tags[name]) this.tags[name] = [];
    this.tags[name].push(value);
  };

  Doclet.prototype.setLoc = function setLoc(filename, source, node) {
    assert.ok(node, "expected node");
    this.source = {
      file : filename,
      line : node.loc.start.line,
      code : jfdoc.Parser.unindent(source, node.range)
    };
  };

  Doclet.prototype.hasLoc = function hasLoc() {
    return this.source;
  };

  Doclet.prototype.getLoc = function getLoc() {
    return this.source.file + ":" + this.source.line;
  };

  Doclet.prototype.markdownify = function markdownify() {
    /* TODO: Resolve references. */
    this.markdown = markdown.toHTML(this.description);
  };

  /* Change a doclet's kind and check that no information is being lost. Lost
   * information is most likely an error on the part of the user: mixing tags
   * that do not mix. */
  Doclet.prototype.setKind = function setKind(kind) {
    this.kind = kind;
  };

  jfdoc.Doclet = Doclet;

}());

