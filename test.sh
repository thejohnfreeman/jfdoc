#!/bin/bash

gmake
# TODO: Fix error with call to rmdir
rm -rf doc
node jsdoc.js < jsdoc.js

