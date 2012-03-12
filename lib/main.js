/**
 * @file Entry point.
 * @author John Freeman
 */
(function () {

  var util = require("util");
  var assert = require("assert");

  var esprima = require("esprima");

  process.stdin.setEncoding("utf8");

  process.stdin.on("data", function (str) {
    var root = esprima.parse(str, { comment : true, range : true, loc : true });
    esprima.attachComments(root);
    var str = util.inspect(root.comments, /*showHidden=*/true, /*depth=*/3);
    process.stdout.write(str + "\n");
  });

  process.stdin.resume();

}());

