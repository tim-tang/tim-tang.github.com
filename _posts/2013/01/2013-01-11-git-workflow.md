---
layout: post
title: "Git workflow"
description: "Git 分支与合并工作流程"
category: Misc
keywords: git github workflow
tags: [Git]
location: Suzhou, China
alias: [/Misc/2013/01/11/git-workflow]
---
最近做项目，用到git的分支和开发流程整合,纪录一下具体的实践。

## 基于origin来创建分支

    git branch hotfix
    git push origin hotfix

## 基于某个commit hash创建分支

    git checkout master
    git checkout <commit hash>
    git checkout -b hotfix

## 从origin中hostfix branch代码拉到本地

    git checkout -b hotfix origin/hotfix

## 提交代码到hotfix分支

    git checkout hotfix
    git commit -m "Check-in comments…"
    git push origin hotfix

## 把hotfix的代码merge到master

    git checkout master
    git merge hotfix

## git master--hotfix--develop工作流程图

![Hotfixes branching model](/images/post/branch-model-for-hotfixes.png)

> 当然我们还可以给master分支打上标签，在此之上新建不同版本的branch来维护，此文档会持续更新！
