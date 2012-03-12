/**
 * @file Entry point.
 * @author John Freeman
 */
(function () {

  var util = require("util");
  var assert = require("assert");

  var esprima = require("esprima");

  process.stdin.setEncoding("utf8");

  process.stdin.on("data", function (source) {
    var root = esprima.parse(source,
      { comment : true, range : true, loc : true });
    esprima.attachComments(root);

    root.comments.forEach(function (comment) {
      var node = comment.subject;
      var str = "\nthe comment beginning '" + comment.value.slice(0, 10) +
        "' applies to " + node.type + " node at line " + node.loc.start.line +
        ":\n" + source.slice(node.range[0], node.range[1]) + "\n";
      var lineEndPrev = source.lastIndexOf("\n", node.range[0]);
      var indent = source.slice(lineEndPrev + 1, node.range[0]);
      indent = indent.replace("\t", "  ");
      console.log(str);
      console.log("The above source was indented " + indent.length + " spaces\n");
    });
  });

  process.stdin.resume();

}());

