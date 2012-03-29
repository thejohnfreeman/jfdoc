(function () {

  var fs = require("fs");
  var q = require("qunit");

  var jfdoc = require("../jfdoc.js");

  exports.parse = function parse(filename) {
    var log = console.log;

    var symbols = new jfdoc.SymbolTable();

    try {
      console.log = function () {};
      var parser = new jfdoc.Parser(symbols, {
        spacesPerTab : 2
      });
      var source = fs.readFileSync("test/cases/" + filename, "utf8");
      parser.parseFile(filename, source);
    } finally {
      console.log = log;
    }

    return symbols;
  };

  exports.stringEqual = function stringEqual(actual, expected) {
    q.strictEqual(actual, expected, "matches without trimming");
    q.strictEqual(actual.trim(), expected, "matches with trimming");
  };

  exports.tagsEqual = function tagsEqual(tags, field, values) {
    q.strictEqual(tags.length, values.length, "number of tags");
    values.forEach(function (value, i) {
      q.strictEqual(tags[i][field], value, field + " of tag[" + i + "]");
    });
  };

}());

