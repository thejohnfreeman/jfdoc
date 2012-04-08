define(function () {

  var ScopeVisitor = function ScopeVisitor(chain) {
    this.chain = chain;
  };

  ScopeVisitor.prototype.enter = function enter(node) {
    var t = node.type;
    if (t === "FunctionDeclaration" || t === "FunctionExpression") {
      this.chain.push(node);
    }
  };

  ScopeVisitor.prototype.leave = function leave(node) {
    if (node === this.chain.top().node) {
      this.chain.pop(node);
    }
  };

  return ScopeVisitor;

});

