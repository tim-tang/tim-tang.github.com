---
layout: post
title: "使用Dropbox作为git的私有repository."
description: "将Dropbox当作git 远程的私有repository."
category: Git 
keywords: git, dropbox
tags: [Git] 
location: Suzhou, China
---

GitHub需要对私有的repository收费，Dropbox又提供了很大的云端存储空间而且免费，这样我们的私有repository可以建立在dropbox里面，而且dropbox支持多人之间的分享，看来这条路是走的通的，下面我们就来实践下，也是备忘。

## 1- 创建Dropbox git repository

    $ mkdir -p ~/Dropbox/Git
    $ git init --bare mytestrepo.git

## 2- 创建project

    $ cd ~
    $ mkdir testrepo
    $ cd testrepo
    $ git init
      Initialized empty Git repository in /Users/jetheis/testrepo/.git/

## 3- 添加测试文件

    $ git add testfile.txt
    $ git commit -m "Add a test file"
    $ git remote add origin ~/Dropbox/Git/mytestrepo.git
    $ git push -u origin master

## 4- 测试repository

    $ cd ~/
    $ git clone ~/Dropbox/Git/mytestrepo.git testrepo2
    $ cd testrepo2
    $ git log #No surprise, everything is reflected, just like we expected.

> Cheers!
