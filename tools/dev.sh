#!/bin/bash
# The Dev script for setting up file watcher and rebuild upon changes.

# Run Build to get the freshest build of the static server.
npm run build
if [ $? -ne 0 ]; then
 echo "The site build has failed"
 exit 1;
fi


GO_BINARY_FP='./dist/server'
# Compile and go binary for server
go build -o $GO_BINARY_FP server.go

TOOLS_DIR='./tools'
node $TOOLS_DIR/dist/src_watcher/watcher.js & 
watcher_pid=$!

$GO_BINARY_FP & 
go_server_pid=$!

wait


cleanup() {
  if [ -n "${watcher_pid}:-" ]; then
    kill "${watcher_pid}" 2>/dev/null
  fi 
  if [ -n "${go_server_pid}:-"]; then
    kill "${go_server_pid}" 2>/dev/null
  fi
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
