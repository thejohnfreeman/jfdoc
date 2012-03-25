(function () {

  var File = function File(filename) {
    this.name = filename;
    this.decls = [];
    this.doc = {};
  };

  jfdoc.File = File;

}());

