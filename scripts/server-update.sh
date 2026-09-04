#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

log() { echo "$(date -Is) $*"; }

find_node() {
  if [ -n "${NODE_BIN:-}" ]; then
    echo "$NODE_BIN"
    return
  fi
  if command -v node >/dev/null 2>&1; then
    command -v node
    return
  fi
  local candidate
  for candidate in /usr/local/bin/node /usr/bin/node /opt/node/bin/node "$HOME"/.nvm/versions/node/*/bin/node; do
    if [ -x "$candidate" ]; then
      echo "$candidate"
      return
    fi
  done
}

node_bin="$(find_node)"
if [ -z "$node_bin" ]; then
  log "node not found, set NODE_BIN to its absolute path"
  exit 1
fi

git fetch --quiet origin main
git reset --hard --quiet origin/main

if ! "$node_bin" scripts/pull-data.mjs; then
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
