/**
 * nquery stands for "node query". This module exports helpers for querying
 * information from Esprima nodes. */
define(function (require) {

  var assert = require("assert");

  var Name = require("../ast/name");

  var exports = {};

  exports.getNameFromIdOf = function getNameFromIdOf(node) {
    if (!(node.type === "VariableDeclarator"
          || node.type === "FunctionExpression"
          || node.type === "FunctionDeclaration"))
    {
      return;
    }

    node = node.id;
    if (node && node.type === "Identifier") return node.name;
  };

  exports.getNameFromProperty = function getNameFromProperty(node) {
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
  exports.getQualNameFromExpr = function getQualNameFromExpr(node) {
    if (node.type === "Identifier") {
      /* Base case. */
      return new Name(node.name);
    } else if (node.type === "MemberExpression") {
      /* Recurse. */
      var name = exports.getNameFromProperty(node.property);
      if (!name) return;
      var qual = exports.getQualNameFromExpr(node["object"]);
      if (qual) return new Name(name, qual.getPath());
    }
  };

  return exports;

});

