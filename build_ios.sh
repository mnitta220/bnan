#!/bin/bash

if [ -f ./src/assets/font/NotoSerifJP-Regular.otf ]; then
  rm ./src/assets/font/NotoSerifJP-Regular.otf
fi

ionic build --prod

if [ $? = 0 ]; then
  npx cap copy
fi
