(function () {

  var CommentIterator = function CommentIterator(it, comments) {
    this.it = it;
    this.comments = comments;
    this.commentsIdx = -1;
    this.next();
  };

  CommentIterator.prototype.getTreeIterator = function getTreeIterator() {
    return this.it;
  };

  CommentIterator.prototype.pastEnd = function pastEnd() {
    return this.commentsIdx >= this.comments.length;
  };

  CommentIterator.prototype.get = function get() {
    return this.comments[this.commentsIdx];
  };

  CommentIterator.prototype.next = function next() {
    ++this.commentsIdx;
    if (this.pastEnd()) return;
    var comment = this.comments[this.commentsIdx];

    var spot = comment.range[1];

    var node;
    while (node = this.it.get()) {
      if (node.range[0] > spot) {
        /* Found it! */
        break;
      }

      /* Skip the subtree if the node ends before the comment. */
      var skipSubtree = node.range[1] < spot;
      this.it.next(skipSubtree);
    }

    if (node) {
      if (!node.comments) node.comments = [];
      node.comments.push(comment);
      comment.subject = node;
    } else {
      console.warn("loose comment at end of file has no following node");
    }
  };

  require("esprima").CommentIterator = CommentIterator;

}());

