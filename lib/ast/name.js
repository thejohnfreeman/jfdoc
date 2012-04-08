define(function () {

  /* Names need a lot of helpers, so they get their own class. */
  var Name = function Name(name, quals) {
    this.qualifiers = quals || []; // Array<String>
    this.name       = name  || ""; // String
    this.scope = Name.SCOPE_UNKNOWN;
  };

  Name.prototype.set = function set(other) {
    if (!other) return true;
    this.qualifiers = other.qualifiers;
    this.name       = other.name;
    this.scope      = other.scope;
    return false;
  };

  Name.SCOPE_UNKNOWN = 0;
  Name.SCOPE_LOCAL   = 1;
  Name.SCOPE_GLOBAL  = 2;
  Name.SCOPE_NESTED  = 3;

  Name.prototype.setLocal = function setLocal() {
    return this.scope = Name.SCOPE_LOCAL;
  };

  Name.prototype.isLocal = function isLocal() {
    return this.scope === Name.SCOPE_LOCAL;
  };

  Name.prototype.setGlobal = function setGlobal() {
    return this.scope = Name.SCOPE_GLOBAL;
  };

  Name.prototype.isGlobal = function isGlobal() {
    return this.scope === Name.SCOPE_GLOBAL;
  };

  Name.prototype.setNested = function setNested() {
    return this.scope = Name.SCOPE_NESTED;
  };

  Name.prototype.isNested = function isNested() {
    return this.scope === Name.SCOPE_NESTED;
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

  Name.prototype.toString = function toString() {
    return this.getQualifiedName() || "(unnamed)";
  }

  return Name;

});

