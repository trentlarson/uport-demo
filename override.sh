#!/bin/bash

# Build a local version of a given repository, and copy its contents into node_modules
# effectively overriding the currently installed version.  This is ugly practice for
# keeping package.json in sync with what's actually built, but npm i will always fix this.
override() {
  echo "
    Building and copying $1 to node_modules...
  "
  cd $1 \
    && yarn build:es5 \
    && cp -r src lib package.json ../node_modules/$1/ \
    && cd ..;
  if [ $? -ne 0 ]; then 
    echo "
      ERROR: Failed to build $1
    ";
    exit 1;
  fi;
}

# Override each of the uport libraries
for arg in "$@"; do
  if [ *"$arg"* == "uport-transports" ]; then override uport-transports; fi;
  if [ *"$arg"* == "uport-connect" ]; then override uport-connect; fi;
  if [ *"$arg"* == "uport-credentials" ]; then override uport-credentials; fi;
done;