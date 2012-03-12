/**
 * An alternative to JSDoc.
 *
 * @file Entry point.
 * @author John Freeman
 */

(function () {

  process.stdin.setEncoding("utf8");

  var doc = new jsdoc.Context();

  process.stdin.on("data", function (source) {
    doc.add("<stdin>", source);
    doc.flush();
  });

  process.stdin.resume();

}());

