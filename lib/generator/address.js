(function () {

  var Generator = jfdoc.Generator;

  var toRelativePath = function toRelativePath(names) {
    return names.reduce(function (path, name) {
      return path + "/" + name;
    }, "");
  };

  Generator.prototype.relativePathTo = function relativePathTo(decl) {
    var quals = decl.getQualifiers();
    /* Instance methods and properties are documented on the constructor page,
     * not on a namespace page for the prototype. */
    if (quals[quals.length - 1] === "prototype") quals.pop();
    var path = toRelativePath(quals);

    var kind = (decl.doclet ? decl.doclet.kind : "unknown");
    switch (kind) {
      case "function":
      case "method":
        path += ".html#" + this.hashTo(decl); break;

      case "namespace":
      case "constructor":
      default:
        path += "/" + decl.name + ".html";
    }

    return path;
  };

  Generator.prototype.hashTo = function hashTo(decl) {
    var kind = (decl.doclet ? decl.doclet.kind : "unknown");
    switch (kind) {
      case "function": return decl.name;
      case "method": return "pt-" + decl.name;
      case "constructor": return "ctor-" + decl.name;
      default: console.error("no hash for " + kind);
    }
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

