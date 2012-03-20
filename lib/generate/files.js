(function () {

  var Documenter = jfdoc.Documenter;

  Documenter.prototype.generateFiles = function generateFiles() {
    this.instantiate("files", "files", { files : this.symbols.files });
  };

}());

