---
layout: post
title: Ubuntu11.10,MongoDB安装测试
description: Ubuntu11.10,MongoDB安装测试
key: []
---
下面简单介绍下MongoDB在Ubuntu上的安装:

 - 下载MongoDB，从[MongoDB官方网站][1]
 - 解压下载文件：
<pre>
tar xzf mongodb-linux-i686-2.0.0.tgz
</pre>
 - 创建数据存放目录：
<pre>
$sudo mkdir -p /data/db/
$sudo chown id -u /data/db
</pre>
 - 运行mongodb server:
<pre>
$./mongodb-linux-i686-2.0.0/bin/mongod
</pre>
 - 启动MongoDB自带的客户端：
<pre>
$ ./mongodb-linux-i686-2.0.0/bin/mongo
</pre>
 - 执行如下测试:
<pre>
db.foo.save( { a : 1 } )
db.foo.find()
{ "_id" : ObjectId("4eae68e06fad58973cf5f17b"), "a" : 1 }
</pre>

>正确显示查询结果即可  (原创文章)

  [1]: http://www.mongodb.org "MongoDB"
