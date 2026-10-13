---
layout: post
title: "RecyclerView 性能优化笔记"
date: 2019-03-04 12:00:00 +0800
categories: ["移动开发"]
description: "围绕 RecyclerView 列表性能，记录开发中值得注意的优化思路。"
permalink: "/2019/03/04/recycleView_profermance.html"
featured: true
---

这份笔记来自一种常见的嵌套列表场景：外层是纵向内容列表，每个条目中又包含一组可横向滑动的图片。最初记录的问题包括整体滑动卡顿、首屏条目创建慢，以及横向图片的滑动体验不理想。

## 先区分问题发生在哪里

把列表性能拆成几个阶段观察：布局创建、数据绑定、图片加载与滚动。不要一次修改多个参数；先确定耗时来自哪里，再比较修改前后的表现。

## 明确 setHasFixedSize 的含义

```java
recyclerView.setHasFixedSize(true);
```

这个设置表示 **RecyclerView 自身的尺寸不会因为 Adapter 内容变化而改变**，并不表示每个条目必须等高，也不表示系统完全停止测量条目。只有满足这个前提时才适合开启。

## 理解缓存与复用

### 屏幕外条目缓存

`setItemViewCacheSize(int size)` 调整屏幕外保留的 View 数量。它需要一个整数参数；提高缓存数量也会增加内存使用，应通过实际测量选择数值。

### 多个列表共享复用池

当多个 RecyclerView 使用兼容的条目类型和布局时，可以通过 `setRecycledViewPool(...)` 共享复用池，减少重复创建 ViewHolder 的机会。共享时需要确保相同 viewType 对应兼容的 ViewHolder。

### 稳定 ID

`setHasStableIds(true)` 是 Adapter 的设置。使用前需要正确实现 `getItemId()`，并保证同一条数据的 ID 在变更过程中保持稳定；它不是通用的性能开关。

## 嵌套横向列表的体验

原笔记尝试用横向 RecyclerView 展示图片，并结合 `LinearSnapHelper` 实现吸附效果。是否采用这种方式，需要结合轮播、分页、手势和无障碍需求决定。

原笔记还提出避免使用 ConstraintLayout。更合适的做法是测量具体布局的创建和测量开销，再考虑简化层级；不能仅根据布局类名判断性能。

## 下一次排查时的顺序

1. 确认卡顿发生在创建、绑定、布局还是图片加载阶段。
2. 检查绑定过程是否包含重复计算或阻塞操作。
3. 评估条目布局和图片尺寸，再检查复用与缓存策略。
4. 在同一设备、同一数据和同一滚动场景下比较结果。

## 参考文档

缓存、固定尺寸与复用池的具体语义参见 [Android 官方 RecyclerView API 文档](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView)。
