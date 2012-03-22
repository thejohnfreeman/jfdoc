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

    q.expect(3);
    q.ok(symbols, "symbols");
    q.ok(Array.isArray(symbols.files), "files");
    q.strictEqual(symbols.files.length, 1, "number of files");
  });

  q.test("name", function () {
    var symbols = help.parse("file.js");

    q.expect(1);
    q.strictEqual(symbols.files[0].name, "file.js", "matches");
  });

  q.test("description", function () {
    var symbols = help.parse("file.js");

    q.expect(2);
    help.stringEqual(symbols.files[0].doc.description,
      "Description for the file.");
  });

  q.test("author", function () {
    var symbols = help.parse("file.js");

    q.expect(2);
    help.stringEqual(symbols.files[0].doc.author, "John Smith");
  });

}());

