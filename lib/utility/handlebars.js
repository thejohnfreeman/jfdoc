define(function (require) {

  var handlebars = require("handlebars");

  handlebars.loadPartial = function loadPartial(name) {
    var partial = handlebars.partials[name];
    if (typeof partial === "string") {
      partial = handlebars.compile(partial);
      handlebars.partials[name] = partial;
    }
    return partial;
  };

  handlebars.registerHelper("ifNotEmpty", function ifNotEmpty(options) {
    var content = options.inverse(this);
    if (content.trim() === "") {
      content = "";
    } else {
      handlebars.registerPartial("$content", content);
      content = options.fn(this);
    }
    return content;
  });

  handlebars.registerHelper("join", function join(list, sep, options) {
    return list.map(options.fn).join(sep);
  });

  handlebars.registerHelper("ul", function ul(list, options) {
    if (!list || list.length === 0) return "";
    return "<ul>\n" + list.map(function (item) {
      return "<li>" + options.fn(item) + "</li>";
    }).join("\n") + "\n</ul>";
  });

  handlebars.registerHelper("partial", function partial(name, options) {
    handlebars.registerPartial(name, options.fn);
  });

  handlebars.registerHelper("block", function block(name, options) {
    /* Look for partial by name. */
    var partial = handlebars.loadPartial(name) || options.fn;
    return partial(this, { data : options.hash });
  });

});

