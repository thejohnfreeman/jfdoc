(function () {

  var TreeIterator = function TreeIterator(root) {
    this.path = [];
    this.it = root;
    this.stepIn();
  };

  TreeIterator.prototype.get = function get() {
    return this.it;
  };

  /* This should return any child nodes that may contain declarations. */
  TreeIterator.prototype.childrenOf = function childrenOf(node) {
    switch (node.type) {
      /* Some sort of children. */
      case "Program": return node.body;
      case "ExpressionStatement": return [node.expression];
      case "CallExpression": return [node.callee];
      case "FunctionExpression": return [node.body];
      case "BlockStatement": return node.body;
      case "AssignmentExpression": return [node.right];
      case "VariableDeclaration": return node.declarations;
      case "SwitchStatement": return node.cases;

      /* No children. */
      case "VariableDeclarator":
      case "IfStatement": return [];

      /* Missing case. */
      default:
        console.error("unsupported node type: " + node.type);
        return [];
    }
  };

  TreeIterator.prototype.isLeaf = function isLeaf() {
    return this.childrenOf(this.it).length === 0;
  };

  TreeIterator.prototype.stepIn = function stepIn() {
    this.path.unshift({ idx : 0, nodes : this.childrenOf(this.it) });
    /* When moving to a new node, start at its first child. */
    this.it = this.path[0].nodes[0];
    /* Some children may be undefined for some reason. */
    if (!this.it) this.nextNonDescendant();
  };

  /* Return true if there is anything left to iterate. */
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

  /* Return true if there is at least one more child at the current level. */
  TreeIterator.prototype.hasNextSibling = function hasNextSibling() {
    var level = this.path[0];
    return level.idx < (level.nodes.length - 1);
  };

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

  TreeIterator.prototype.next = function next() {
    if (this.isLeaf()) {
      this.nextNonDescendant();
    } else {
      this.stepIn();
    }
  };

  var attachComments = function attachComments(root) {
    var it = new TreeIterator(root);

    var nodePrev = null;

    root.comments.forEach(function (comment) {

      /* We want the first node after spot. */
      var spot = comment.range[1];

      var node;
      while (node = it.get()) {
        if (node.range[0] > spot) {
          /* Found it! */
          break;
        }

        if (node.range[1] > spot) {
          /* It is in this subtree... */
          it.next();
        } else {
          /* We can skip the current subtree. */
          it.nextNonDescendant();
        }
      }

      if (node) {
        /*
        if (node === nodePrev) {
          console.log("two comments precede the same declaration at line " +
            node.loc.start.line + ": '" + node.comment.value.slice(0, 10) +
            "' and '" + comment.value.slice(0, 10) + "'");
        }
        */
        nodePrev = node;

        node.comment = comment;
        comment.subject = node;
      } else {
        console.warn("loose comment after " +
        (nodePrev
          ? (nodePrev.type + " (line " + nodePrev.loc.start.line + ") ")
          : "(nothing) ") +
        "will be lost: " + comment.value.slice(0, 10));
      }
    });

  };

  require("esprima").attachComments = attachComments;

}());
