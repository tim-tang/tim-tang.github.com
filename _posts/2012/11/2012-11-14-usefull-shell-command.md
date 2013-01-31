---
layout: post
title: "Useful shell command for Ubuntu/MAC"
description: "Note some useful shell commands."
category: Msic
keywords: shell ubuntu mac command
tags: [Shell]
location: Suzhou, China
alias: [/Msic/2012/11/14/usefull-shell-command]
---
Note useful shell commands for both Mac OSX and Ubuntu.

## Commands for system monitor

	curl ifconfig.me   #机器内网，查看外网ip
	lsof -i       #查看网络服务的状态
	dd if=/dev/zero of=testfile obs=1M count=512 conv=sync  #测试硬盘读写速度
	hdparam -t  /dev/sda  ＃测试硬盘
	hdparam -T  /dev/sda  #测试内存
	sudo iotop     # 监控磁盘io
	vmstat 1       # 监控cpu/memory/io

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

	netstat -tunlp|grep 80     # 查看 http server started.
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
	tidy -xml -i -m [file]  # 格式化XML文件
	lspci -v           #列出设备驱动
	which somecommand   #列出命令所在目录
	openssl pkcs8 -inform DER -nocrypt -in [priv key] -out [pem priv key]     #转换PKCS#8 private key to PEM format
	jstat -gc [jvmpid]    #jvm 垃圾收集统计
	ls -lrt               # 根据日期排序
	echo -n 'text to be encrypted' | openssl md5  #快速产生MD5值
	du -h  #display file & fold size recursively.

## Commnads for MySQL cli

	export MYSQL_PS1="mysql://\u@\h:/\d - \R:\m:\s > "
    # 导出远端服务器数据库
	mysqldump --add-drop-table --extended-insert --force --log-error=error.log -uUSER -pPASS OLD_DB_NAME | ssh -C user@newhost "mysql -uUSER -pPASS NEW_DB_NAME"

> Cheers!
