define(function (require) {

  var Scope = require("../ast/scope");

  var ScopeVisitor = function ScopeVisitor(chain) {
    this.chain = chain;
  };

  ScopeVisitor.prototype.enter = function enter(node) {
    var t = node.type;
    if (!(t === "FunctionDeclaration" || t === "FunctionExpression")) return;

    var scope = this.chain.push(node);
    node.params.forEach(function (param) {
      if (param.type !== "Identifier") return;
      var decl = new Scope(param.name, null);
      this.chain.add(decl);
    }, this);
  };

  ScopeVisitor.prototype.leave = function leave(node) {
    if (node === this.chain.top().node) {
      this.chain.pop(node);
    }
  };

  return ScopeVisitor;

});

