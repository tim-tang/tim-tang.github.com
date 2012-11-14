---
layout: post
title: "Useful shell command for Ubuntu&Mac"
description: "Note some useful shell commands."
category: Msic
tags: [Shell]
location: Suzhou, China
---
Note useful shell commands for both Mac OSX and Ubuntu.

## Commands for Mac OSX

	find . -name *.java -exec grep -ilr mtx {} \; # search mtx in java file.
	grep -ilr xx *                                # find xx recursively
	ls -tls                                       # order by time desc.
	open -a safari xx.html
	open http://www.xxx.com
	alias doc='cd /Users/tim/Documents'
	alias desk='cd /Users/tim/Desktop'
	alias down='cd /Users/tim/Downloads'
	alias up='cd ..'
	printenv                                       # display environment variable.
	find . -name '*.rar' -execdir unrar e {} \;    # unrar recursive

## Commands for Ubuntu

	ls -al | tee -a out.txt | cat -n

	alias install='sudo apt-get install'

	cat -n xxx.txt #display lines

	cat useful-shell | xargs   #空格替换换行

	iwlist scan  #列出所有可以无线网络

	ssh-add ~/.ssh/KEY_PAIR_NAME.pem.  # add key pair into SSH

	cp filename{,.bak}   # 快速备份文件

	> xx.txt             # 快速生成空白文件

	netstat -tlnp        # 列出监听端口和PID

	cat /etc/issue       # 查看系统版本

	rm -f !(survivior.txt)  #删除所有文件除了survivior.txt

	ss -p                # 列出使用网络的apps

	dpkg -S /usr/bin/mysql # dpkg查找 属于哪个包

	ls -d */             #只列出文件目录

	mysqldump --add-drop-table --extended-insert --force --log-error=error.log -uUSER -pPASS OLD_DB_NAME | ssh -C user@newhost "mysql -uUSER -pPASS NEW_DB_NAME" # 导出远端服务器数据库

	tidy -xml -i -m [file]  # 格式化XML文件

	lspci -vv           #列出设备驱动

	which somecommand   #列出命令所在目录

	openssl pkcs8 -inform DER -nocrypt -in [priv key] -out [pem priv key]     #转换PKCS#8 private key to PEM format

	jstat -gc [jvmpid]    #jvm 垃圾收集统计

	ls -lrt               # 根据日期排序

	echo -n 'text to be encrypted' | openssl md5  #快速产生MD5值

	du -h  #display file & fold size recursively.

## commnads for MySQL cli

	export MYSQL_PS1="mysql://\u@\h:/\d - \R:\m:\s > "
