---
layout: post
title: "NodeJs部署在Ubuntu使用Upstart和Monit"
description: "在Ubuntu上部署NodeJS应用使用Upstart和Monit配置服务"
category: NodeJS
keywords: nodejs, ubuntu, upstart, monit 
tags: [NodeJS] 
location: Suzhou, China
---

最近在做一个应用用到了NodeJS, 部署的时候遇到了比较多的问题，纪录一下用来备忘。目前部署在ubuntu上，可以借助很多有用的工具如Upstart/Monit等。在部署中尽量做到自动化，避免重复劳动。

##前提条件
 
- Ubuntu安装完成
- Ubuntu上的一些常用工具：openssh-server/curl/wget已经安装

## 1- 安装 Redis在/opt目录
    
    $cd /opt
    $wget http://redis.googlecode.com/files/redis-2.4.6.tar.gz 
    $tar -zxf redis-2.4.6.tar.gz 
    $cd redis-2.4.6 
    $make 
    $sudo make install
//TODO:




