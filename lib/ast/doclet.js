define(function (require) {

  var assert   = require("assert");

  var SourceLocation = require("./source-location");
  var Name           = require("./name");
  var unsource       = require("../scanner/unsource");
  
  var Doclet = function Doclet(description, isExplicit) {
    this.description = description || "";
    this.isExplicit  = isExplicit  || false;
    this.tags = {};
    this.kind = "unknown";
    this.loc = new SourceLocation();
    /* This is how we know which decl deserves this doclet. */
    this.name = new Name();
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
  };

  Doclet.prototype.setCode = function setCode(source, node) {
    assert.ok(node, "expected node");
    this.code = unsource.unindent(source, node.range)
  };

  /* Change a doclet's kind and check that no information is being lost. Lost
   * information is most likely an error on the part of the user: mixing tags
   * that do not mix. */
  Doclet.prototype.setKind = function setKind(kind) {
    this.kind = kind;
  };

  Doclet.prototype.toString = function toString() {
    return this.kind + " " + this.name.getQualifiedName();
  };

  return Doclet;

});

