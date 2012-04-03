(function () {

  var Parser = jfdoc.Parser;

  /**
   * @returns {Node} The node from which to infer the declaration kind.
   */
  Parser.inferName = function inferName(doclet, node) {
    var varDecl = Parser.getVarDecl(node);
    if (varDecl) {
      doclet.name.setName(Parser.getNameFromIdOf(varDecl));
      return varDecl.init;
    } else if (node.type === "ExpressionStatement") {
      var expr = node.expression;
      if (expr.type !== "AssignmentExpression") return;
      var qname = Parser.getQualNameFromExpr(expr.left);
      if (qname) {
        doclet.name.set(qname);
        doclet.isGlobal = !qname.isQualified();
      }
      return expr.right;
    } else if (node.type === "Property") {
      /* TODO: This will improperly remember the decl as a local variable. */
      doclet.name.setName(Parser.getNameFromProperty(node.key));
      return node.value;
    }
  };

  Parser.inferKind = function inferKind(node) {
    if (node.type === "FunctionExpression") return "function";
    if (node.type === "ObjectExpression")   return "namespace";
    if (node.type === "Literal")            return "constant";
  };

  Parser.inferNameAndKind = function inferNameAndKind(doclet, node) {
    node = Parser.inferName(doclet, node);
    if (!node) return;
    var kind = Parser.inferKind(node);
    if (kind) doclet.setKind(kind);
  };

}());

