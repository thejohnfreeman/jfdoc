(function () {

  var assert = require("assert");
  var markdown = require("markdown").markdown;

  var Doclet = function Doclet(description, isExplicit) {
    this.description = description;
    this.isExplicit = isExplicit;
    this.tags = {};
    this.kind = "unknown";
    /* This is how we know which decl deserves this doclet. */
    this.name = new jfdoc.Name();
  };

  Doclet.prototype.setTag = function setTag(name, value) {
    this.tags[name] = value;
  };

  Doclet.prototype.addTag = function addTag(name, value) {
    if (!this.tags[name]) this.tags[name] = [];
    this.tags[name].push(value);
  };

  Doclet.prototype.hasTags = function hasTags() {
    return Object.getOwnPropertyNames(this.tags).length;
  }

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

