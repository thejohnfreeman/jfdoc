define(function (require) {

  var globalTag = function globalTag(doclet, options) {
    doclet.name.setGlobal();
  };

  return globalTag;

});

