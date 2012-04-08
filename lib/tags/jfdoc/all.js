define(function (require) {

  var tags = {};

  [
    "author",
    "class",
    "constructor",
    "function",
    "global",
    "method",
    "memberOf",
    "name",
    "namespace",
    "param",
    "private",
    "public",
    "returns",
  ].forEach(function (tag) {
    tags[tag] = require("./" + tag);
  });

  return tags;

});

