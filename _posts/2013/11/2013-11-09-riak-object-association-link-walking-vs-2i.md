---
layout: post
title: "Riak对象关系管理Link Walking vs. 2i"
description: "Riak对象关系管理使用Link Walking, 2i(Secondary Index)策略的比较"
category: riak
keywords: riak link walking 2i secondary index
tags: [Riak] 
location: Suzhou, China
---

NoSQL数据库在处理对象关系的时候比较头痛，下面我们在Riak中分别使用[Link Walking](http://docs.basho.com/riak/latest/dev/using/link-walking/)/[2i(Secondary Index)](http://docs.basho.com/riak/latest/dev/using/2i/)来处理**One-To-Many**模型关系,来看看他们之中哪个是最佳解决方案。

## 假设场景
---

- 存在User和Tweet两个model, 它们之间是One-To-Many的关系。


## 使用[Link Walking](http://docs.basho.com/riak/latest/dev/using/link-walking/)
---

- Riak需要在User方存储完整的link path, tag还有tweet的key.

- 如果User还和另外多个model存在One-To-Many关系的话, 每一个link都需要有与子model对应的相同的tag(用来区分不同的子model).

- 当你需要找出某个User下面所有的Tweets的时候，需要先找到指定User，然后根据links找到所有的Tweet。

- 由于link是没有被索引过的，Riak查找的时候需要根据link walking 查询条件一个个匹配,速度较慢。

- 当你需要给User添加/删除一条新的Tweet的时候，每次都需要修改User，给它添加或删除一个link。然后再添加/删除Tweet.

> 由此看来这并非最好的处理One-To-Many关系的策略。

## 使用[2i(Secondary Index)](http://docs.basho.com/riak/latest/dev/using/2i/)
---

- Riak只需要再Tweet中存User的key作为2i，节约了大量的储存空间(在大数据的情况下)，

- 最有效率的地方在于查找，当你需要找出某个User下所有Tweets的时候，只需要拿user-key直接在Tweet上根据2i查询即可，由于已经索引过user-key查询效率非常高。

- 当需要更新／删除Tweet的时候，直接更新／删除即可。

- 我们可以在增加复杂度，如果一条Tweet被多个User使用，这样就出现了Many-To-Many的情况，这时我们只需要放多个user-keys在Tweet上，还不需要考虑user-key是否重复，因为Riak index会帮你处理。 

> 由此看来2i(Secondary Index)来管理对象关系是最佳的策略。

## 推荐阅读
---

- [NoSQL 数据建模技术](http://coolshell.cn/articles/7270.html)

> 当然我们也经常在NoSQL中使用composite-key来处理特定的业务模型，这个在某些场景下是非常有效和方便，主要看你如何来灵活制定混合主键的生成策略. Cheers!


