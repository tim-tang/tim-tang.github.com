---
layout: post
title: "Interactive Git Stash for stashing specific file"
description: "使用Git stash暂存指定的本地修改文件"
category: Git
keywords: git stash
tags: [Git]
location: Suzhou, China
---


由于项目中使用一些jar和plugin经常需要客户那边批准，这样就造成了本地开发的时候有些pom.xml配置无法马上提交，这样就需要使用git stash来暂存本地修改。但是遇到一个问题就是在本地修改多个文件时部分需要暂存部分需要提交，解决这个问题的方法就是使用git stash save --patch来交互的指定需要stash的文件。下面举例：

## 我的工程目录修改了3个文件，只要提交2个，pom.xml不需要提交

    $ git status

    # On branch local# Changes not staged for commit:
    # (use "git add <file>..." to update what will be committed)
    # (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #modified: $FILE_PATH/a.xml
    #modified: $FILE_PATH/b.xml
    #modified: $FILE_PATH/pom.xml
    #

## 使用git stash交互方式选择

    $ git stash save --patch

    #... #省去diff输出
    Stash this hunk [y,n,q,a,d,/,e,?]? n

    #... #省去diff输出
    Stash this hunk [y,n,q,a,d,/,e,?]? n

    #... #省去diff输出,这个是我们要stash的文件
    Stash this hunk [y,n,q,a,d,/,e,?]?y

## 下面我们查看文件状态,可以看到pom.xml已经被stash

    $ git status

    # On branch local
    # Changes not staged for commit:
    # (use "git add <file>..." to update what will be committed)
    # (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #modified: $FILE_PATH/a.xml
    #modified: $FILE_PATH/b.xml
    #

    $ git stash list

    #stash@{0}: WIP on local: 2257d1e balabala...

## 下面我们就可以提交修改到GitHub

    $ git add . && git commit -am 'balabalal' && git co master && git merge local && git push origin master

## 当我们提交完成，切换到local branch，恢复stash的暂存文件

    $ git stash apply stash@{0}

> 这样我们就可以在本地继续使用这个修改文件，不需要手动去改任何东西. Cheers!

