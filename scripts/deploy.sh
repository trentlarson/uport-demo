#!/bin/bash

if [ -z "$1" ]
then
    echo "No release tag supplied (arg 1)"
    exit 1
fi

if [ -z "$2" ]
then
    echo "No SSH key file specified (arg 2)"
    exit 1
fi

if ! [ -z "$(git status --porcelain)" ]
then
    echo "Sorry: you've got changes.  Run 'git status'"
    exit 1
fi

git checkout $1

DEPLOY_DIR=uport-demo

rsync -azv --exclude .git --exclude-from .gitignore -e "ssh -i $2" . ubuntu@endorser.ch:$DEPLOY_DIR

ssh -i $2 ubuntu@endorser.ch << EOF
  cd $DEPLOY_DIR
  # since we're still running this as root (which is bad)
  sudo chown -R ubuntu.ubuntu node_modules/.cache
  # need to add --production on the end of "npm ci"
  npm ci
  # need to add this
  # npm prune --production
  perl -p -i -e "s/VERSION=.*/VERSION=$1/g" .env
EOF

echo "Deployed.  Now log in and get into screen and start the app."
