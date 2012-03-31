(function () {

  var Generator = jfdoc.Generator;

  var toRelativePath = function toRelativePath(names) {
    return names.reduce(function (path, name) {
      return path + "/" + name;
    }, "");
  };

  Generator.prototype.relativePathTo = function relativePathTo(decl) {
    var path = toRelativePath(decl.getQualifiers());

    var kind = (decl.doclet ? decl.doclet.kind : "unknown");
    switch (kind) {
      case "function": path += ".html#" + decl.name; break;
      case "method": path += ".html#pt-" + decl.name; break;

      case "namespace":
      case "class":
      default:
        path += "/" + decl.name + ".html";
    }

    return path;
  };

  Generator.prototype.pathTo = function pathTo(decl) {
    return this.docDir + this.relativePathTo(decl);
  };

  Generator.prototype.pathToDirectory = function pathToDirectory(scope) {
    return this.docDir + toRelativePath(scope.getQualifiers()) +
      "/" + scope.name;
  };

  Generator.prototype.urlTo = function urlTo(decl) {
    return this.baseUrl + this.relativePathTo(decl);
  };

}());

