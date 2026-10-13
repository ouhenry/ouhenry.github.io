# 跬步 · Henry 的学习手记

基于 Jekyll 的中文个人博客。自定义响应式首页、文章页、主题页及支持搜索的归档页，无前端打包步骤、无第三方字体或脚本依赖。

## 本地运行

推荐 Ruby 3.3 或更新的兼容版本与 Bundler 4.0.16。

```sh
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve
```

浏览器访问 `http://127.0.0.1:4000`。修改 `_config.yml` 后重启服务。

## 写文章

在 `_posts/` 下创建 `YYYY-MM-DD-文章名.md`：

```yaml
---
layout: post
title: "文章标题"
date: 2026-10-13 12:00:00 +0800
categories: ["工程实践"]
description: "用一两句话说明文章讨论的问题。"
featured: true
---
```

正文用 Markdown 编写，二级与三级标题自动进入目录。代码块使用三个反引号加语言名。`featured: true` 的文章可进入首页精选，按日期倒序取前三篇。草稿使用 `published: false`，本地可通过 `bundle exec jekyll serve --unpublished` 查看。历史环境或资源文章可添加 `historical: true` 显示说明。

分类保持与 `_data/topics.yml` 一致。已有文章使用显式 `permalink` 保留原地址，修改标题或分类时不要随意更改它。

## 定制

- 站点名称、作者、邮箱与域名：`_config.yml`
- 首页内容和布局：`_layouts/home.html`
- 页面、文章模板：`_layouts/`
- 分类说明与顺序：`_data/topics.yml`
- 配色、布局和移动端样式：`assets/css/style.css`
- 搜索、目录、阅读进度与复制：`assets/js/main.js`

搜索基于标题、分类与编辑摘要，大小写不敏感，可与分类筛选组合。未启用 JavaScript 时仍可浏览全部文章。

## 构建与发布

```sh
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter --trace
python3 scripts/check_site.py
```

仓库工作流在 push / PR 时构建和检查，只有手动运行工作流才部署默认分支。首次发布时，在 GitHub 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**，然后在 Actions 中手动运行 **Build and publish blog**。

使用 Jekyll 4 构建，不使用 GitHub Pages 的内置旧版 Jekyll。若部署到子目录，设置 `_config.yml` 的 `baseurl`，或构建时使用 `--baseurl /子目录`。

## 内容整理说明

保留原笔记主体及原有文章地址，补齐 26 篇文件的元数据、分类和摘要。两篇占位笔记保持草稿；修复了无效的 Liquid 片段，规范标题层级，并重整部分短笔记与 RecyclerView 性能文章。旧资源链接未逐一验证，带历史标记的文章需结合当前文档阅读。
