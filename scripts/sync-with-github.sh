#!/usr/bin/env bash

set -uo pipefail
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin"

REPO_DIR="${PHC_REPO_DIR:-/Users/mac/Documents/obsidian-vault/01-learning/PHC}"
REMOTE_NAME="${PHC_REMOTE_NAME:-origin}"
BRANCH="${PHC_BRANCH:-main}"
LOG_DIR="${HOME}/Library/Logs/PHC"
LOG_FILE="${LOG_DIR}/github-sync.log"
LOCK_DIR="${TMPDIR:-/tmp}/phc-github-sync.lock"

mkdir -p "$LOG_DIR"
exec >>"$LOG_FILE" 2>&1

timestamp() {
  date '+%Y-%m-%d %H:%M:%S %z'
}

fail() {
  printf '[%s] ERROR: %s\n' "$(timestamp)" "$*"
  exit 1
}

printf '\n[%s] Starting sync\n' "$(timestamp)"

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  printf '[%s] Another sync is already running; skipping\n' "$(timestamp)"
  exit 0
fi
trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT

cd "$REPO_DIR" || fail "Repository directory not found: $REPO_DIR"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "Not a Git worktree: $REPO_DIR"

remote_url="$(git config --get "remote.${REMOTE_NAME}.url" || true)"
case "$remote_url" in
  git@github.com:lloyd-c137/Puzzle-of-Human-Civilization.git|https://github.com/lloyd-c137/Puzzle-of-Human-Civilization.git) ;;
  *) fail "Unexpected ${REMOTE_NAME} URL: ${remote_url:-<missing>}" ;;
esac

current_branch="$(git branch --show-current)"
[[ "$current_branch" == "$BRANCH" ]] || fail "Expected branch ${BRANCH}, found ${current_branch:-detached HEAD}"

if [[ -n "$(git status --porcelain)" ]]; then
  printf '[%s] Committing local changes\n' "$(timestamp)"
  git add -A || fail "Could not stage local changes"
  if ! git diff --cached --quiet; then
    git commit -m "Automatic sync: $(date '+%Y-%m-%d %H:%M:%S')" || fail "Could not commit local changes"
  fi
else
  printf '[%s] No local file changes; skipping sync\n' "$(timestamp)"
  exit 0
fi

printf '[%s] Fetching %s/%s\n' "$(timestamp)" "$REMOTE_NAME" "$BRANCH"
git fetch --prune "$REMOTE_NAME" "$BRANCH" || fail "Could not fetch from GitHub"

printf '[%s] Rebasing local %s onto %s/%s\n' "$(timestamp)" "$BRANCH" "$REMOTE_NAME" "$BRANCH"
if ! git rebase "${REMOTE_NAME}/${BRANCH}"; then
  git rebase --abort >/dev/null 2>&1 || true
  fail "Rebase conflict; local changes were preserved and the run was stopped"
fi

printf '[%s] Pushing %s\n' "$(timestamp)" "$BRANCH"
git push "$REMOTE_NAME" "HEAD:${BRANCH}" || fail "Could not push to GitHub"
printf '[%s] Sync completed successfully\n' "$(timestamp)"
