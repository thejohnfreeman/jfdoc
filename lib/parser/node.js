(function () {

  var assert = require("assert");

  var Name = jfdoc.Name;
  var Parser = jfdoc.Parser;

  Parser.getNameFromIdOf = function getNameFromIdOf(node) {
    assert.ok(node.type === "VariableDeclarator"
      || node.type === "FunctionExpression"
      || node.type === "FunctionDeclaration",
      "expected variable or function");
    node = node.id;
    if (node && node.type === "Identifier") return node.name;
  };

  Parser.getVarDecl = function getVarDecl(node) {
    if (!node) return;
    if (node.type === "VariableDeclaration") {
      /* Assume the doclet applies to the first declarator. */
      node = node.declarations[0];
    }
    if (node.type !== "VariableDeclarator") return;
    return node;
  };

  Parser.getNameFromVarDecl = function getNameFromVarDecl(node) {
    var varDecl = Parser.getVarDecl(node);
    if (varDecl) return Parser.getNameFromIdOf(varDecl);
  };

  Parser.getNameFromProperty = function getNameFromProperty(node) {
    if (node.type === "Identifier") {
      return node.name;
    }
    if (node.type === "Literal" && typeof node.value === "string") {
      return node.value;
    }
  };

  /**
   * Tries to deduce the name that the node represents.
   * @param node {Node}
   * @returns {Name} If successful.
   * @returns {undefined} If no name could be deduced.
   */
  Parser.getQualNameFromExpr = function getQualNameFromExpr(node) {
    if (node.type === "Identifier") {
      /* Base case. */
      return new Name(node.name);
    } else if (node.type === "MemberExpression") {
      /* Recurse. */
      var name = Parser.getNameFromProperty(node.property);
      if (!name) return;
      var qual = Parser.getQualNameFromExpr(node["object"]);
      if (qual) return new Name(name, qual.getPath());
    }
  };

}());

