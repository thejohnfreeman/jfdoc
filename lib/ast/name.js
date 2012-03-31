(function () {

  /* Names need a lot of helpers, so they get their own class. */
  var Name = function Name(name, quals) {
    this.qualifiers = quals || []; // Array<String>
    this.name = name || "";        // String
  };

  Name.prototype.assign = function assign(name) {
    this.qualifiers = name.qualifiers;
    this.name = name.name;
  };

  Name.prototype.getQualifier = function getQualifier() {
    return this.qualifiers.join(".");
  };

  Name.prototype.setQualifier = function setQualifier(qualifier) {
    var name = Name.fromString(qualifier);
    if (!name) return true;
    this.qualifiers = name.getPath();
    return false;
  };

  Name.prototype.getName = function getname() {
    return this.name;
  }

  var isName = function isName(name) { return name.search(/^\w+$/) >= 0; };

  Name.prototype.setName = function setName(name) {
    if (!isName(name)) return true;
    this.name = name;
    return false;
  };

  Name.prototype.getQualifiedName = function getQualifiedName() {
    return this.getPath().join(".");
  };

  Name.prototype.getQualifiers = function getQualifiers() {
    return this.qualifiers;
  };

  Name.prototype.getPath = function getPath() {
    return this.qualifiers.concat(this.name);
  };

  /**
   * Tries to deduce the name that the node represents.
   * @param node {Node}
   * @returns {Name} If successful.
   * @returns {null} If no name could be deduced.
   */
  Name.fromNode = function fromNode(node) {
    if (node.type === "Identifier") {
      /* Base case. */
      return new Name(node.name);
    } else if (node.type === "MemberExpression") {
      /* Recurse. */
      if (node.property.type !== "Identifier") return null;
      var qual = Name.fromNode(node["object"]);
      if (qual) return new Name(node.property.name, qual.getPath());
    }
    return null;
  };

  Name.fromString = function fromString(str) {
    var names = str.trim().split(".");
    if (!names.every(isName)) return null;
    var name = names.pop();
    return new Name(name, names);
  };

  jfdoc.Name = Name;

}());

