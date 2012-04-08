define(function (require) {

  var parseType = require("./type");

  /** "@returns" ["{" type "}"] [description...] */
  var returnsTag = function returnsTag(doclet, options) {
    var match = parseType(options);
    var type = match[0];
    var description = match[1];

    doclet.addTag("returns", {
      type : type,
      description : description
    });
  };

  return returnsTag;;

});

