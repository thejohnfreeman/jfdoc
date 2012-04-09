define(function (require) {

  var assert   = require("assert");

  var Name           = require("./name");
  var SourceLocation = require("./source-location");
  var unsource       = require("../scanner/unsource");
  
  var Doclet = function Doclet(qname, kind) {
    /* The name identifies the owning decl. */
    this.name       = qname || new Name();
    this.kind       = kind || "unknown";
    this.isExplicit = false;

    this.node       = null;
    this.loc        = new SourceLocation();
    this.code       = "";

    this.desc       = "";
    this.tags       = {};
  };

  Doclet.prototype.setTag = function setTag(name, value) {
    this.tags[name] = value;
  };

  Doclet.prototype.addTag = function addTag(name, value) {
    if (!this.tags[name]) this.tags[name] = [];
    this.tags[name].push(value);
  };

  Doclet.prototype.setCode = function setCode(source, range) {
    this.code = unsource.unindent(source, range);
  };

  Doclet.prototype.toString = function toString() {
    return this.kind + " " + this.name.getQualifiedName();
  };

  Doclet.merge = function merge(before, after) {
    if (!after) return before;
    /* An implicit doclet will only ever write over a default-initialized
     * doclet. */
    if (before && before.isExplicit) {
      console.warn(after.loc + ": warning: " + after +
        " documented more than once; some information will be lost");
      console.warn(before.loc + " note: dropping documentation from here");
    }
    return after;
  };

  return Doclet;

});

