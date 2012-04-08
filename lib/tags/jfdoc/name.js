define(function (require) {

  var diag = require("../../diagnostic");

  var nameTag = function nameTag(doclet, options) {
    diag.assert(!doclet.name.setName(options), doclet,
      "parameter for @name is not an identifier");
    doclet.name.setGlobal();
  };

  return nameTag;

});

