(function () {

  jfdoc.SymbolTable = function SymbolTable() {
    this.files = [];
    this.globals = new jfdoc.Scope("window", null, "The global namespace.");
  };

}());

