---
layout: post
title: "Rake从MySQL向Mongo GridFS迁移图片数据"
description: "使用Rake将文件系统和MySQL中的图片数据迁移到GridFS中"
category: MongoDB
keywords: rake mongodb mysql gridfs
tags: [MongoDB]
location: Suzhou, China
alias: [/MongoDB/2012/05/25/rakemysqlmongo-gridfs]
---

为了将来Everyday CMS的数据库切换到MongDB准备，这就涉及到了历史遗留数据的迁移尤其是图片，目前目前存储在文件系统上，下面使用Rake将文件系统种的图片导入GridFS.

##修改遗留系统中的Gemfile,增加

	gem 'mongo'
	gem 'mongoid'
	gem 'bson_ext'

##生成config/mongoid.yml在这里配置MongoDB连接

	$ rails g mongoid:config

##创建mongo_import.rake文件，存放在lib/tasks目录下

##下面看具体的mongo_import.rake文件内容,看代码注释:[mongo_import.rake][1]

##下面运行rake gridfs:import就导入图片文件了,注意MongoDB已经启动了！

> 其他的数据导入，也可以仿照类似的方式实现，Cheers!

 [1]: https://github.com/tim-tang/everyday/blob/master/lib/tasks/mongo_import.rake
