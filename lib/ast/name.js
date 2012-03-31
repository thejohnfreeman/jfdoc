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
    this.qualifiers = qualifier.split(".");
  };

  Name.prototype.getName = function getname() {
    return this.name;
  }

  Name.prototype.setName = function setName(name) {
    this.name = name;
  };

  Name.prototype.getQualifiedName = function getQualifiedName() {
    return this.getQualifier() + this.name;
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
  Name.from = function from(node) {
    if (node.type === "Identifier") {
      /* Base case. */
      return new Name(node.name);
    } else if (node.type === "MemberExpression") {
      /* Recurse. */
      if (node.property.type !== "Identifier") return null;
      var qual = Name.from(node["object"]);
      if (qual) return new Name(node.property.name, qual.getPath());
    }
    return null;
  };

  jfdoc.Name = Name;

}());

