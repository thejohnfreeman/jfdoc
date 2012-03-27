/**
 * @author John Freeman
 */

(function () {

  /**
   * @name unindent
   * @memberOf jfdoc
   * @function
   * @param {String} source
   * @param {[Integer, Integer]} range
   */
  var unindent = function unindent(source, range) {
    /* Find the newline before the range. */
    var lineEndPrev = source.lastIndexOf("\n", range[0]);
    /* The characters between the newline and the range will contain the
     * indentation. */
    var indent = source.slice(lineEndPrev + 1, range[0]).match(/^ */)[0];
    /* Extract the section and remove indentation. */
    var snip = source.slice(range[0], range[1] + 1);
    var pattern = new RegExp("^" + indent, "gm");
    snip = snip.replace(pattern, "");
    return snip;
  };

  /**
   * @name uncomment
   * @memberOf jfdoc
   * @function
   * @param {String} comment Commented section of source code.
   */
  var uncomment = function uncomment(comment) {
    /* We know a JSDoc comment must be delimited with "/ * *" at the beginning
     * and "* /" at the end. */
    comment = comment.trim().slice(3, -2);
    /* We try to accomodate two different multi-line commenting styles: one
    * with leading asterisks and one without. We look at the first indented
    * line of a multi-line comment to determine the style: we consider any
    * spaces and up to one asterisk in the first three characters to be the
    * indentation for each line after the first. */
    var indent = comment.match(/\n *\*?/)[0];
    indent = indent.substring(1, 3);
    /* For each line, we remove a number of characters equal to the
     * indentation. People who use inconsistent indentation will be punished
     * here. This should remove the beginning delimiter for the comment as
     * well. */
    var pattern = new RegExp("^.{0," + indent.length + "}", "gm");
    comment = comment.replace(pattern, "");
    /* Remove the ending delimiter. */
    return comment;
  };

  jfdoc.Parser.unindent = unindent;
  jfdoc.Parser.uncomment = uncomment;

}());

