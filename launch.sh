#!/bin/bash

# launch.py is availble in:
# https://github.com/charlesbrandt/moments

# path to launch.py is defined in:
# ~/.bashrc
# example .bashrc is available in moments/editors/ directory

#old way
#export PREFIX="python /c/mindstream/mindstream"
#echo "$PREFIX/launch.py -c $ROOT todo"

export ROOT=/c/public/copy_all_tabs

launch.py -c $ROOT todo

echo "Other common options:
launch.py -c $ROOT code
"

