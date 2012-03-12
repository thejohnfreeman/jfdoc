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
    var symbols = doc.parse("<stdin>", source);
    doc.compile(symbols);
  });

  doc.setup();
  process.stdin.resume();

}());

