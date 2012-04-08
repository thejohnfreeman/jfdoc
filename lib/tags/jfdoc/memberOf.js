define(function (require) {

  var diag = require("../../diagnostic");

  var memberOfTag = function memberOfTag(doclet, options) {
    diag.assert(!doclet.name.setQualifier(options), doclet,
      "parameter for @memberOf is not an identifier or member expression");
    doclet.name.setGlobal();
  };

  return memberOfTag;

});

