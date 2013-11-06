---
layout: post
title: "Riak Load-Balancing with HAPorxy"
description: "Riak使用HAProxy作集群负载均衡"
category: Riak
keywords: riak load-balancing haproxy
tags: [Riak] 
location: Suzhou, China
---

前几天写了一篇[Riak局域网环境下集群](http://timtang.me/blog/2013/10/26/riak-clustering-in-lan)的文章，下面介绍下使用HAProxy作为Riak cluster的负载均衡器的配置。

## 1- 准备工作
---

1- Brew安装HAProxy

    $ brew install haproxy

2- 搭建Riak clustering, 可以参考:[Riak局域网环境下集群](http://timtang.me/blog/2013/10/26/riak-clustering-in-lan)

## 2- 给出HAProxy配置文件的详细信息

   global
        log 127.0.0.1     local0
        log 127.0.0.1     local1 notice
        maxconn           256000
        spread-checks     5
        daemon
        quiet

    defaults
        log               global
        option            dontlognull
        option            redispatch
        retries           3
        option            allbackups
        maxconn           256000
        timeout connect   5000
        
    listen stats
        bind 0.0.0.0:9999
        mode http
        stats uri /
        stats realm Haproxy\ statistics
        stats auth root:haproxy
        stats refresh 2s

    backend riak_protocol_buffer_backend
       balance            leastconn
       mode               tcp
       option             tcpka
       option             srvtcpka
       server riak1 10.0.2.127:8087 weight 1 maxconn 1024  check
       server riak2 10.0.2.244:8087 weight 1 maxconn 1024  check
       server riak3 10.0.2.225:8087 weight 1 maxconn 1024  check

    frontend riak_protocol_buffer
       bind               127.0.0.1:8087
       mode               tcp
       option             tcplog
       option             contstats
       mode               tcp
       option             tcpka
       option             srvtcpka
       default_backend    riak_protocol_buffer_backend
 
> 以上是基于Riak Protocol Buffer接口的配置。

## 3- 配置基于Http API，在HAProxy配置文件中加入如下设置

    backend riak_rest_backend
       mode               http
       balance            roundrobin
       option             httpchk GET /ping
       option             httplog
       server riak1 10.0.2.127:8098 weight 1 maxconn 1024  check
       server riak2 10.0.2.244:8098 weight 1 maxconn 1024  check

    frontend riak_rest
       bind               127.0.0.1:8098
       mode               http
       option             contstats
       default_backend    riak_rest_backend

## 4- 启动HAProxy服务器并查看HAProxy状态

    $ haproxy -f <HAPROXY-CONF-FOLDER>/haproxy.cfg

> 打开浏览器访问[http://localhost:9999](http://localhost:9999) 可以查看HAProxy的详细统计,每2s会刷新一次。

## 5- 维护HAProxy后端的Riak node, 我们可以使用[socat](http://www.dest-unreach.org/socat/)
    
    ## Disable riak node in HAProxy
    $ echo "disable server <backend>/<riak_node>" | socat stdio /etc/haproxy/haproxysock

    ## Enable riak node in HAProxy
    $ echo "enable server <backend>/<riak_node>" | socat stdio /etc/haproxy/haproxysock

> 后续有时间再写一些Riak的一些原理和维护方面的东西，Cheers!
