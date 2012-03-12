#!/bin/bash

gmake
node --debug-brk jfdoc.js < $*

