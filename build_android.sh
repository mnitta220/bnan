#!/bin/bash

if [ ! -f ./src/assets/font/NotoSerifJP-Regular.otf ]; then
  cp ./resources/NotoSerifJP-Regular.otf ./src/assets/font/
fi

ionic build

if [ $? = 0 ]; then
  npx cap copy
fi
