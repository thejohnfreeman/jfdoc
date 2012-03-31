(function () {

  /* Namespace for tag parsers. */
  jfdoc.tags = {};

  /* Namespace for helpers for tag parsers. */
  jfdoc.tag = {};

  jfdoc.tag.setKindAndName = function setKindAndName(doclet, kind, name) {
    doclet.setKind(kind);
    if (name) {
      if (doclet.name.setName(name)) {
        console.error("parameter for @" + kind + " tag is not an identifier");
      }
    }
  };

}());

