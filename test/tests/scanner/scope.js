define(function (require) {

  var q = require("qunit");

  var traverse     = require("lib/utility/esprima/traverse");
  var ScopeVisitor = require("lib/scanner/scope-visitor");

  var scan = require("../common/scan");

  var MockScopeChain = function () {
    this.stack  = [];
    this.pushes = 0;
    this.pops   = 0;
  };

  MockScopeChain.prototype.push = function push(node) {
    ++this.pushes;
    this.stack.unshift(node);
  };

  MockScopeChain.prototype.top = function top(node) {
    return { node : this.stack[0] };
  };

  MockScopeChain.prototype.pop = function pop(node) {
    ++this.pops;
    if (node === this.stack[0]) this.stack.shift();
  };

  q.module("scope manager");

  q.test("found scopes", function () {
    q.expect(3);

    var root = scan("samples/scopes.js");
    var chain = new MockScopeChain();
    traverse(root, new ScopeVisitor(chain));

    q.strictEqual(chain.pushes, 3, "pushed scopes");
    q.strictEqual(chain.pops, 3, "popped scopes");
    q.strictEqual(chain.stack.length, 0, "matched scopes");
  });

});

