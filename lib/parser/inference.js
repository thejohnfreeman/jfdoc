(function () {

  var Parser = jfdoc.Parser;

  /**
   * @returns {Node} The node from which to infer the declaration kind.
   */
  Parser.inferName = function inferName(qname, node) {
    var varDecl = Parser.getVarDecl(node);
    if (varDecl) {
      if (!qname.setName(Parser.getNameFromIdOf(varDecl))) {
        qname.setLocal();
      }
      return varDecl.init;
    } else if (node.type === "ExpressionStatement") {
      var expr = node.expression;
      if (expr.type !== "AssignmentExpression") return;
      if (!qname.set(Parser.getQualNameFromExpr(expr.left))) {
        qname.setGlobal();
      }
      return expr.right;
    } else if (node.type === "Property") {
      /* TODO: This will improperly remember the decl as a local variable. */
      if (!qname.setName(Parser.getNameFromProperty(node.key))) {
        qname.setNested();
      }
      return node.value;
    }
  };

  Parser.inferKind = function inferKind(node) {
    if (node.type === "FunctionExpression") return "function";
    if (node.type === "ObjectExpression")   return "namespace";
    if (node.type === "Literal")            return "constant";
  };

  Parser.inferNameAndKind = function inferNameAndKind(doclet, node) {
    node = Parser.inferName(doclet.name, node);
    if (!node) return;
    var kind = Parser.inferKind(node);
    if (kind) doclet.setKind(kind);
  };

}());

