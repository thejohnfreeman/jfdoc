define(function (require) {

  var markdown = require("markdown").markdown;

  var markdownDoclet = function markdownDoclet(doclet) {
    /* TODO: Resolve references. */
    doclet.markdown = markdown.toHTML(doclet.description);
  };

  var markdownDecl = function markdownDecl(decl) {
    markdownDoclet(decl.doclet);
  };

  var markdownScope = function markdownScope(scope) {
    markdownDecl(scope);

    if (scope.classDoclet) markdownDoclet(scope.classDoclet);

    /* TODO: Descriminate between Decls and Scopes. */
    Object.keys(scope.decls).forEach(function (name) {
      markdownScope(scope.decls[name]);
    });
  };

  var markdownify = function markdownify(symtab) {
    /* TODO: Files. */
    markdownScope(symtab.globalScope);
  };

  return markdownify;

});

