define(function (require) {

  var exports = {};

  exports.assert = function assert(condition, located, message) {
    if (!condition) exports.error(located, message);
    return !condition;
  };

  exports.error = function error(located, message) {
    console.error(located.loc + ": error: " + message);
  };

  exports.warn = function warn(located, message) {
    console.warn(located.loc + ": warning: " + message);
  };

  exports.log = function log(located, message) {
    console.log(located.loc + ": log: " + message);
  };

  return exports;

});

