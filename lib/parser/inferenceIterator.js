(function () {

  var assert = require("assert");

  var Parser = jfdoc.Parser;

  var InferenceIterator = function InferenceIterator(root, parser) {
    Parser.ScopedIterator.call(this, root, parser.symbols.globals);
    this.parser = parser;
  };

  var Base = Parser.ScopedIterator.prototype;
  InferenceIterator.prototype = Object.create(Base);

  InferenceIterator.prototype.next = function next() {
    var node = this.get();
    if (!node.comments) this.infer();
    /* Never skip subtrees so that we get to see all declarations. */
    Base.next.call(this, /*skipSubtree=*/false);
  };

  InferenceIterator.prototype.infer = function infer() {
    var node = this.get();
    var qname = new jfdoc.Name();
    node = Parser.inferName(qname, node);
    /* Cannot do anything without a name or decl. */
    if (!(qname.getName() && node)) return;
    var kind = Parser.inferKind(node);
    if (kind) {
      var doclet = new jfdoc.Doclet(/*description=*/"", /*isExplicit=*/false);
      doclet.setLoc(this.parser.filename, this.parser.source, node);
      doclet.name.set(qname);
      doclet.setKind(kind);
      this.parser.finishDoclet(doclet);
    } else {
      /* Check if rhs is a qualified name. */
      var sqname = Parser.getQualNameFromExpr(node);
      if (!sqname) return;
      /* Find the decl named. */
      var spath = sqname.getPath();
      var decl = this.scopes.lookup(spath.shift());
      if (!decl) {
        //console.warn("could not lookup " + sqname);
        return;
      }
      decl = decl.lookdown(spath);
      if (!decl) return;
      /* Either move it into local scope, or move it into a new scope. */
      if (qname.isLocal()) {
        this.remember(qname.getName(), decl);
      } else if (qname.isGlobal()) {
        if (sqname.isQualified()) {
          console.warn("cannot document one decl under multiple scopes");
          return;
        }
        this.parser.addDecl(qname, decl);
      }
    }
  };

  Parser.InferenceIterator = InferenceIterator;

}());

