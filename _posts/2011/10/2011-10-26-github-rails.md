---
layout: post
title: 利用Github管理Rails代码
description: 利用Github管理Rails代码
category: Git
keywords: github rails
tags: [Git, GitHub]
location: Suzhou, China
alias: [/Git/2011/10/26/github-rails]
---
GitHub 提供了很好的代码配置管理方案，特别是linux系统用户，没有道理不使用，废话少说，看下如何在ubuntu下用git管理你的rails代码:

##注册一个github的账户，创建一个repository,比如everyday
##安装git,使用如下命令：

    $sudo apt-get install git-core git-gui git-doc

##创建ssh key:

    $ cd ~/.ssh
    $ mkdir key_backup            --备份原来的key
    $ cp id_rsa* key_backup
    $ rm id_rsa*

##生成新ssh key:

    $ ssh-keygen -t rsa -C "tang.jilong@139.com"
##把生成的id_rsa.pub公钥，同步到github,可利用如下命令测试配置是否成功：

    $ssh -T git@github.com

##配置用户名和密码：

    $ git config --global user.name "Firstname Lastname"
    $ git config --global user.email "your_email@youremail.com"

##一些其他的配置,让git输出有颜色：

    $git config --global color.branch auto
    $git config --global color.diff auto
    $git config --global color.interactive auto
    $git config --global color.status auto

##cd 到~/Documents/everyday目录，执行：

    $git init
    $vi rails_app/.gitignore  --可以参考：[.gitignore][1]
    $git add .
    $git commit -am 'first commit'
    $git remote add origin git@github.com:tim-tang/everyday.git
    $git push -u origin master

> 道这里git的配置完成，可以参考具体的官方文档[linux set up git][2], Git的深入学习可以看看这里：[Git Book](http://gitbook.liuhui998.com)（原创文章）

  [1]: https://github.com/tim-tang/everyday/blob/master/.gitignore "gitignore"
  [2]: http://help.github.com/linux-set-up-git/ "linux-set-up-git"
