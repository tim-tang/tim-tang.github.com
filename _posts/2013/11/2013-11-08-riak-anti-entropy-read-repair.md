---
layout: post
title: "Riak Anti-Entropy and Eventual Consistency分析"
description: "分析Riak Anti-Entropy and Eventual Consistency原理"
category: Riak
keywords: riak replication partition 
tags: [Riak] 
location: Suzhou, China
---

接上篇[Riak Replication and Partition原理解析](http://timtang.me/blog/2013/11/07/riak-replication-partition-analysis/),这篇介绍Riak另两个核心的概念[最终一致性(Eventual Consistency)](http://docs.basho.com/riak/latest/theory/concepts/Eventual-Consistency/)和Anti-Entropy.

## 为什么会出现Riak Sibling?
---

- 在介绍Eventual Consistency之前我们先要了解Riak中Vclock的概念，

    ```
    Riak中使用Vclock来做数据的版本控制，但是当出现并发的读写时，不同用户可能拥有相同的Vclock，这个时候就会出现冲突，那么Riak时如何来处理这种冲突的呢？
    ```

![riak-vclock](/images/post/riak-vclock.png)

> 当Angel和Wade同时修改Tim的记录时，出现了vclock的冲突，这时Riak会保存Angel和Wade的修改，在Riak中以sibling的形式存在，而这种冲突的解决是交给应用层来解决，Riak本身不会去处理这种冲突。

- 谈到了Vclock我们还需要注意vclock explosion的出现(当大量更新某一个对象的时候发生),可以通过[Vclock Pruning](http://docs.basho.com/riak/latest/theory/concepts/Vector-Clocks/#Vector-Clock-Pruning)来解决这个问题，

- 同时还要预防Sibling Explosion,要即使处理Riak中的冲突.

## Eventual Consistency如何实现？
---

- Riak 提供了最基本的一致性策略_last_write_wins_但这种策略使用场景比较有限。

- Riak 最重要的一致性实现是通过[Read Repair](http://docs.basho.com/riak/latest/theory/concepts/Replication/#Read-Repair)来做的,在每次读取数据的时候会更新不同虚拟节点上的数据备份.这样即使在写的时候不能保证数据在每个replication上是一致的，但只要是读取，就能取到最新一致的数据。

- Hinted-Handoff Riak 集群中当某个节点fail，所有请求这个节点的数据都会通过hinted handoff的机制转移到其它节点上，当节点回复hinted-handoff 自动启动将之前委托节点的数据转移回来,这样就保证了高度的可用性。 

> 详细的eventual consistency 方面的容错处理可以看官方文档[Eventual Consistency](http://docs.basho.com/riak/latest/theory/concepts/Eventual-Consistency/),这里就不再重复了！

## 什么是Anti-Entropy?
---

- Anti-Entropy是一个后台的进程，会持续的比较和修复不同节点之间的数据。  

- 它通过[Merkle Tree](http://en.wikipedia.org/wiki/Merkle_tree)这种数据结构来把数据构建成一棵hash tree,存储在硬盘上(为了避免服务器重启造成的数据丢失,同时可以节省内存)，用于比较和验证不同节点之间的数据完整性。

- Riak 会周期性的删除硬盘上的[Merkle Tree](http://en.wikipedia.org/wiki/Merkle_tree)并重新根据K/V data来重新计算生成。它的清理周期是可配置的具体的信息查看你的Riak _app.conf_

## 即将发布的Riak2.0中的一些新特性
---

- 新增加了CRDT数据类型:Sets, maps, registers, and flags.

- 可以让开发人员自己选择需要强一致性或者是最终一致性，不用去计算节点数来确定R/N/W了.

- 简化了Riak的配置，不再使用Erlang语法作为配置文件.

- 提供了自动化的部署工具，在全文检索方面和Solr做了更好的集成.

> 更多的新特性方面的介绍可以看[Introducing Riak 2.0](http://basho.com/introducing-riak-2-0/)

## 最后推荐两本Riak的书籍
---

- [Riak Handbook](https://dl.dropboxusercontent.com/u/82042116/Riak%20Handbook.pdf)

- [A Little Riak Book](http://littleriakbook.com)

- [Node.js中实现MongoDB的两阶段提交](http://www.cnodejs.org/topic/5070492b01d0b80148dc45f8)

> Riak 在运维上的优越性和0宕机的高可用性，是我们选择它的重要原因 Cheers!

