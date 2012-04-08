define(function (require) {

  var traverse = require("./traverse");

  var Commenter = function Commenter(comments) {
    this.comments = comments;
    this.idx      = 0;
  };

  var setOwnerIf = function setOwnerIf(self, node, list, isOwnedBy) {
    while (self.idx < self.comments.length) {
      var comment = self.comments[self.idx];
      /* A node may only own comments that occur before its end. */
      if (!isOwnedBy(comment, node)) return;

      if (!node[list]) node[list] = [];
      node[list].push(comment);
      ++self.idx;
    }
  };

  var isLeading = function isLeading(comment, node) {
    return comment.range[1] < node.range[0];
  };

  Commenter.prototype.visit = function visit(node) {
    /* Attach all the leading comments. */
    setOwnerIf(this, node, "leadingComments", isLeading);

    /* Stop traversing if we are out of comments. */
    if (this.idx >= this.comments.length) return traverse.TRAVERSAL_BREAK;

    /* Skip children if the next comment trails this node. */
    if (!isNotTrailing(this.comments[this.idx], node)) {
      return traverse.TRAVERSAL_SKIP;
    }
  };

  var isNotTrailing = function isNotTrailing(comment, node) {
    return comment.range[0] < node.range[1];
  };

  Commenter.prototype.leave = function leave(node) {
    /* There may be comments between the last child and the end of this node.
     * We cannot assume there is a child to own such comments, so the parent
     * will own them. */

    /* Attach all the trailing comments. */
    setOwnerIf(this, node, "trailingComments", isNotTrailing);
  };

  return Commenter;

});

