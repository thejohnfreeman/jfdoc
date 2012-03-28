(function () {

  var File = function File(filename) {
    this.name = filename;
    this.decls = [];
    this.doclet = null;
  };

  File.prototype.setDoclet = function setDoclet(doclet) {
    if (this.doclet) {
      console.error("multiple doclets for file " + this.name);
    }
    this.doclet = doclet;
  };

  jfdoc.File = File;

}());

