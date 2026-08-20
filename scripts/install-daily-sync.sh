#!/usr/bin/env bash

set -euo pipefail
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin"

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LABEL="com.lloyd-c137.phc-daily-sync"
SOURCE_PLIST="${REPO_DIR}/scripts/${LABEL}.plist"
TARGET_DIR="${HOME}/Library/LaunchAgents"
TARGET_PLIST="${TARGET_DIR}/${LABEL}.plist"
DOMAIN="gui/$(id -u)"

[[ -x "${REPO_DIR}/scripts/sync-with-github.sh" ]] || {
  echo "Sync script is not executable: ${REPO_DIR}/scripts/sync-with-github.sh" >&2
  exit 1
}

mkdir -p "${TARGET_DIR}" "${HOME}/Library/Logs/PHC"
cp "${SOURCE_PLIST}" "${TARGET_PLIST}"
launchctl bootout "${DOMAIN}/${LABEL}" >/dev/null 2>&1 || true
launchctl bootstrap "${DOMAIN}" "${TARGET_PLIST}"
launchctl enable "${DOMAIN}/${LABEL}" >/dev/null 2>&1 || true

echo "Installed ${LABEL}; it will run daily at 03:15."
echo "Log: ${HOME}/Library/Logs/PHC/github-sync.log"
