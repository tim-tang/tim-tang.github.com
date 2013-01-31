---
layout: post
title: "XML,JSON转换存MongoDB"
description: "使用Crack/JSON Gem将XML文件转换成JSON并存入MongoDB,"
category: MongoDB
keywords: mongodb json xml
tags: [Ruby, MongoDB]
location: Suzhou, China
alias: [/MongoDB/2012/05/22/xmljsonmongodb]
---

最近项目用到xml和json的转换，于是想到了如何用ruby来实现这个功能，下面介绍下如何实现：

##安装XML转JSON需要的RubyGems

	$ gem install json
	$ gem install crack

##安装存储MongoDB所需要的RubyGems

	$ gem install mongo
	$ gem install bson_ext

##具体的代码实现

    #encoding:utf-8
	require "crack"
	require "json"
	require "mongo"
	myXML = Crack::XML.parse(File.read("/home/tim-tang/OFBProductCategory1.xml"))
	myJSON = myXML.to_hash
	connection = Mongo::Connection.new("localhost", 27017)
	db = connection.db("tim-db")
	coll = db.collection("products")
	coll.save(myJSON)

##对MongoDB的安装和使用有疑问的可以看Ubuntu11.10,MongoDB安装测试

> 使用ruby现有的类库来操作XML&JSON，相对来说比java方便很多!

