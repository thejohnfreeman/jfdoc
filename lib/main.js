(function () {

  process.stdin.setEncoding("utf8");

  process.stdin.on("data", function (str) {
    process.stdout.write("read: " + str + "\n");
  });

  process.stdin.resume();

}());

