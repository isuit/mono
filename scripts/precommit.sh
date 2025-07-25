#!/usr/bin/env bash

### Functions ###

println() {
  printf "$1\n" "${@:2}"
}

msg() {
  printf "[precommit] $1: $2" "${@:3}"
}

infom() {
  msg "info" "${@:1}"
}

info() {
  infom "$1\n" "${@:2}"
}

gitDiff() {
  git diff-index --name-only HEAD --diff-filter ACMRTUXB
}

grepFiles() {
  res=`gitDiff | grep -E "$1"`
  echo "$res"
}

grepDir() {
  grepFiles "^$1/.*\.($2)$"
}

### Main ###

# Lint

if [[ `grepDir "src" "tsx?"` ]]; then
  infom "Linting src ... "
  npm run --silent lint:base -- --quiet `grepDir "src" "tsx?"` || exit 1
  println "🮱"
fi

# DRY compile face

#if [[ `grepSrcFaceFiles "tsx?"` ]]; then
#  infom "Dry compiling face ts ..."
#  npx tsc -p "./src/face/tsconfig.json" --noEmit || exit 1
#  println "🮱"
#fi
