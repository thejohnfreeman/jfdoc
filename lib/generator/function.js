define(function () {

  var buildFunctionContext = function buildFunctionContext(decl) {
    var doclet = decl.doclet;

    var context = {
      href        : this.urlTo(decl),
      hash        : this.hashTo(decl),
      name        : decl.name,
      params      : doclet.tags.param || [],
      description : doclet.markdown,
    };

    if (doclet.loc) {
      context.source = {
        file : doclet.loc.file.name,
        line : doclet.loc.line,
        code : doclet.code
      };
    }

    if (doclet.kind === "method") context.name = "." + context.name;
    if (doclet.kind === "constructor") {
      context.href += "#" + context.hash;
    }
    return context;
  };

  return buildFunctionContext;

});

