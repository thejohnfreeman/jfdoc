define(function (require) {

  var q = require("qunit");

  var File = require("lib/ast/file");

  var parse       = require("../common/parse");
  var stringEqual = require("../common/string-equal");
  var tagsEqual   = require("../common/tags-equal");

  q.module("author tag", {
    setup : function () {
      this.files = parse("samples/tag-author.js").files;
      this.file = this.files[0];
    }
  });

  q.test("scope", function () {
    q.expect(2);
    q.strictEqual(this.files.length, 1, "number of files");
    q.ok(this.files[0] instanceof File, "is a file");
  });

  q.test("name", function () {
    q.expect(1);
    q.strictEqual(this.file.name, "samples/tag-author.js", "has file name");
  });

  q.test("description", function () {
    q.expect(2);
    stringEqual(this.file.doclet.desc,
      "Description for the file.");
  });

  q.test("author", function () {
    q.expect(2);
    tagsEqual(this.file.doclet.tags["author"], "name", ["John Smith"]);
  });

});

