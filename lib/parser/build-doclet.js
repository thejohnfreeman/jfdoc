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
    var inferred = !comment;
    if (inferred && !this.config.infer) return;

    /* Try to infer name and kind. */
    var nk = infer(node);
    var qname = nk.name;
    var kind = nk.kind;

    /* If we must infer, but cannot, then skip. */
    if (inferred && (!qname.getName() || kind === "unknown")) return;

    /* TODO: Handle nested names. For now, suppress diagnostics. */
    if (inferred && qname.isNested()) return;

    /* Try to get a description and list of tags. */
    var dt = this.splitComment(comment);
    var description = dt.description;
    var tags = dt.tags;

    var doclet = new Doclet(description, /*isExplicit=*/!inferred);
    doclet.loc.copy(this.loc);
    //if (node) doclet.setCode(this.source, node);
    doclet.name.set(qname);
    doclet.setKind(kind);

    tags.forEach(function (tag) {
      this.parseTag(doclet, tag);
    }, this);

    /* Finish tags and branch on the kind. */
    this.finishDoclet(doclet);
  };

  return buildDoclet;

});
