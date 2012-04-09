define(function (require) {

  var assert = require("assert");

  /* This is a value class. They should never be changed after creation. */
  /* TODO: Look into configuring as unwritable/no setters/whatever. */
  var SourceLocation = function SourceLocation(file, line) {
    this.file = file;
    this.line = line;
  };

  SourceLocation.prototype.toString = function toString() {
    assert.ok(this.file, "unknown location");
    return this.file + ":" + this.line;
  };

  return SourceLocation;

});

