---
layout: post
title: "ubuntu下haproxy安装配置"
description: "在ubuntu10.04 上搭建基于http请求的haproxy"
category: Msic
keywords: ubuntu haproxy configuration
tags: [haproxy]
location: Suzhou, China
alias: [/Msic/2012/06/14/ubuntuhaproxy]
---

##安装：

	tar zxvf haproxy-1.4.13.tar.gz
	uname -a    ##查询linux内核版本
	make TARGET=linux26 PREFIX=/opt/etc/haproxy　　##我的系统内核为2.6，所以target=linux26
	make install PREFIX=/opt/etc/haproxy

##创建配置/opt/etc/haproxy.cfg

	global
	log         127.0.0.1 local0
	log         127.0.0.1 local1 notice
	maxconn     1024 # Total Max Connections. This is dependent on ulimit
	daemon
	nbproc      1 \# Number of processing cores/cpus.

	defaults
	log         global
	mode        http
	option      httplog
	option      dontlognull
	retries     3
	clitimeout  50000
	srvtimeout  30000
	contimeout  4000
	option      redispatch
	option      httpclose # Disable Keepalive
	listen  http_proxy 0.0.0.0:9999
	mode http
	stats enable
	stats uri /haproxy-status
	stats realm Haproxy\ statistics
	stats auth root:haproxy
	balance roundrobin # Load Balancing algorithm
	option forwardfor # This sets X-Forwarded-For
	option httpchk GET /index.html HTTP/1.0
	\# Define your servers to balance
	server jerkyll-ubuntu 127.0.0.1:4000 weight 1 maxconn 512 check
	server jerkyll-mac 10.0.43.58:4000 weight 1 maxconn 512 check

##启动haproxy.

	$./haproxy -f /opt/etc/haproxy/haproxy.cfg

##查看 haproxy stats  http://localhost:9999/haproxy-status

##配置日志：vi  /etc/rsyslog.d/haproxy.conf

	$ModLoad imudp                         \#haproxy 使用udp写日志，需要打开udpserver.
	$UDPServerRun 514
	$UDPServerAddress 127.0.0.1
	local0.* /opt/etc/haproxy/haproxy.log
	local1.* /opt/etc/haproxy/haproxy-1.log

##重启日志服务

	$./etc/init.d/rsyslog restart

