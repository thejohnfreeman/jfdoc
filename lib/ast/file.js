define(function () {

  var File = function File(filename) {
    this.name   = filename;
    this.decls  = [];
    this.doclet = null;
  };

  File.prototype.toString = function toString() {
    return this.name;
  };

  return File;

});

