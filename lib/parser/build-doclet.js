define(function (require) {

  var Doclet = require("../ast/doclet");
  var infer  = require("./infer");

  var buildDoclet = function buildDoclet(comment, node) {
    /* See the infer module for more information on skipping. */
    if (node && node.skip) return;

    /* Filter doc comments. */
    if (comment && (comment.type !== "Block" || comment.value[0] !== '*')) {
      comment = null;
    }

    /* User must enable inference when no doc comment present. */
    var isInferred = !comment;
    if (isInferred && !this.config.infer) return;

    var doclet = new Doclet();
    doclet.isExplicit = !isInferred;

    /* Try to infer node, name, and kind. */
    infer(doclet, node);

    /* If we must infer, but cannot, then skip. */
    if (isInferred &&
        (!doclet.name.getName() || doclet.kind === "unknown")) return;

    /* TODO: Handle nested names. For now, suppress diagnostics. */
    if (isInferred && doclet.name.isNested()) return;

    /* Inference finds the "real" target of the doclet, e.g., the first
     * Statement in a Program. The rest of our analysis, e.g., the source
     * code snippet, should work off of that target. */
    node = doclet.node;
    if (node) doclet.setCode(this.source, node.range);
    doclet.loc = this.loc;

    /* Try to get a description and list of tags. */
    var dt = this.splitComment(comment);
    doclet.desc = dt.description;
    dt.tags.forEach(function (tag) {
      this.parseTag(doclet, tag);
    }, this);

    /* Finish tags and branch on the kind. */
    this.finishDoclet(doclet);
  };

  return buildDoclet;

});
