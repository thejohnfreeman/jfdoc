/**
 * @file Entry point.
 * @author John Freeman
 */
(function () {

  var esprima = require("esprima");

  process.stdin.setEncoding("utf8");

  var extractUnindentedSource
    = function extractUnindentedSource(source, range)
  {
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

  process.stdin.on("data", function (source) {
    /* Normalize the indentation. */
    /* TODO: Make this configurable. */
    source = source.replace("\t", "  ");

    var root = esprima.parse(source,
      { comment : true, range : true, loc : true });
    esprima.attachComments(root);

    root.comments.forEach(function (comment) {
      /* Skip non-JSDoc style comments. */
      if (comment.type !== "Block" || comment.value[0] !== '*') return;

      var node = comment.subject;
      var section = extractUnindentedSource(source, node.range);
      var str = comment.value +
        "\n\napplies to " + node.type + " node at line " + node.loc.start.line +
        ":\n\n" + section + "\n";
      console.log(str);
    });
  });

  process.stdin.resume();

}());

