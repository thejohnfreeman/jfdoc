define(function (require) {

  var traverse = require("../utility/esprima/traverse");
  var Commenter = require("../utility/esprima/commenter");

  var ScopeVisitor = require("./scope-visitor");
  var DocVisitor = require("./doc-visitor");

  var ScanVisitor = function ScanVisitor(scopev, docv) {
    this.scopev = scopev;
    this.docv   = docv;
  };

  ScanVisitor.prototype.enter = function enter(node) {
    this.scopev.enter(node);
  };

  ScanVisitor.prototype.visit = function visit(node) {
    return this.docv.visit(node);
  };

  ScanVisitor.prototype.leave = function leave(node) {
    this.scopev.leave(node);
  };

  var scan = function (root, chain, callback) {
    /* Have to set comment owners before scanning for docs so that we can
     * lookahead. */
    traverse(root, new Commenter(root.comments));

    var scopev = new ScopeVisitor(chain);
    var docv = new DocVisitor(callback);
    var scanv = new ScanVisitor(scopev, docv);
    traverse(root, scanv);
  };

  return scan;

});

