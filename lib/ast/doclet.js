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
    this.source = new SourceLocation();
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

  Doclet.prototype.setLoc = function setLoc(loc, range, source) {
    this.source.copy(loc);
    if (range) this.source.code = unsource.unindent(source, range);
  };

  Doclet.prototype.getLoc = function getLoc() {
    return this.source;
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

