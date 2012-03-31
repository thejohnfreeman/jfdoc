(function () {

  var markdown = require("markdown").markdown;

  var Doclet = function Doclet(description, filename, source, node) {
    this.source = {
      file : filename,
      line : (node ? node.loc.start.line : 0),
      code : (node ? jfdoc.Parser.unindent(source, node.range) : "")
    };
    this.description = description;
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
    if (this.kind === kind) return;
    if (this.kind !== "unknown") {
      console.error("changing kind of doclet; information will be lost");
    }
    this.kind = kind;
  };

  jfdoc.Doclet = Doclet;

}());

