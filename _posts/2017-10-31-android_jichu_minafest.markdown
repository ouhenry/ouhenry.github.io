---
layout: post
title: "Android Manifest 配置笔记"
date: 2017-10-31 12:00:00 +0800
categories: ["移动开发"]
description: "记录 AndroidManifest 配置与 Android 工程基础知识。"
permalink: "/2017/10/31/android_jichu_minafest.html"
historical: true
---

## Manifest 中的组件与配置

这份笔记记录 AndroidManifest 中见到的配置项，包括 `<permission>`、`<application>` 与 `<data>`。
而application里面又有许多的子标签, 比如`<activity>`, `<service>`,`<broadcast>`等等，
现在来总结一下`<activity>` 里面的属性标签。

比较常用的有`<name>`, `<windowSoftInputMode>`, `<configChanges>`,`<launchModel>`等，
除此之外还有很多比如：

## Task 相关配置

- `android:allowTaskReparenting`
- `android:alwaysRetainTaskState`

- `android:allowBackUp`
- `android:backupAgent`
- `android:backupInForeground`
- `android:finishOntaskLaunch`
- `android:relinquishTaskIdentity`
- `android:taskAffinity`


## 进程相关配置

- `android:process`
- `android:multiprocess`


## 界面相关配置

- `android:bannaer`
- `android:icon`
- `android:label`
- `android:theme`
- `android:screenOrientation`


## 启动模式的区别

其中 launchMode 中
singleTask 和 singleInstance的区别是 singleTask Activity 允许其他Activity成为
其任务的组成部分，它始终位于其任务的根位置，但其他Activity可以启动到该任务中。

singleInstance Activity则不允许其他Activiy成为其任务的组成部分。它是任务唯一的Activity.
