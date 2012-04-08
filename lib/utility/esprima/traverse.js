define(function (require) {

  var assert = require("assert");
  var TreeIterator = require("./tree-iterator");

  var defaultVisitor = {
    visit : function () {},
    enter : function () {},
    leave : function () {}
  };

  /* Commands for short-circuiting traversal. */
  var TRAVERSAL_BREAK = 1;
  var TRAVERSAL_SKIP  = 2;

  var VisitingIterator = function VisitingIterator(root, visitor) {
    TreeIterator.call(this, root);

    Object.keys(defaultVisitor).forEach(function (key) {
      if (!visitor[key]) visitor[key] = defaultVisitor[key];
    });
    this.visitor = visitor;

    this.command = this.visitor.visit(this.get());
  };

  var Base = TreeIterator.prototype;
  VisitingIterator.prototype = Object.create(Base);

  VisitingIterator.prototype.stepIn = function stepIn() {
    this.visitor.enter(this.get());
    Base.stepIn.call(this);
  };

  VisitingIterator.prototype.nextSibling = function nextSibling() {
    Base.nextSibling.call(this);
    if (this.isValid()) this.command = this.visitor.visit(this.get());
  };

  VisitingIterator.prototype.stepOut = function stepOut() {
    Base.stepOut.call(this);
    this.visitor.leave(this.get());
  };

  var traverse = function traverse(root, visitor) {
    var it = new VisitingIterator(root, visitor);
    while (it.isValid() && it.command !== TRAVERSAL_BREAK) {
      it.next(it.command === TRAVERSAL_SKIP);
    }
  };

  traverse.TRAVERSAL_BREAK = TRAVERSAL_BREAK;
  traverse.TRAVERSAL_SKIP  = TRAVERSAL_SKIP;

  return traverse;

});

