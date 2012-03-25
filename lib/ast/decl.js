(function () {

  var Decl = function Decl(filename, source, node, description) {
    this.source = {
      file : filename,
      line : node.loc.start.line,
      code : jfdoc.Parser.unindent(source, node.range)
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

  /* The set*Kind methods will change a decl's kind and check
   * that no information is being lost. Lost information is most likely an
   * error on the part of the user: mixing tags that do not go together. */
  Decl.prototype.setFunctionKind = function setFunctionKind() {
    if (this.kind === "function") return;
    if (this.kind !== undefined) {
      console.error("changing kind of declaration; information will be lost");
    }
    this.kind = "function";
    this.params = [];
  };

  jfdoc.Decl = Decl;

}());

