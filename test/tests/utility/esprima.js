define(function (require) {

  var q = require("qunit");

  var traverse  = require("lib/utility/esprima/traverse");
  var Commenter = require("lib/utility/esprima/commenter");

  var scan = require("../common/scan");

  q.module("commenter");

  q.test("node owns comment", function () {
    q.expect(8);

    var root = scan("samples/comments.js");
    traverse(root, new Commenter(root.comments));

    var prog = root.program;
    q.strictEqual(prog.leadingComments[0].value, "a",
      "program owns comment a");

    var block = prog.body[0].consequent;
    q.strictEqual(block.body[0].leadingComments[0].value, "b",
      "foo owns comment b");
    q.strictEqual(block.body[0].leadingComments[1].value, "c",
      "foo owns comment c");

    q.strictEqual(block.body[2].leadingComments[0].value, "d",
      "bar comment d");

    q.strictEqual(block.trailingComments[0].value, "e",
      "consequent owns comment e");
    q.strictEqual(block.trailingComments[1].value, "f",
      "consequent owns comment f");

    q.strictEqual(prog.body[1].consequent.trailingComments[0].value, "g",
      "consequent owns comment g");

    q.strictEqual(root.trailingComments[0].value, "h",
      "script owns comment h");
  });

  q.module("AST");

  q.test("wrapping", function () {
    q.expect(7);

    var root = scan("samples/tag-namespace.js");

    q.strictEqual(root.type, "Script", "script node at root");
    var prog = root.program;
    q.strictEqual(prog.type, "Program", "script node wraps program");
    q.strictEqual(prog.body.length, 2, "program has two statements");
    q.strictEqual(prog.body[0].type, "ExpressionStatement",
      "first statement is ExpressionStatement");
    q.strictEqual(prog.body[0].expression.type, "AssignmentExpression",
      "first statement's expression is an assignment");
    q.strictEqual(prog.body[1].type, "ExpressionStatement",
      "second statement is ExpressionStatement");
    q.strictEqual(prog.body[1].expression.type, "AssignmentExpression",
      "second statement's expression is an assignment");
  });

  q.module("visitor");

  var MockVisitor = function (visits) {
    this.visits = visits;
  };
  MockVisitor.prototype.visit = function visit(node) {
    this.visits.push(node.type);
  };

  q.test("visitation order", function () {
    q.expect(8);

    var visits = [];
    var root = scan("samples/tag-namespace.js");
    traverse(root, new MockVisitor(visits));

    q.strictEqual(visits[0], "Script", "first visit is to script");
    q.strictEqual(visits[1], "Program", "second visit is to program");
    q.strictEqual(visits[2], "ExpressionStatement",
      "third visit is to statement");
    q.strictEqual(visits[3], "AssignmentExpression",
      "fourth visit is to assignment");
    q.strictEqual(visits[4], "ObjectExpression",
      "fifth visit is to object literal");
    q.strictEqual(visits[5], "ExpressionStatement",
      "sixth visit is to statement");
    q.strictEqual(visits[6], "AssignmentExpression",
      "seventh visit is to assignment");
    q.strictEqual(visits[7], "ObjectExpression",
      "eighth visit is to object literal");
  });

});

