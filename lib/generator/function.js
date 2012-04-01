(function () {

  jfdoc.Generator.prototype.buildFunctionContext
    = function buildFunctionContext(decl)
  {
    return {
      href        : this.urlTo(decl),
      hash        : this.hashTo(decl),
      name        : decl.name,
      params      : decl.doclet.tags.param || [],
      description : decl.doclet.markdown,
      source      : decl.doclet.source
    };
  };

}());
