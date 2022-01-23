#!/bin/bash

if [ -z "$1" ]
then
    echo 'No release environment supplied (arg 1 of "" or "test")'
    exit 1
fi

if [ -z "$2" ]
then
    echo "No release tag supplied (arg 2)"
    exit 1
fi

if [ -z "$3" ]
then
    echo "No SSH key file specified (arg 3)"
    exit 1
fi

if ! [ -z "$(git status --porcelain)" ]
then
    git status
    echo ""
    echo "Note that you've got those uncommitted changes.  They'll be pushed in the deploy."
    echo "Will continue in 5..."
    sleep 1
    echo "4..."
    sleep 1
    echo "3..."
    sleep 1
    echo "2..."
    sleep 1
    echo "1..."
    sleep 1
    echo "Continuing with deploy."
fi

git checkout $2

USERNAME=ubuntu$1
DEPLOY_DIR=uport-demo

rsync -azv --exclude .git --exclude-from .gitignore -e "ssh -i $3" . $USERNAME@endorser.ch:$DEPLOY_DIR

ssh -i $3 $USERNAME@endorser.ch << EOF

  echo "Logged in as:"
  whoami

  # I've brought the server to its knees trying to do this with the app still running.
  echo "Killing any running uport-demo by this user."
  ps -u | grep "node scripts/start.js" | grep -v "sh -c" | grep -v grep | awk "{print \$2}" | xargs kill

  cd $DEPLOY_DIR

  echo "Running npm ci..."
  # Don't we need to add --production on the end of "npm ci"?
  npm ci
  echo "... finished with npm ci"

  # There's a "deploy-production" script we should look into.
  #npm run deploy-production

  # I think this is useful, but it causes a failure at startup.
  #echo "Running: npm prune"
  #npm prune --production

  perl -p -i -e "s/VERSION=.*/VERSION=$2/g" .env
EOF

git checkout master

echo "Deployed.  Now log in and start the app -- and be careful of a CPU spike."
