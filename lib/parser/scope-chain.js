define(function (require) {

  var assert = require("assert");

  var nquery = require("../scanner/nquery");
  var Scope  = require("../ast/scope");

  var ScopeChain = function ScopeChain(root, globalScope) {
    /* The top is at index 0. */
    this.stack = [];
    /* Start with the global scope. */
    this.stack.unshift({ scope : globalScope });
    /* The next scope is for the root node. */
    this.push(root);
  };

  ScopeChain.prototype.push = function push(node) {
    assert.ok(node, "scope must belong to a node");
    //console.log("push scope for " + node.type);
    var name = nquery.getNameFromIdOf(node) || "<anonymous>";
    var parent = this.top().scope;
    var scope = new Scope(name, parent);
    this.stack.unshift({ node : node, scope : scope });
  };

  ScopeChain.prototype.pop = function pop(node) {
    assert.ok(this.stack.length > 1, "cannot pop global scope");
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
    return this.top().scope.lookup(name);
  };

  return ScopeChain;

});

