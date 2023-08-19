#!/bin/bash
cd browser && yarn build && rm -rf ../server/build && cp -r build ../server/