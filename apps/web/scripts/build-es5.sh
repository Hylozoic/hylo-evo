#!/bin/bash
if ! test -e package.json; then
  echo "Run this script from the app's root directory."
  exit 1
fi

export NODE_ENV=production
for dir in src scripts; do
  ./node_modules/.bin/babel --config-file ./babel.config.cjs --env-name server $dir --out-dir es5/$dir
done

for file in `find src -name "*.scss"`; do
  dest=`echo $file | sed 's/^/es5\//'`
  mkdir -p `dirname $dest`
  cp $file $dest
done
