---
layout: post
title: "MongoDB Auto-Sharding初探"
description: "Mongodb提供了Auto-Sharding的功能，通过简单的配置就可以很方便地构建一个分布式MongoDB集群"
category: MongoDB
keywords: mongodb auto sharding
tags: [MongoDB]
location: Suzhou, China
alias: [/MongoDB/2012/05/28/mongodb-auto-sharding]
---
  MongoDB最近在项目种使用比较频繁，所以最近些这方面的东西比较多，下面我们看看MongoDB的Auto-Sharding提供了什么?

 - Reblancing当各Sharding间负载和数据分布不平衡时自动触发
 - 可以简单方便的添加和删除节点
 - 通过Replica Set 作自动的failover处理
 - 可以横向扩展至上千台节点

###一个MongoDB的Auto Sharding由三部分组成：

 - Shard: 即存储实际数据的分片，每个Shard可以是一个mongod实例，也可以是一组mongod实例构成的Replica Set
 - Config Servers: 用来存储所有shard节点的配置信息,每个chunk的shard key范围,chunk在各shard的分布,该集群中所有DB和collection的sharding配置
 - Routing Process: 它相当于一个透明代理，接收来自客户端的查询或更新请求，然后询问Config Servers需要到哪个Shard上查询或保存记录，再连接相应的Shard进行操作，最后将结果返回给客户端。

> 下面搭建一个简单的MongoDB的集群，包括：两个Shards，一个Config Server和一个Routing Process

##创建两个Shards和一个Config Server数据目录

	$sudo mkdir -p /data0/mongo/shard1 /data0/mongo/shard2 /data0/mongo/config

##启动两个mongod进程作为Shard，一个mongod进程作为Config Server，一个mongos进程作为Routing Process

	$sudo ./software/mongodb-linux-i686-2.0.0/bin/mongod --port 27017 --fork --logpath ~/mongo_shard1.log --dbpath /data0/mongo/shard1 --shardsvr
	$sudo ./software/mongodb-linux-i686-2.0.0/bin/mongod --port 27018 --fork --logpath ~/mongo_shard2.log --dbpath /data0/mongo/shard2 --shardsvr
	$sudo ./software/mongodb-linux-i686-2.0.0/bin/mongod --port 27217 --fork --logpath ~/mongo_config.log --dbpath /data0/mongo/config --configsvr
	$sudo ./software/mongodb-linux-i686-2.0.0/bin/mongos --port 27417 --fork --logpath ~/mongos.log --configdb 127.0.0.1:27217 --chunkSize 10

> chunkSize这一项是用来指定chunk的大小的，单位是MB，默认大小为200MB

##登录到mongos，添加Shard节点

	$mongo --port 27417
	\> use admin;
	\> db.runCommand({addshard:"127.0.0.1:27017"})
	\> db.runCommand({addshard:"127.0.0.1:27018"})

##我们为数据库tim-db启用sharding, 将其中的event collection的shard key 设置为{_id:1},更多关于shard key的介绍，可以查看[Choosing A Sharding Key][1]

	\> db.runCommand({enablesharding:'tim-db'});
	\> db.runCommand({shardcollection:"tim-db.event", key:{_id:1}});

##到这里我们些一个ruby脚本来测试

	#encoding:utf-8
	require "mongo"
	connection = Mongo::Connection.new("localhost", 27417)
	db = connection.db("tim-db")
	coll = db.collection("event")
	1.upto(100000) do |i|
	  myJSON = {"name" => "MongoDB", "type" => "database", "count" => i,"created_at"=>(Time.now()+(i*3600))}
	  puts myJSON
	  coll.save(myJSON)
	end

> 我们可以通过db.event.stats()名录来查看两个sharding具体的数据情况，OK， good luck!

[1]:http://www.mongodb.org/display/DOCS/Choosing+a+Shard+Key
