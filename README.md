---
layout: default
title: Puzzle of Human Civilization
permalink: /
---

# Puzzle of Human Civilization

这是一个以 Obsidian 管理的跨学科学习笔记库，当前主要记录化学、物理以及后续可能扩展的人类文明相关学习内容。

## 当前内容

### 化学（Chem Journey）

- [AP Chemistry master checklist]({{ '/chemistry/ap-chemistry/' | relative_url }})：AP Chemistry 九个单元、科学实践、实验和公式的系统清单。
- [Liquid type test experiment]({{ '/chemistry/liquid-type-test/' | relative_url }})：通过质量、体积和密度识别未知液体的实验知识。
- [Cycle 1 学习记录]({{ '/chemistry/cycle-1/' | relative_url }})：化学学习路径、兴趣主题和实验设想。

### 物理（Phy）

- [Time and Space]({{ '/physics/time-and-space/' | relative_url }})：从天文观测、历法和计时工具出发，整理人类对时间概念的理解。

## 使用方式

使用 [Obsidian](https://obsidian.md/) 打开本目录即可。笔记使用 Markdown 编写，`.obsidian/` 保存仓库级 Obsidian 配置。

## GitHub 同步

仓库连接到：

`git@github.com:lloyd-c137/Puzzle-of-Human-Civilization.git`

已配置 macOS `launchd` 每天 03:15 执行同步，流程为：

1. 提交本地笔记改动；
2. 拉取远端 `main` 并 rebase；
3. 推送到远端 `main`。

同步脚本不会强制推送；发生冲突时会停止并保留现场。详细说明见 [SYNC]({{ '/sync/' | relative_url }})。

手动执行：

```bash
./scripts/sync-with-github.sh
```

日志位置：

```text
~/Library/Logs/PHC/github-sync.log
```

## 目录结构

```text
.
├── Chem Journey/       # 化学学习笔记
├── Phy/                 # 物理学习笔记
├── Math/                # 数学学习笔记，待扩展
├── .obsidian/           # Obsidian 配置
├── scripts/             # GitHub 同步和 launchd 配置
├── SYNC.md              # 同步说明
└── README.md            # 项目说明
```

## 注意事项

- 不要把密码、令牌、私钥或其他敏感信息写入笔记。
- 自动同步依赖本机 GitHub SSH 认证。
- `欢迎.md` 是 Obsidian 初始欢迎笔记，后续可以删除或改造成项目首页。
