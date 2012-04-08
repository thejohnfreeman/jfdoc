define(function () {

  var TreeIterator = function TreeIterator(root) {
    this.path = [{ idx : 0, nodes : [root] }];
    this.it = root;
  };

  TreeIterator.prototype.get = function get() {
    return this.it;
  };

  TreeIterator.prototype.isValid = TreeIterator.prototype.get;

  /* This should return any child nodes that may contain declarations. */
  var childrenOf = function childrenOf(node) {
    switch (node.type) {
      /* Some sort of children. */
      case "Script": return [node.program];
      case "Program": return node.body;

      case "FunctionDeclaration": return [node.body];
      case "VariableDeclaration": return node.declarations;
      case "VariableDeclarator": return [node.init];

      case "ExpressionStatement": return [node.expression];
      case "BlockStatement": return node.body;
      case "SwitchStatement": return node.cases;
      /* Should not be any declarations in conditions. */
      case "IfStatement": return [node.consequent, node.alternate];
      case "ForStatement": return [node.body];
      case "WhileStatement": return [node.body];
      case "DoWhileStatement": return [node.body];
      /* TODO: Step into catch or finally clauses? */
      case "TryStatement": return node.block.body;
      case "ReturnStatement": return [node.argument];

      case "AssignmentExpression": return [node.right];
      case "FunctionExpression": return [node.body];
      case "CallExpression": return node["arguments"].concat(node.callee);
      case "ObjectExpression": return node.properties;

      case "Property": return [node.value];
      case "SwitchCase": return node.consequent;

      /* No children. */
      case "BreakStatement":
      case "EmptyStatement":

      case "MemberExpression":
      case "ArrayExpression":
      case "UnaryExpression":
      case "BinaryExpression":
      case "UpdateExpression":
      case "LogicalExpression":
      case "NewExpression":
      case "ThisExpression":

      case "Literal":
      case "Identifier":
        return [];

      default:
        console.error("missing case for children of " + node.type);
        return [];
    }
  };

  /**
   * @returns {Boolean} True if the current node has no children.
   */
  TreeIterator.prototype.isLeaf = function isLeaf() {
    return childrenOf(this.it).length === 0;
  };

  /**
   * Pushes children and moves to the first one.
   */
  TreeIterator.prototype.stepIn = function stepIn() {
    /* When moving into a node, start at its first child. */
    this.path.unshift({ idx : -1, nodes : childrenOf(this.it) });
    this.nextSibling();
    /* Some children may be null, or there may be no children. */
    if (!this.it) this.nextNonDescendant();
  };

  /**
   * Pops all siblings and moves to the parent.
   * @returns {Boolean}
   *   True if there is nothing left to iterate, i.e., if it just
   *   popped the root node.
   */
  TreeIterator.prototype.stepOut = function stepOut() {
    this.path.shift();
    var level = this.path[0];
    this.it = level.nodes[level.idx];
  };

  /**
   * @returns {Boolean}
   *   True if there is at least one more sibling to the current node.
   */
  TreeIterator.prototype.hasNextSibling = function hasNextSibling() {
    var level = this.path[0];
    return (level.idx + 1) < level.nodes.length;
  };

  TreeIterator.prototype.nextSibling = function nextSibling() {
    var level = this.path[0];
    ++level.idx;
    this.it = level.nodes[level.idx];
  };

  /**
   * Skips over the children of the current node and moves to the next node in
   * the depth-first iteration order.
   */
  TreeIterator.prototype.nextNonDescendant = function nextNonDescendant() {
    do {
      while (!this.hasNextSibling()) {
        /* Exit if we hit the end of the tree. Remember that we initialiazed
         * with a dummy list of children at path[0] that should never be
         * popped.  Checking here means every stepOut matches a stepIn. */
        if (this.path.length === 1) {
          /* Reached the end. */
          this.it = null;
          return;
        }

        this.stepOut();
      }

      this.nextSibling();
    } while (!this.it);
  };

  /**
   * Moves to the next node in the depth-first iteration order (which may be a
   * child).
   * @param skipSubtree {Boolean}
   *   Whether or not to skip over the current node's children.
   */
  TreeIterator.prototype.next = function next(skipSubtree) {
    if (skipSubtree) {
      this.nextNonDescendant();
    } else {
      this.stepIn();
    }
  };

  return TreeIterator;

});

