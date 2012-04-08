define(function (require) {

  /**
   * Wrap a parse tree with a top-level node of type "Script" whose range
   * captures all comments.
   */
  var wrap = function wrap(root) {
    var end = root.range[1];
    if (root.comments.length) {
      var lastComment = root.comments[root.comments.length - 1];
      end = Math.max(end, lastComment.range[1]);
    }

    return {
      type : "Script",
      program : root,
      range : [0, end],
      comments : root.comments,
      loc : {
        start : {
          line : 1,
          column : 0
        },
        /* Comments do not have location information, so this value may be
         * incorrect, but no worries because it will not be used. */
        end : root.loc.end
      }
    };
  };

  return wrap;

});

