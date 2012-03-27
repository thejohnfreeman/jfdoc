(function () {

  var markdown = require("markdown").markdown;

  var Doclet = function Doclet(description, filename, source, node) {
    this.source = {
      file : filename,
      line : node.loc.start.line,
      code : jfdoc.Parser.unindent(source, node.range)
    };
    this.description = description; // String
    this.tags = [];
    this.kind = new jfdoc.Kind();
    /* This is how we know which decl deserves this doclet. */
    this.localName = "";
    this.scopeName = "";
  };

  /* Different from Decl.getQualName - this is what the user wrote, that is what
   * we found. */
  Doclet.prototype.getQualName = function getQualName() {
    return (this.scopeName ? (this.scopeName + ".") : "") + this.localName;
  };

  Doclet.prototype.setLocalName = function setLocalName(name) {
    this.localName = name;
  };

  Doclet.prototype.setScopeName = function setScopeName(name) {
    this.scopeName = name;
  };

  Doclet.prototype.getLoc = function getLoc() {
    return this.source.file + ":" + this.source.line;
  };

  Doclet.prototype.markdownify = function markdownify() {
    /* TODO: Resolve references. */
    this.markdown = markdown.toHTML(this.description);
  };

  /* The set*Kind methods will change a doclet's kind and check
   * that no information is being lost. Lost information is most likely an
   * error on the part of the user: mixing tags that do not go together. */

  /**
   * @returns {Boolean} True if the kind has already been set.
   */
  Doclet.prototype.setKind = function setKind(Kind) {
    if (typeof Kind === "string") Kind = jfdoc[Kind + "Kind"];
    Kind.initialize(this);
  };

  jfdoc.Doclet = Doclet;

}());

