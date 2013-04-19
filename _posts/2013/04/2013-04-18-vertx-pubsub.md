---
layout: post
title: "Vertx.io Introduction"
description: "Vertx.io开发及性能介绍"
category: J2EE 
keywords: vertx,websocket
tags: [Vertx.io] 
location: Suzhou, China
---

写了一个基于[Vertx.io](http://vertx.io)的pub/sub的sample,拿出来吹一下，具体的代码在GitHub上[vertx-pubsub](https://github.com/tim-tang/vertx-pubsub),下面介绍下Vertx.io的一些功能。

## Vertx.io的特性：
---

- Asynchronous、Event-driven、Non-blocking I/O，建立快速、高延展性（scalable）的应用
- 多种编程语言的集成， JavaScript, CoffeeScript, Ruby, Python, Groovy or Java

## Java版本的Node.js
---

- 大家都知道java就像一个老旧的城市，路过的人看一眼就想把他推倒重建，但是走近一看还是有很多智慧型的东西，只有你深入了解才能发现这座老旧的城市有很多活力四射的新街区，就像很多敏捷的开发者喜欢用[Ruby On Rails](http://www.grails.org), Java的敏捷开发者也可以利用[Grails](http://www.grails.org)来享受这种快速开发带来的利益。而[Vert.io](http://vertx.io)带来了Java非同步网站开发的方式。这是Java版本的Node.js, 它构建再[Jboss Netty](http://netty.io)之上。
-  Java 7 更提供增強的File I/O （NIO.2），开始提供Asynchronous I/O、Socket Channel API 等特性，在 Java VM 的基础上打造高效HTTP/Socket 已经触手可及。而我们老旧的apache/jetty等服务器，由于历史原因无法一时出现高效的演变。

## Vertx.io 核心:
---

- TCP/SSL servers and clients
- HTTP/HTTPS servers and clients
- WebSockets servers and clients
- Accessing the distributed event bus
- Periodic and one-off timers
- Buffers
- Flow control
- Accessing files on the file system
- Shared map and sets
- Logging
- Accessing configuration
- Writing SockJS servers
- Deploying and undeploying verticles

## 利用pub/sub的sample做了一个简单的压力测试
---

_硬件环境_
- Processor  1.8 GHz Intel Core i5 
- Memory  4 GB 1600 MHz DDR3
- SSD 128GB

_场景_：
- 1 user有1000个朋友,保存消息，并发送给朋友，使用mongodb存储。
- 100个并发请求

_结果_:

    $ siege -c100 -d1 -r100 http://localhost:8080/post

    Transactions:          10000 hits
    Availability:         100.00 %
    Elapsed time:          63.25 secs
    Data transferred:           0.57 MB
    Response time:          0.01 secs
    Transaction rate:         158.10 trans/sec
    Throughput:         0.01 MB/sec
    Concurrency:            0.83
    Successful transactions:       10000
    Failed transactions:               0
    Longest transaction:            0.19
    Shortest transaction:           0.00

- 具体的代码的运行，可以参考:<https://github.com/tim-tang/vertx-pubsub>
- Vertx开发环境可以看：[vertx集成eclipse开发环境搭建](http://timtang.me/blog/2013/04/13/vertx-eclipse-dev/)

> 结果还不错，没有和node.js做对比，应该不会差！ Cheers!
