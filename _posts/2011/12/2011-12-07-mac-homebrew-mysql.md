---
layout: post
title: Mac通过homebrew 安装mysql
description: Mac通过homebrew 安装mysql
category: Mac
keywords: mac homebrew mysql
tags: [Homebrew, Mac]
location: Suzhou, China
alias: [/Mac/2011/12/07/mac-homebrew-mysql]
---
使用MBP有一年了，开始想在工作中使用mac由于各种不习惯最终失败，导致自己使用了一年多的ubuntu,最近把ubuntu升级到了11.10,新版本的unity界面，和程序之间的切换缓慢让我决定强制切换到mac  os 来开发，为将来尝试textmate做准备，没想到刚切到mac os 安装mysql就遇到了问题，下面介绍下在osx下brew安装mysql的过程：

##安装homebrew比较简单：

	/usr/bin/ruby -e "$(curl -fsSL https://raw.github.com/gist/323731)"

##通过brew安装mysql:

	brew install mysql

##等成功安装完成，想要登录的时候出问题了：

	ERROR 2002 (HY000): Can not connect to local MySQL server through socket '/tmp/mysql.sock' (2)
##google了一下，找到答案原来，还没彻底安装完成：

	brew info mysql

##以上命令可以看到具体的安装信息，那就装吧：

	unset TMPDIR
	mysql_install_db --verbose --user=`root` --basedir="$(brew --prefix mysql)" --datadir=/usr/local/var/mysql --tmpdir=/tmp

##下面我们还需要启动mysql服务：

	mysql.server start

##用如下命令登录即可：

	mysql -uroot  #初始没有设置密码

##如果要在启动系统的时候启动服务可以执行如下命令：

	mkdir -p ~/Library/LaunchAgents
	cp /usr/local/Cellar/mysql/5.5.15/com.mysql.mysqld.plist ~/Library/LaunchAgents/
	launchctl load -w ~/Library/LaunchAgents/com.mysql.mysqld.plist

##在rails app 中常用到mysql,我们还需要建立一个软链接

	sudo ln -s /tmp/mysql.sock /var/run/mysqld/mysqld.sock

>  初步安装完成，慢慢开始习惯和体验mac os,看看是否真有网上说的这么好，就写到这里。
