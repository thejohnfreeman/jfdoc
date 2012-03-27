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
    this.kind = "unknown";
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

  //Decl.prototype.setQualName = function setQualName(qualName) {
    //if (typeof qualName === "string") {
      //qualName = qualName.split(".");
    //}
    //if (qualName.length > 1) this.scopeQuals = qualName.slice(0, -1);
    //this.baseName = qualName[qualName.length - 1];
  //};

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
  Doclet.prototype.setKind = function setKind(kind) {
    if (this.kind === kind) return true;
    if (this.kind !== "unknown") {
      console.error("changing kind of declaration; information will be lost");
    }
    this.kind = kind;
    return false;
  };

  Doclet.prototype.setClassKind = function setClassKind() {
    this.setKind("class");
  };

  Doclet.prototype.setFunctionKind = function setFunctionKind() {
    if (this.setKind("function")) return;
    this.params = [];
  };

  Doclet.prototype.setFileKind = function setFileKind() {
    this.setKind("file");
  };

  Doclet.prototype.setNamespaceKind = function setNamespaceKind() {
    this.setKind("namespace");
  };

  jfdoc.Doclet = Doclet;

}());

