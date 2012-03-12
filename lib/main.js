/**
 * @file Entry point.
 * @author John Freeman
 */

(function () {

  var esprima = require("esprima");

  var parse = function parse(filename, source) {
    /* Normalize the indentation. */
    /* TODO: Make this configurable. */
    source = source.replace("\t", "  ");

    /* Parse and attach comments to following nodes. */
    var root = esprima.parse(source,
      { comment : true, range : true, loc : true });
    esprima.attachComments(root);

    var symbols = [];

    root.comments.forEach(function (comment) {
      /* Filter JSDoc comments. */
      if (comment.type !== "Block" || comment.value[0] !== '*') return;

      /* TODO: Parse comment for description and tags. */
      /* TODO: Pass descriptions through Markdown. */
      /* TODO: Find the symbol. */

      var node = comment.subject;
      symbols.push({
        node : node,
        comment : comment.value,
        source : jsdoc.unindent(source, node.range)
      });

    });

    return symbols;
  };

  process.stdin.setEncoding("utf8");

  process.stdin.on("data", function (source) {
    var symbols = parse("<stdin>", source);
    symbols.forEach(function (symbol) {
      /* TODO: Resolve references in descriptions. */
      var str = symbol.comment + "\napplies to " + symbol.node.type +
        " node at line " + symbol.node.loc.start.line + ":\n\n" +
        symbol.source + "\n";
      console.log(str);
    });
  });

  process.stdin.resume();

}());

