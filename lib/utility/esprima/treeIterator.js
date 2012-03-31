(function () {

  var TreeIterator = function TreeIterator(root) {
    this.path = [];
    this.it = root;
    this.stepIn();
  };

  TreeIterator.prototype.get = function get() {
    return this.it;
  };

  TreeIterator.prototype.pastEnd = function pastEnd() {
    return !this.it;
  };

  /* This should return any child nodes that may contain declarations. */
  var childrenOf = function childrenOf(node) {
    switch (node.type) {
      /* Some sort of children. */
      case "Program": return node.body;

      case "VariableDeclaration": return node.declarations;
      case "VariableDeclarator": return [node.init];

      case "ExpressionStatement": return [node.expression];
      case "BlockStatement": return node.body;
      case "SwitchStatement": return node.cases;

      case "AssignmentExpression": return [node.right];
      case "FunctionExpression": return [node.body];
      case "CallExpression": return node["arguments"].concat(node.callee);
      case "ObjectExpression": return node.properties;

      case "Property": return [node.value];

      /* No children. */
      case "IfStatement": return [];

      /* Missing case. */
      default:
        console.error("unspecified children of node type: " + node.type);
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
    this.path.unshift({ idx : 0, nodes : childrenOf(this.it) });
    /* When moving to a new node, start at its first child. */
    this.it = this.path[0].nodes[0];
    /* Some children may be undefined for some reason. */
    if (!this.it) this.nextNonDescendant();
  };

  /**
   * Pops all siblings and moves to the parent.
   * @returns {Boolean}
   *   True if there is anything left to iterate, i.e., false if it just
   *   popped the root node.
   */
  TreeIterator.prototype.stepOut = function stepOut() {
    this.path.shift();

    if (this.path.length === 0) {
      /* Reached the end. */
      this.it = null;
      return false;
    }

    var level = this.path[0];
    this.it = level.nodes[level.idx];
    return true;
  };

  /**
   * @returns {Boolean}
   *   True if there is at least one more sibling to the current node.
   */
  TreeIterator.prototype.hasNextSibling = function hasNextSibling() {
    var level = this.path[0];
    return level.idx < (level.nodes.length - 1);
  };

  /**
   * Skips over the children of the current node and moves to the next node in
   * the depth-first iteration order.
   */
  TreeIterator.prototype.nextNonDescendant = function nextNonDescendant() {
    do {
      while (!this.hasNextSibling()) {
        if (!this.stepOut()) return;
      }

      var level = this.path[0];
      ++level.idx;
      this.it = level.nodes[level.idx];
    } while (!this.it);
  };

  /**
   * Moves to the next node in the depth-first iteration order (which may be a
   * child).
   * @param skipSubtree {Boolean}
   *   Whether or not to skip over the current node's children.
   */
  TreeIterator.prototype.next = function next(skipSubtree) {
    if (skipSubtree || this.isLeaf()) {
      this.nextNonDescendant();
    } else {
      this.stepIn();
    }
  };

  require("esprima").TreeIterator = TreeIterator;

}());

