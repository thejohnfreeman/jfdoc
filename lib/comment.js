/**
 * @file $$esprima.attachComments
 * @author John Freeman
 */

(function () {

  var TreeIterator = function TreeIterator(root) {
    this.path = [];
    this.it = root;
  };

  TreeIterator.prototype.get = function get() {
    return this.it;
  };

  TreeIterator.prototype.childrenOf = function childrenOf(node) {
    switch (node.type) {
      case "Program": return node.body;
      default:
        //error("unsupported node type");
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

  TreeIterator.prototype.nextSibling = function nextSibling() {
    while (!this.hasNextSibling()) {
      if (!this.stepOut()) return;
    }

    var level = this.path[0];
    ++level.idx;
    this.it = level.nodes[level.idx];
  };

  TreeIterator.prototype.next = function next() {
    if (this.isLeaf()) {
      this.nextSibling();
    } else {
      this.stepIn();
    }
  };

  var attachComments = function attachComments(root) {
    var it = new TreeIterator(root);

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
          it.nextSibling();
        }
      }

      if (node) {
        node.comment = comment;
        comment.subject = node;
      } else {
        //warning("loose comment at end of file");
      }
    });

  };

  require("esprima").attachComments = attachComments;

}());

