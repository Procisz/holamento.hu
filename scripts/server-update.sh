#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

log() { echo "$(date -Is) $*"; }

git fetch --quiet origin main
git reset --hard --quiet origin/main

if ! node scripts/pull-data.mjs; then
  log "a letoltes nem sikerult"
  exit 1
fi

if [ -z "$(git status --porcelain -- public/data.json archive)" ]; then
  log "nincs valtozas"
  exit 0
fi

git add public/data.json archive
git -c user.name="holamento adatfrissites" \
    -c user.email="holamento.hu@gmail.com" \
    commit -q -m "chore: adatfrissites $(date +%F)"
git push --quiet origin main
log "frissitve es felpusholva"
