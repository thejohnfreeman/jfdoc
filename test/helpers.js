(function () {

  var fs = require("fs");
  var q = require("qunit");

  var log = console.log;
  console.log = function () {};
  require("../jfdoc");
  console.log = log;

  exports.parse = function parse(filename) {
    var log = console.log;
    console.log = function () {};

    var doccer = new jfdoc.Documenter();
    var source = fs.readFileSync("test/cases/" + filename, "utf8");
    doccer.add(filename, source);

    console.log = log;
    return doccer.symbols;
  };

  exports.stringEqual = function stringEqual(actual, expected) {
    q.strictEqual(actual, expected, "matches without trimming");
    q.strictEqual(actual.trim(), expected, "matches with trimming");
  };

}());

