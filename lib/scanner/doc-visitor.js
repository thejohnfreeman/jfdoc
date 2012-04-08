define(function (require) {

  var DocVisitor = function (callback) {
    this.callback = callback;
  };

  DocVisitor.prototype.visit = function visit(node) {
    if (node.leadingComments) {
      var leads = node.leadingComments;

      /* Each leading comment but the last is a headless doc. */
      leads.slice(0, -1).forEach(function (comment) {
        //console.log("documenting headless leading comment");
        this.callback(comment, null);
      }, this);

      /* The last leading comment documents the node. */
      //console.log("documenting with explicit comment: " + node.type);
      this.callback(leads[leads.length - 1], node);

    } else {
      //console.log("documenting with inference: " + node.type);
      this.callback(null, node);
    }

    if (node.trailingComments) {
      /* Every trailing comment is a headless doc. Order should not matter. */
      node.trailingComments.forEach(function (comment) {
        //console.log("documenting headless trailing comment");
        this.callback(comment, null);
      }, this);
    }
  };

  return DocVisitor;

});

