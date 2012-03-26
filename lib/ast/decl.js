(function () {

  var Decl = function Decl(description, filename, source, node) {
    if (filename) {
      this.source = {
        file : filename,
        line : node.loc.start.line,
        code : jfdoc.Parser.unindent(source, node.range)
      };
    }
    this.description = description; // String
    this.tags = [];
    this.baseName = "";             // String
    this.scopeQuals = [];           // Array<String>
    this.decls = {};                // String -> Decl
  };

  Decl.prototype.getLoc = function getLoc() {
    return this.source.file + ":" + this.source.line;
  };

  Decl.prototype.getQualName = function getQualName() {
    return this.scopeQuals.join(".") + "." + this.baseName;
  };

  Decl.prototype.setQualName = function setQualName(qualName) {
    if (typeof qualName === "string") {
      qualName = qualName.split(".");
    }
    if (qualName.length > 1) this.scopeQuals = qualName.slice(0, -1);
    this.baseName = qualName[qualName.length - 1];
  };

  /* The set*Kind methods will change a decl's kind and check
   * that no information is being lost. Lost information is most likely an
   * error on the part of the user: mixing tags that do not go together. */

  /**
   * @returns {Boolean} True if the kind has already been set.
   */
  Decl.prototype.setKind = function setKind(kind) {
    if (this.kind === kind) return true;
    if (this.kind !== undefined) {
      console.error("changing kind of declaration; information will be lost");
    }
    this.kind = kind;
    return false;
  };

  Decl.prototype.setClassKind = function setClassKind() {
    this.setKind("class");
  };

  Decl.prototype.setFunctionKind = function setFunctionKind() {
    if (this.setKind("function")) return;
    this.params = [];
  };

  Decl.prototype.setFileKind = function setFileKind() {
    this.setKind("file");
  };

  Decl.prototype.setNamespaceKind = function setNamespaceKind() {
    this.setKind("namespace");
  };

  jfdoc.Decl = Decl;

}());

