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
launch.py -c $ROOT code

echo "Other common options:

cd firefox

#to test it:
#jpm run
jpm run -b /usr/bin/firefox

#to bundle:
#update the version number in package.json first, then:
jpm xpi
mv @copyalltabs-0.0.3.xpi ../

#commit changes to git

#log on to mozilla to submit it as a new version:
https://addons.mozilla.org/en-US/firefox/users/login?to=%2Fen-US%2Ffirefox%2Faddon%2Fcopy-all-tabs%2F%3Fsrc%3Dapi

for more notes, see extensions documentation

launch.py -c $ROOT code


"

