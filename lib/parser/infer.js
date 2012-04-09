define(function (require) {

  var assert = require("assert");

  var nquery = require("../scanner/nquery");
  var Name   = require("../ast/name");

  /**
   * @returns {Node} The node from which to infer the declaration kind.
   */
  var inferName = function inferName(doclet, node) {
    var qname = doclet.name;

    /* If we are looking at a VariableDeclaration, then we really want to
     * document the first VariableDeclarator with the Declaration's leading
     * comment (or inference), unless the Declarator has its own comment.
     *
     * If we are inferring docs, then we need to beware documenting the
     * same Declarator twice: once when the Declaration is visited, and
     * again when the Declarator is visited. Remember to skip the
     * Declarator visit later if we use lookahead now. */
    if (node.type === "VariableDeclaration") {
      var first = node.declarations[0];
      if (!first.leadingComments) {
        node = first;
        node.skip = true;
      }
    }

    /* If we are looking at a Program, then we really want to document the
     * first statement if it exists. We do not need to check for another
     * leading comment because the Program node does not represent any token,
     * meaning this comment MUST appear directly before the first
     * statement. */
    if (node.type === "Program" && node.body.length) {
      node = node.body[0];
      node.skip = true;
    }

    doclet.node = node;

    if (node.type === "VariableDeclarator") {
      if (!qname.setName(nquery.getNameFromIdOf(node))) {
        qname.setLocal();
      }
      return node.init;

    } else if (node.type === "ExpressionStatement") {
      var expr = node.expression;
      if (expr.type !== "AssignmentExpression") return;
      if (!qname.set(nquery.getQualNameFromExpr(expr.left))) {
        qname.setGlobal();
      }
      return expr.right;

    } else if (node.type === "Property") {
      if (!qname.setName(nquery.getNameFromProperty(node.key))) {
        qname.setNested();
      }
      return node.value;
    }
  };

  var inferKind = function inferKind(doclet, node) {
    if (node.type === "FunctionExpression") {
      doclet.kind = "function";
    } else if (node.type === "ObjectExpression") {
      doclet.kind = "namespace";
    } else if (node.type === "Literal") {
      doclet.kind = "constant";
    } else if (node.type === "MemberExpression"
               || node.type === "Identifier")
    {
      var qname = nquery.getQualNameFromExpr(node);
      if (qname) {
        doclet.kind = "alias";
        doclet.setTag("alias", qname);
      }
    }
  };

  var infer = function infer(doclet, node) {
    if (node) node = inferName(doclet, node);
    if (node) inferKind(doclet, node);
  };

  return infer;

});

