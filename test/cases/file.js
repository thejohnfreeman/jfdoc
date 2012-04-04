/**
 * Description for the file.
 *
 * @author John Smith
 */

(function () {

  var q = require("qunit");
  var help = require("../helpers");

  q.module("file", {
    setup : function () {
      this.files = help.parse("file.js").files;
      this.file = this.files[0];
    }
  });

  q.test("scope", function () {
    q.expect(2);
    q.strictEqual(this.files.length, 1, "number of files");
    q.ok(this.files[0] instanceof jfdoc.File, "is a file");
  });

  q.test("name", function () {
    q.expect(1);
    q.strictEqual(this.file.name, "file.js", "has file name");
  });

  q.test("description", function () {
    q.expect(2);
    help.stringEqual(this.file.doclet.description,
      "Description for the file.");
  });

  q.test("author", function () {
    q.expect(2);
    help.tagsEqual(this.file.doclet.tags["author"], "name", ["John Smith"]);
  });

}());

