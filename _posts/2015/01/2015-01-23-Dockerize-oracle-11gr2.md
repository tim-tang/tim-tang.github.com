---
layout: post
title: "Dockerize Oracle11gR2 DB"
description: "Docker基于OracleLinux 6.6 image安装Oracle11gR2."
category: docker
keywords: Docker Oracle11gr2
tags: [Docker]
location: Suzhou, China
---

最近bug很多而且每个bug所在的版本和所依赖的环境都不同,每次fix bug都需要花费很多的时间在卸载安装配置环境上,效率及其低下,而且重复劳动 很多,想到了可以将我的本地开发环境docker化,这样可以重复利用而且可以解开服务之间的依赖,版本化,同时可以建立私有的registry, 来分享给同事使用,可以很完美的解决我遇到的问题, 下面就介绍下Docker container中安装Oracle 11gR2数据库.

## 前提条件
----

- Docker已经安装,这里不在废话,网上各种教程
- 准备好Oracle11gR2的安装文件(Linux 版本)

## 安装步骤
----

Clone 我的dockerfile, 并进入工程dockerfiles/oracle11gr2目录, 记得把你的oracle安装文件也解压到这个目录下!

    $ git clone https://github.com/tim-tang/dockerfiles.git  
    $ docker pull oraclelinux:6.6  # 下载 Oracle Linux 6.6 image

> 注意在开始安装前你需要修改下 set_root_pw.sh和db_install.rsp文件, 把你自己的container和数据库密码填上!

    $ docker build -t localhost:5000/orcl11g .  # build 你自己的image
    $ df -h  # 查看下你的tempfs mount的文件大小不能低于db_install.rsp中的oracle.install.db.config.starterdb.memoryLimit=512, 安装时会检查
    $ sudo docker run --privileged -h orcl11g.cn.oracle.com -d -p 0.0.0.0:2222:22 -p 11521:1521 -v /dev/shm:/dev/shm -v /dockerfiles:/dockerfiles -t localhost:5000/orcl11g # 启动容器
    $ ssh -p 2222 root@localhost #登陆container使用你之前设置的root用户密码

> 下面我们cd到/dockerfiles/oracle11gr2目录来安装oracle db.

    $ su - oracle
    $ cd  /dockerfiles/oracle11gr2/database
    $ ./runInstaller -debug -silent -force -waitforcompletion -ignorePrereq -responseFile /dockerfiles/oracle11gr2/response/db_install.rsp

> 等待安装完成, 使用root用户执行如下oracle自带配置脚本

    $ su root
    $ sh /opt/app/oraInventory/orainstRoot.sh
    $ sh /opt/app/oracle/product/11.2.0/db_1/root.sh
    $ sqlplus sys/rootme99@orcl as sysdba #测试安装

> 顺带提一下如果你是通过boot2docker来安装,那就需要配置virtualbox的端口映射了, 否则Host主机是访问不到11521端口的.

    $ docker commit -m='bla bla bla'  <CONTAINER_ID> localhost:5000/orcl11g
    $ boot2docker stop   # 这里注意一定要commit你的container再stop, 
    $ VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port11521,tcp,,11521,,1521”

> 这里如果你有Registry repository可以直接push到registry上让别人也可以使用!

最后还要修改下__/etc/oratab__ 文件方便下次重启，修改如下：

    orcl:/opt/app/oracle/product/11.2.0/db_1:Y

> 把N改成Y, 以后直接用dbstart起服务的时候比较方便！

## 一些不错的参考资料
---

- http://fabiokung.com/2014/03/13/memory-inside-linux-containers/
- [docker资源管理](http://segmentfault.com/blog/yexiaobai/1190000000681188#fnref:footnote2)
- http://blog.liuts.com/post/242/

> Cheers!
