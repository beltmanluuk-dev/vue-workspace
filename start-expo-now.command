#!/bin/zsh
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /Users/macbook/vue_app && npx expo start --clear 2>&1 | tee /tmp/expo-latest.log
