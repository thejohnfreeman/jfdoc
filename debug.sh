#!/bin/bash

gmake
# TODO: Fix error with call to rmdir
rm -rf doc
node --debug-brk jsdoc.js < jsdoc.js

