define(function (require) {

  var assert = require("assert");

  var nquery = require("../scanner/nquery");
  var Scope  = require("../ast/scope");

  var ScopeChain = function ScopeChain(root, globalScope) {
    /* The top is at index 0. */
    this.stack = [];
    /* The top-most scope lets name qualifiers start with the global scope
     * name. */
    var secretScope = new Scope("<secret>", null);
    secretScope.add(globalScope);
    this.stack.unshift({ scope : secretScope });
    /* Start with the global scope. */
    this.stack.unshift({ scope : globalScope });
    /* The next scope is for the root node. */
    this.push(root);
  };

  ScopeChain.prototype.push = function push(node) {
    assert.ok(node, "scope must belong to a node");
    //console.log("push scope for " + node.type);
    var scope = new Scope("<local>", null);
    this.stack.unshift({ node : node, scope : scope });
  };

  ScopeChain.prototype.pop = function pop(node) {
    assert.ok(this.stack.length > 2, "cannot pop global scope");
    assert.strictEqual(this.stack[0].node, node,
      "node to pop does not match the top of stack");
    //console.log("pop scope for " + node.type);
    this.stack.shift();
  };

  ScopeChain.prototype.top = function top() {
    assert.ok(this.stack.length, "no top of empty stack");
    return this.stack[0];
  };

  ScopeChain.prototype.add = function add(decl, name) {
    assert.ok(this.stack.length, "no scope to add decl");
    console.log("local declaration " + name + " points to " + decl);
    this.top().scope.add(decl, name);
  };

  ScopeChain.prototype.lookup = function lookup(name) {
    for (var i = 0; i < this.stack.length; ++i) {
      var decl = this.stack[i].scope.lookdown([name]);
      if (decl) return decl;
    }
  };

  return ScopeChain;

});

