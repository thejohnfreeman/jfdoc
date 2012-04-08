define(function (require) {

  var clc = require("cli-color");
  var qunit = require("qunit");

  var config = function config(arg) {
    Object.keys(arg).forEach(function (name) {
      config[name] = arg[name];
    });
  };

  config.hidePassed = false;
  config.verbose = false;

  /****************************************************/
  /* Suite report. */

  var isDone = false;

  qunit.done(function ($) {
    if (isDone) return;
    isDone = true;
    console.log("total : (" + clc.red($.failed.toString()) + ", " +
      clc.green($.passed.toString()) + ", " + $.total + ")");
  });

  /****************************************************/
  /* Module report. */

  var moduleName = "";

  qunit.moduleStart(function ($) {
    moduleName = $.name;
  });

  qunit.moduleDone(function ($) {
    if (isDone) return;
    console.log((($.failed > 0) ? clc.red("!! ") : clc.green("OK ")) +
      clc.blue($.name) + " : (" + clc.red($.failed.toString()) + ", " +
      clc.green($.passed.toString()) + ", " + $.total + ")");
  });

  /****************************************************/
  /* Test report. */

  var testLog = "";

  qunit.log(function ($) {
    if (config.hidePassed && $.result) return;
    testLog += "\n   " + ($.result ? clc.green("OK") : clc.red("!!")) +
      " " + $.message;
    /* $.actual and $.expected will both be undefined if we are logging an
     * unasserted failure, like an uncaught exception. */
    if (!$.result && $.actual !== $.expected) {
      testLog += "\n      " + clc.yellow("actual  ") + " : " +
        clc.red(JSON.stringify($.actual));
      testLog += "\n      " + clc.yellow("expected") + " : " +
        clc.green(JSON.stringify($.expected));
    }
  });

  var log = console.log;
  var warn = console.warn;
  var error = console.error;
  var noop = function () {};

  qunit.testStart(function ($) {
    if (!config.verbose) {
      console.log = console.warn = console.error = noop;
    }
  });

  qunit.testDone(function ($) {
    console.log = log;
    console.warn = warn;
    console.error = error;

    if (config.hidePassed && !$.failed) return;

    console.log((($.failed > 0) ? "   " : clc.green("OK ")) +
      clc.blue(moduleName + " :: " + $.name) + " : (" +
      clc.red($.failed.toString()) + ", " + clc.green($.passed.toString()) +
      ", " + $.total + ")" + testLog);
    testLog = "";
  });

  return {
    config : config
  };

});

