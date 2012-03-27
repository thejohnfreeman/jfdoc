(function () {

  /* Adapted from David Coallier. */
  Object.defineProperty(Object.prototype, "extend", {
    enumerable : false,
    value : function (from) {
      var keys = Object.getOwnPropertyNames(from);
      var to = this;
      keys.forEach(function (key) {
        var value = Object.getOwnPropertyDescriptor(from, key);
        Object.defineProperty(to, key, value);
      });
      return this;
    }
  });

}());
