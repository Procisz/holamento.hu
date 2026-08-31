#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

log() { echo "$(date -Is) $*"; }

git fetch --quiet origin main
git reset --hard --quiet origin/main

if ! node scripts/pull-data.mjs; then
  log "download failed"
  exit 1
fi

if [ -z "$(git status --porcelain -- public/data.json archive)" ]; then
  log "no change"
  exit 0
fi

git add public/data.json archive
git -c user.name="holamento data refresh" \
    -c user.email="holamento.hu@gmail.com" \
    commit -q -m "chore: data refresh $(date +%F)"
git push --quiet origin main
log "updated and pushed"
