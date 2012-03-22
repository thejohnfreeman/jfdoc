/**
 * JavaScript documentation generator.
 *
 * @author John Freeman
 */

(function () {

  var fs = require("fs");

  /* TODO: Parse other command line options for configuration. */
  var filenames = process.argv.slice(2);
  /* TODO: Separate library and application. */

  var doccer = new jfdoc.Documenter();

  filenames.forEach(function (filename) {
    try {
      var source = fs.readFileSync(filename, "utf8");
    } catch (e) {
      console.error("could not open '" + filename + "': " + e);
      return;
    }

    doccer.add(filename, source);
  });

  doccer.flush();

}());

