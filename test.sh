#!/bin/bash

gmake
# TODO: Fix error with call to rmdir
rm -rf doc
gmake doc

