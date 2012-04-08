define(function (require) {

  var diag = require("../diagnostic");
  var tags = require("../tags/jfdoc/all");

  var parseTag = function parseTag(doclet, str) {
    var match = str.trim().match(/(\w+) *([\s\S]*)/);
    if (!match) {
      diag.error(doclet, "could not parse tag name: " + str);
      return;
    }
    /* The tag is the first word. */
    var tag = match[1];
    /* Everything after the tag can only be comprehended by the tag parser. */
    var options = match[2].trim();
    /* Call the named tag parser if it exists. */
    if (tags.hasOwnProperty(tag)) {
      var tagp = tags[tag];
      tagp(doclet, options);
    } else {
      doclet.addTag(tag, { options : options });
      /* Make sure you remembered to register your tag parser. */
      diag.warn(doclet, "default tag handler: @" + tag);
    }
  };

  return parseTag;

});

