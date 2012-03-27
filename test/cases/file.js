/**
 * Description for the file.
 *
 * @author John Smith
 */

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("file");

  q.test("placement", function () {
    var symbols = help.parse("file.js");

    q.expect(4);
    q.ok(symbols, "symbols");
    q.ok(Array.isArray(symbols.files), "files");
    q.strictEqual(symbols.files.length, 1, "number of files");
    q.ok(symbols.files[0] instanceof jfdoc.File, "is a file");
  });

  q.test("name", function () {
    var file = help.parse("file.js").files[0];

    q.expect(1);
    q.strictEqual(file.name, "file.js", "matches");
  });

  q.test("description", function () {
    var file = help.parse("file.js").files[0];

    q.expect(2);
    help.stringEqual(file.doclet.description,
      "Description for the file.");
  });

  q.test("author", function () {
    var file = help.parse("file.js").files[0];

    q.expect(2);
    help.stringEqual(file.doclet.author, "John Smith");
  });

}());

