define(function (require) {

  var assert = require("assert");

  var SourceLocation = function SourceLocation(file, line) {
    this.set(file, line);
  };

  SourceLocation.prototype.copy = function copy(loc) {
    this.file = loc.file;
    this.line = loc.line;
  };

  SourceLocation.prototype.set = function set(file, line) {
    this.file = file;
    this.line = line;
  };

  SourceLocation.prototype.setLine = function setLine(line) {
    this.line = line;
  };

  SourceLocation.prototype.toString = function toString() {
    assert.ok(this.file, "unknown location");
    return this.file + ":" + this.line;
  };

  return SourceLocation;

});

