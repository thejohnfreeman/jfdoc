define(function (require) {

  var assert   = require("assert");
  var traverse = require("./traverse");

  var visitDecl = function visitDecl(decl) {
    assert.ok(decl.doclet, "expected doclet");
    /* Decls that are mentioned but never documented, e.g. a class
     * prototype, will have no location information. */
    var loc = decl.doclet.loc;
    if (loc) loc.file.decls.push(decl);
  };

  var copyToFileVisitor = {
    visitDecl : visitDecl,
    visitScope : visitDecl
  };

  var copyDeclsToFiles = function copyDeclsToFiles(symtab) {
    traverse(symtab.globalScope, copyToFileVisitor);
  };

  return copyDeclsToFiles;

});

