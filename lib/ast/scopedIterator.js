(function () {

  var assert = require("assert");
  var esprima = require("esprima");

  var ScopeStack = function ScopeStack(root) {
    /* The top is at index 0. */
    this.stk = [];
    this.push(root);
  };

  ScopeStack.prototype.push = function push(node) {
    assert.ok(node, "scope must belong to a node");
    //console.log("push scope for " + node.type);
    this.stk.unshift({ node : node, scope : {}});
  };

  ScopeStack.prototype.pop = function pop(node) {
    assert.ok(this.stk.length, "cannot pop empty stack");
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
    assert.ok(this.stk.length, "no scope to add declaration");
    var scopeName = (this.stk[0].node.id)
      ? (this.stk[0].node.id.name) : "(unnamed)";
    //console.log("declaration " + name + " found in function " + scopeName);
    this.stk[0].scope[name] = decl;
  };

  ScopeStack.prototype.lookup = function lookup(name) {
    var decl;
    for (var i = 0; i < this.stk.length; ++i) {
      var scope = this.stk[i].scope;
      if (scope.hasOwnProperty(name)) {
        decl = scope[name];
        break;
      }
    }
    return decl;
  };

  ScopeStack.prototype.resolve = function resolve(qname) {
    var path = qname.qualifier.concat(qname.name);
    /* Look up. */
    var decl = this.lookup(path.shift());
    /* Look down. */
    while (path.length) {
      assert.ok(decl instanceof jfdoc.Scope, "qualifier names non-scope");
      decl = decl.enterScope(path.shift());
    }
    return decl;
  };

  var ScopedIterator = function ScopedIterator(root) {
    esprima.TreeIterator.call(this, root);
    this.scopes = new ScopeStack(this.get());
  };

  var Base = esprima.TreeIterator.prototype;
  ScopedIterator.prototype = Object.create(Base);

  ScopedIterator.prototype.getScopes = function getScopes() {
    return this.scopes;
  }

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

  ScopedIterator.prototype.next = function next(skipSubtree) {
    Base.next.call(this, skipSubtree);
    var node = this.get();
    if (node && node.type === "VariableDeclarator") {
      assert.strictEqual(node.id.type, "Identifier",
        "did not expect non-identifier for variable name");
      /* TODO: Lookup decl on rhs. Add as decl in current scope under lhs
       * name. */
    }
  };

  jfdoc.ScopedIterator = ScopedIterator;

}());

