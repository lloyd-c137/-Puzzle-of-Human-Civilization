---
layout: default
title: Puzzle of Human Civilization
permalink: /
description: A reader-friendly index of the PHC cross-disciplinary learning vault.
---

# Puzzle of Human Civilization

这是一个以 Obsidian 管理的跨学科学习笔记库，记录化学、物理、数学和生物学习，以及与科学推理相关的实验、路线和学习日志。

Use this page as the reading index. The directory below lists every published learning note by subject, followed by the textbook files kept in the vault.

## Start here

- [AP Chemistry Master Checklist]({{ '/chemistry/ap-chemistry/' | relative_url }})：从 AP Chemistry 的九个单元、科学实践、实验和公式开始。
- [Chemical Foundations Learning Journey]({{ '/chemistry/chemical-foundations-journey/' | relative_url }})：沿着测量、单位、有效数字和密度建立化学基础。
- [Biology Learning Journal]({{ '/biology/learning-journal/' | relative_url }})：从生命系统和科学思维开始的持续学习记录。

## 目录 Contents

按主题浏览全部学习笔记。每个条目的简介说明它适合在什么时候阅读。

<nav class="subject-jump" aria-label="Subject index">
  <a href="#chemistry">Chemistry <span>化学</span></a>
  <a href="#physics">Physics <span>物理</span></a>
  <a href="#mathematics">Mathematics <span>数学</span></a>
  <a href="#biology">Biology <span>生物</span></a>
</nav>

{% assign subjects = "Chemistry|Physics|Mathematics|Biology" | split: "|" %}
{% for subject in subjects %}
{% assign subject_pages = site.pages | where: "section", subject | sort: "title" %}
<section class="directory-section" id="{{ subject | slugify }}">
  <div class="directory-heading">
    <h2>{{ subject }}</h2>
    <span class="directory-count">{{ subject_pages.size }} notes</span>
  </div>
  <ul class="directory-list">
    {% for doc in subject_pages %}
    <li>
      <a href="{{ doc.url | relative_url }}">{{ doc.title }}</a>
      {% if doc.summary %}<p>{{ doc.summary }}</p>{% endif %}
    </li>
    {% endfor %}
  </ul>
</section>
{% endfor %}

## Reference library

- [Zumdahl Chemistry 9th Edition textbook]({{ '/resources/Zumdahl Chemistry 9th c2014 txtbk.pdf' | replace: ' ', '%20' | relative_url }})：化学学习路线使用的主要教材。
- [Conceptual Physics 12th Edition textbook]({{ '/resources/Conceptual Physics (12th Edition, 2014).pdf' | replace: ' ', '%20' | relative_url }})：物理学习路线使用的参考教材。

## Vault notes

- [欢迎]({{ '/welcome/' | relative_url }})：Obsidian 新仓库的初始说明。

使用 [Obsidian](https://obsidian.md/) 打开本目录即可。笔记使用 Markdown 编写，`.obsidian/` 保存仓库级 Obsidian 配置。自动同步脚本和 GitHub Pages 的部署文件属于维护资料，不列入读者目录。

## Safety and privacy

- 不要把密码、令牌、私钥或其他敏感信息写入笔记。
