---
layout: post
title: "Node.js应用部署在Ubuntu使用Upstart和Monit"
description: "在Ubuntu上部署NodeJS应用使用Upstart和Monit配置服务"
category: NodeJS
keywords: node.js, ubuntu, upstart, monit 
tags: [NodeJS] 
location: Suzhou, China
---

最近在做一个应用用到了Node.js, 部署的时候遇到了比较多的问题，纪录一下用来备忘。目前部署在ubuntu上，可以借助很多有用的工具如Upstart/Monit等。在部署中尽量做到自动化，避免重复劳动。

## 前提条件

- Ubuntu安装完成
- Ubuntu上的一些常用工具和服务：openssh-server/curl/wget/git/redis-server已经安装

## 1- 安装 Node.js使用apt

    $sudo apt-get install -y python-software-properties
    $sudo add-apt-repository ppa:chris-lea/node.js
    $sudo apt-get update
    $sudo apt-get install -y nodejs
    $node -v     # 检查是否成功安装

## 2- 安装npm

    $curl http://npmjs.org/install.sh | clean=no sh

> 默认情况下会安装npm到 /usr/bin目录.

## 3- 设置NODE_ENV环境变量

    $echo 'export NODE_ENV="production"' >> ~/.profile


## 4- 安装foreman用于部署node.js应用

    $npm install -g foreman

## 5- 使用foreman生成ubuntu upstart job

    $sudo nf export -o /etc/init 
    
> 这个命令需要在工程目录中执行，它会根据procfile生成相应的upstart 配置。

## 6- 进入/etc/init修改上面生成的foreman.conf文件,增加

    pre-start script
      echo $$ > /var/run/foreman.pid
    end script

    post-stop script
      rm /var/run/foreman.pid
    end script

> 方便检查服务状态

## 7- 这样我们就可以使用如下命令来控制服务

    sudo start foreman
    sudo restart foreman
    sudo stop foreman

## 8- 接下来我们安装配置Monit来监控服务状态，服务意外停止的时候，帮助它自动重启

    $sudo vi /etc/monit/monitrc

增加如下设置:

    check process foreman with pidfile /var/run/foreman.pid
      start program = "/sbin/start foreman"
          stop program  = "/sbin/stop foreman"
              if failed port 5000 protocol HTTP
                   request /
                   with timeout 10 seconds
              then restart

使设置生效：

    $monit -d 60 -c /etc/monit/monitrc

监控monit服务状态：

    $monit status

> Monit 服务会每60秒，检查一次服务时候正常，如果有异常，就自动重启服务。

## 9- 设置SSH authorized keys 修改/etc/sudoer文件

1- SSH免密码登陆，方便自动化部署，参考[Linode Ubuntu 环境设置最佳实践](http://timtang.me/blog/2013/02/02/linode-ubuntu-best-practise/)

2- 让指定用户sudo命令无须密码，方便自动化部署, 参考[Mac sudo without password](http://timtang.me/blog/2013/01/30/sudo-without-password/)

## 10- 自动化的部署使用deploy shell脚本, 我使用了一个github上的开源脚本

    $curl -O https://raw.github.com/visionmedia/deploy/master/bin/deploy
    $chmod +x ./deploy
    $vi deploy.conf

增加如下配置：
    
    [ubuntu]
    user lilyhe
    host <YOUR HOST ADDRESS>
    repo <YOUR GITHUB REPO>
    ref origin/master
    path /home/tim.tang/Documents/app
    post-deploy npm install && sudo stop foreman && sudo start foreman
    test sleep 1 && curl localhost:500) >/dev/nul

deploy脚本的使用：

    $./deploy -h

> 这样就可以自动部署到远程服务器了。还有一些关于Node.js的实践分享等有时间整理以后再和大家分享。Cheers! 
