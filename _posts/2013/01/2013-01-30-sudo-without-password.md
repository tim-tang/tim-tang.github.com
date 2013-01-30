---
layout: post
title: "Mac sudo without password"
description: "Mac配置sudo时免去输入密码"
category: Mac
keywords: mac sudo password
tags: [Mac, Shell]
location: Suzhou, China
---

经常使用terminal的哥们肯定会遇到需要root权限的问题，我又比较懒，很多代码的产生就是为了方便懒惰的程序员,经常使用sudo的时候需要输入密码，反正自己的系统自己用就找了方法免去每次输入密码，下面介绍下：

## 修改 /etc/sudoers 这个文件

    sudo visudo -f /etc/sudoers

> 建议用visudo 这个工具来修改，它会帮你校验文件配置是否正确

## 默认情况的权限是这样的

    root ALL=(ALL) ALL
    %admin ALL=(ALL) ALL

## 修改成如下：

    # 修改amdin组都不用输入密码
    %admin ALL=(ALL) NOPASSWD: NOPASSWD ALL
    # 只是想让 tim 用户输入sudo不需要密码
    tim ALL=(ALL) NOPASSWD: ALL

> admin群组的用户都能执行所有命令， 不需要输入password

## 小技巧

    # !! 表示上次执行的命令
    sudo !!

> 有时候当我们输入了一大串命令后敲下去发现需要写sudo，这个时候不得不找回上个命令，然后回到命令开头，然后加上sudo空格, 这时候就可以用如上命令.
> 最后推荐一个shell 命令的网站[commandlinefu.com](http://www.commandlinefu.com/commands/browse/sort-by-votes)


