TOOLS_DIR='./tools'

tsc -p $TOOLS_DIR/tsconfig.json && node $TOOLS_DIR/dist/src_watcher/watcher.js 
