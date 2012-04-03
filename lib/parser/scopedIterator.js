(function () {

  var assert = require("assert");
  var esprima = require("esprima");

  var Parser = jfdoc.Parser;

  var ScopeStack = function ScopeStack(root, globalScope) {
    /* The top is at index 0. */
    this.stk = [];
    /* The top-most scope lets name qualifiers start with the global scope
     * name. */
    var secretScope = {};
    assert.ok(globalScope.name, "expected name for global scope");
    secretScope[globalScope.name] = globalScope;
    this.stk.unshift({ scope : secretScope });
    /* The next scope has all the global names. */
    this.stk.unshift({ scope : globalScope.decls });
    /* The next scope is for the root node. */
    this.push(root);
  };

  ScopeStack.prototype.push = function push(node) {
    assert.ok(node, "scope must belong to a node");
    //console.log("push scope for " + node.type);
    this.stk.unshift({ node : node, scope : {}});
  };

  ScopeStack.prototype.pop = function pop(node) {
    assert.ok(this.stk.length > 2, "cannot pop global scope");
    assert.strictEqual(this.stk[0].node, node,
      "node to pop does not match the top of stack");
    //console.log("pop scope for " + node.type);
    this.stk.shift();
  };

  ScopeStack.prototype.top = function top() {
    assert.ok(this.stk.length, "no top of empty stack");
    return this.stk[0];
  };

  ScopeStack.prototype.add = function add(name, decl) {
    assert.ok(name, "expected name for new declaration");
    assert.ok(this.stk.length, "no scope to add decl");
    var scopeName = Parser.getNameFromIdOf(this.stk[0].node) || "(unnamed)";
    console.log("declaration " + name + " found in function " + scopeName +
      " pointing to " + decl);
    this.stk[0].scope[name] = decl;
  };

  ScopeStack.prototype.lookup = function lookup(name) {
    var decl = null;
    for (var i = 0; i < this.stk.length; ++i) {
      var scope = this.stk[i].scope;
      if (scope.hasOwnProperty(name)) {
        decl = scope[name];
        break;
      }
    }
    return decl;
  };

  var ScopedIterator = function ScopedIterator(root, globalScope) {
    this.scopes = new ScopeStack(root, globalScope);
    esprima.TreeIterator.call(this, root);
  };

  var Base = esprima.TreeIterator.prototype;
  ScopedIterator.prototype = Object.create(Base);

  ScopedIterator.prototype.stepIn = function stepIn() {
    var node = this.get();
    var type = node.type;
    if (type === "FunctionDeclaration" || type === "FunctionExpression") {
      this.scopes.push(node);
    }
    Base.stepIn.call(this);
  };

  ScopedIterator.prototype.stepOut = function stepOut() {
    if (!Base.stepOut.call(this)) return false;
    var node = this.get();
    if (node === this.scopes.top().node) {
      this.scopes.pop(node);
    }
    return true;
  };

  /* Remember a local declaration in case it gets moved or extended later. */
  ScopedIterator.prototype.remember = function remember(decl) {
    this.scopes.add(decl.name, decl);
  };

  Parser.ScopedIterator = ScopedIterator;

}());

