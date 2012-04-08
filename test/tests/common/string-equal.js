define(function (require) {

  var q = require("qunit");

  var stringEqual = function stringEqual(actual, expected) {
    q.strictEqual(actual, expected, "matches without trimming");
    q.strictEqual(actual.trim(), expected, "matches with trimming");
  };

  return stringEqual;

});

