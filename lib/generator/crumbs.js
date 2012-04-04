(function () {

  var Generator = jfdoc.Generator;

  Generator.prototype.buildCrumbs = function buildCrumbs(decl) {
    var crumbs = [];
    while (decl) {
      var href = this.urlTo(decl);
      if (href) crumbs.unshift({ href : href, name : decl.name });
      decl = decl.parent;
    }
    return crumbs;
  };

}());

