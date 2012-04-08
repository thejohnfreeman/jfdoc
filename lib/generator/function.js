define(function () {

  var buildFunctionContext = function buildFunctionContext(decl) {
    var context = {
      href        : this.urlTo(decl),
      hash        : this.hashTo(decl),
      name        : decl.name,
      params      : decl.doclet.tags.param || [],
      description : decl.doclet.markdown,
      source      : decl.doclet.source
    };
    if (decl.doclet.kind === "method") context.name = "." + context.name;
    if (decl.doclet.kind === "constructor") {
      context.href += "#" + context.hash;
    }
    return context;
  };

  return buildFunctionContext;

});

