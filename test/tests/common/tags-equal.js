define(function (require) {

  var q = require("qunit");

  var tagsEqual = function tagsEqual(tags, field, values) {
    q.strictEqual(tags.length, values.length, "number of tags");
    values.forEach(function (value, i) {
      q.strictEqual(tags[i][field], value, field + " of tag[" + i + "]");
    });
  };

  return tagsEqual;

});

