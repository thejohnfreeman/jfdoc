define(function (require) {

  var fs      = require("fs");
  var esprima = require("esprima");

  var wrap = require("lib/utility/esprima/wrap");

  var scan = function scan(filename) {
    var source = fs.readFileSync("test/" + filename, "utf8");
    var root = esprima.parse(source,
      { comment : true, range : true, loc : true });
    root = wrap(root);
    return root;
  };

  return scan;

});

