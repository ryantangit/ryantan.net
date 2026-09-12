#!/bin/bash
PUBLIC_DIR=./public
STATIC_DIR=./static
TOOLS_DIR=./tools

# Compile any browser code and import statics into public
mkdir -p $PUBLIC_DIR/js && cp -rT $STATIC_DIR $PUBLIC_DIR && tsc && \
tsc -p $TOOLS_DIR/tsconfig.json && node $TOOLS_DIR/dist/page_gen/generator.js 
