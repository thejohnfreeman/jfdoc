define(function (require) {

  var markdown = require("markdown").markdown;
  var traverse = require("./traverse");

  var markdownifyDoclet = function markdownifyDoclet(doclet) {
    /* TODO: Resolve references. */
    doclet.markdown = markdown.toHTML(doclet.description);
  };

  var markdownifyVisitor = {
    visitDecl : function visitDecl(decl) {
      markdownifyDoclet(decl.doclet);
    },
    visitScope : function visitScope(scope) {
      this.visitDecl(scope);
      if (scope.docClass) markdownifyDoclet(scope.docClass);
    }
  };

  var markdownify = function markdownify(symtab) {
    /* TODO: Files. */
    traverse(symtab.globalScope, markdownifyVisitor);
  };

  return markdownify;

});

