define(function () {

  var exports = {};

  var toRelativePath = function toRelativePath(names) {
    return names.reduce(function (path, name) {
      return path + "/" + name;
    }, "");
  };

  exports.relativePathTo = function relativePathTo(decl) {
    var quals = decl.getQualifiers();
    /* Instance methods and properties are documented on the constructor page,
     * not on a namespace page for the prototype. */
    if (quals[quals.length - 1] === "prototype") quals.pop();
    var path = toRelativePath(quals);

    switch (decl.doclet.kind) {
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

  exports.hashTo = function hashTo(decl) {
    switch (decl.doclet.kind) {
      case "function": return decl.name;
      case "method": return "pt-" + decl.name;
      case "constructor": return "ctor-" + decl.name;
      default: console.error("no hash for " + kind);
    }
  };

  exports.pathTo = function pathTo(decl) {
    return this.docDir + this.relativePathTo(decl);
  };

  exports.pathToDirectory = function pathToDirectory(scope) {
    return this.docDir + toRelativePath(scope.getQualifiers()) +
      "/" + scope.name;
  };

  exports.urlTo = function urlTo(decl) {
    return this.baseUrl + this.relativePathTo(decl);
  };

  return exports;

});

