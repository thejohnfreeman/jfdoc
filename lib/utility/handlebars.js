(function () {

  var handlebars = require("handlebars");

  handlebars.loadPartial = function (name) {
    var partial = handlebars.partials[name];
    if (typeof partial === "string") {
      partial = handlebars.compile(partial);
      handlebars.partials[name] = partial;
    }
    return partial;
  };

  handlebars.registerHelper("join", function (list, sep, options) {
    return list.map(options.fn).join(sep);
  });

  handlebars.registerHelper("ul", function (list, options) {
    if (!list || list.length === 0) return "";
    return "<ul>\n" + list.map(function (item) {
      return "<li>" + options.fn(item) + "</li>";
    }).join("\n") + "\n</ul>";
  });

  handlebars.registerHelper("partial", function (name, options) {
    handlebars.registerPartial(name, options.fn);
  });

  handlebars.registerHelper("block", function (name, options) {
    /* Look for partial by name. */
    var partial = handlebars.loadPartial(name) || options.fn;
    return partial(this, { data : options.hash });
  });

}());
