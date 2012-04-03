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

  Name.prototype.getName = function getName() {
    return this.name;
  };

  var isId = function isId(name) { return name.search(/^\w+$/) >= 0; };

  Name.prototype.setName = function setName(id) {
    if (!isId(id)) return true;
    this.name = id;
    return false;
  };

  Name.prototype.isQualified = function isQualified() {
    return this.qualifiers.length;
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

  Name.prototype.setPath = function setPath(path) {
    this.name = path.pop();
    this.qualifiers = path;
  };

  Name.fromString = function fromString(str) {
    var ids = str.trim().split(".");
    if (!ids.every(isId)) return null;
    var id = ids.pop();
    return new Name(id, ids);
  };

  jfdoc.Name = Name;

}());

