define(function (require) {

  var diag = require("../../diagnostic");

  var setKind = function setKind(doclet, kind, name) {
    doclet.setKind(kind);
    /* Name is optional; do not diagnose if it is missing. */
    if (name) {
      /* Diagnose if it is malformed. */
      diag.assert(!doclet.name.setName(name), doclet,
        "parameter for @" + kind + " is not an identifier");
      doclet.name.setGlobal();
    }
  };

  var kindTag = function kindTag(kind) {
    return function (doclet, options) {
      setKind(doclet, kind, options);
    };
  };

  return kindTag;

});

