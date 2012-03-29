(function () {

  jfdoc.SymbolTable = function SymbolTable() {
    this.files = [];
    this.globals = new jfdoc.Scope(null, "globals")
  };

}());

