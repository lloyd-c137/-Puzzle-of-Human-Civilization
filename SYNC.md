# GitHub daily sync

这个仓库使用 macOS `launchd` 每天同步到 GitHub 的 `main` 分支。

同步流程：

1. 提交本地笔记和配置改动；
2. 从 `origin/main` 拉取远端改动并 rebase；
3. 推送到 GitHub。

脚本不会强制推送，也不会覆盖本地文件。遇到 rebase 冲突或远端认证失败时，本次同步会停止，并将结果写入：

`~/Library/Logs/PHC/github-sync.log`

## 安装或重新安装每日任务

```bash
./scripts/install-daily-sync.sh
```

当前任务每天 03:15 运行。

## 手动测试

```bash
./scripts/sync-with-github.sh
tail -f ~/Library/Logs/PHC/github-sync.log
```

脚本要求本机已经配置好 GitHub SSH 认证，并且当前远程地址是：

`git@github.com:lloyd-c137/Puzzle-of-Human-Civilization.git`
