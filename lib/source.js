(function () {

  var unindent = function unindent(source, range) {
    /* Find the newline before the range. */
    var lineEndPrev = source.lastIndexOf("\n", range[0]);
    /* The characters between the newline and the range should be the
     * indentation. Normalize it. */
    /* TODO: Is that right? */
    var indent = source.slice(lineEndPrev + 1, range[0]);

    console.log("removing " + indent.length + " spaces of indentation");

    /* Extract the section and remove indentation. */
    return source.slice(range[0], range[1]).replace("\n" + indent, "\n");
  };

  jsdoc.unindent = unindent;

}());

