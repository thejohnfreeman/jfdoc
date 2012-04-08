define(function (require) {

  var unsource = require("../scanner/unsource");

  var splitComment = function splitComment(comment) {
    var dt = {
      description : "",
      tags : []
    };

    if (!comment) return dt;

    /* Remove the comment wrapping from the text. */
    var text = unsource.unindent(this.source, comment.range);
    text = unsource.uncomment(text);

    /* Must strip leading asterisks so that we do not treat horizontal-rule
     * comments as descriptions. */
    text = text.replace(/^\*+/, "");
    if (text.trim() === "") return dt;

    var parts = text.split(/^ *@/gm);

    /* The first part is the description. */
    dt.description = parts.shift().trim();
    /* The rest of the parts are tags. */
    dt.tags = parts;

    return dt;
  };

  return splitComment;

});

