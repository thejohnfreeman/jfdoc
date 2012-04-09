define(function (require) {

  var assert   = require("assert");
  var markdown = require("markdown").markdown;
  var traverse = require("./traverse");

  var markdownifyDoclet = function markdownifyDoclet(doclet) {
    /* TODO: Resolve references. */
    assert.ok(doclet, "expected doclet");
    try {
      doclet.markdown = markdown.toHTML(doclet.desc);
    } catch (e) {
      console.error("not markdown: " + doclet.desc);
      throw e;
    }
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

