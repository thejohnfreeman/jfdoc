(function () {

  var makeKind = function makeKind(name, Base, initializer) {
    var Kind = function () {
      this.name = name;
    };
    Kind.prototype = new Base();
    Kind.initialize = function initialize(doclet) {
      /* We already initialized the doclet for base kinds. */
      if (doclet.kind instanceof Kind) return;

      /* We can change to derived kinds only. */
      var kind = new Kind();
      if (!(kind instanceof doclet.kind.constructor)) {
        console.error("changing kind of doclet; information will be lost");
      }

      Base.initialize(doclet);
      if (initializer) initializer.call(doclet);
      doclet.kind = kind;
    };
    return Kind;
  };

  var Kind = function Kind() {
    this.name = "unknown";
  };
  Kind.initialize = function () {};

  var FileKind = makeKind("file", Kind);

  var NamespaceKind = makeKind("namespace", Kind);

  var FunctionKind = makeKind("function", Kind, function () {
    this.params = [];
  });

  var ConstructorKind = makeKind("constructor", FunctionKind);

  var ClassKind = makeKind("class", Kind);

  jfdoc.extend({
    Kind : Kind,
    FileKind : FileKind,
    NamespaceKind : NamespaceKind,
    FunctionKind : FunctionKind,
    ConstructorKind : ConstructorKind,
    ClassKind : ClassKind,
  });

}());

