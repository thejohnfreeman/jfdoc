(function () {

  jfdoc.SymbolTable = function SymbolTable() {
    this.files = [];
    this.globals = new jfdoc.Scope("globals", null, "The global namespace.");
  };

}());

