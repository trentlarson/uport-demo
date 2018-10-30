#!/bin/bash

# Build a local version of a given repository, and copy its contents into node_modules
# effectively overriding the currently installed version.  This is ugly practice for
# keeping package.json in sync with what's actually built, but npm i will always fix this.
override() {
  echo "
    Building and copying $1 to node_modules...
  ";
  cd $1 \
    && npm i && npm run build:es5 \
    && cp -r src ../node_modules/$1/src \
    && cp -r lib ../node_modules/$1/lib \
    && cd ..;
  if $?; then 
    echo "
      ERROR: Failed to build $1
    ";
    exit 1;
  fi;
}

# Override each of the uport libraries
override uport-connect;
override uport-credentials; 
override uport-transports; 