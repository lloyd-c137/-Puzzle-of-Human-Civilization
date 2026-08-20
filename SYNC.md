---
layout: default
title: GitHub Automatic Sync
permalink: /sync/
---

# GitHub automatic sync

This repository uses macOS `launchd` to check for local file changes and sync them to the GitHub `main` branch.

The sync process:

1. Detects local file changes.
2. Commits them with an automatic-sync commit message.
3. Fetches the latest `origin/main`.
4. Rebases local `main` onto `origin/main`.
5. Pushes the result to GitHub.

The script never force-pushes and never overwrites local files. If a rebase conflict or GitHub authentication failure occurs, the run stops and records the result in:

`~/Library/Logs/PHC/github-sync.log`

## Install or reinstall the automatic task

```bash
./scripts/install-daily-sync.sh
```

The task checks for local changes every 30 seconds and automatically commits and pushes when it finds any.

## Manual test

```bash
./scripts/sync-with-github.sh
tail -f ~/Library/Logs/PHC/github-sync.log
```

The script requires GitHub SSH authentication and this remote repository:

`git@github.com:lloyd-c137/Puzzle-of-Human-Civilization.git`
