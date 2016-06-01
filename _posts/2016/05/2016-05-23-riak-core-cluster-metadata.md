---
layout: post
title: "Riak Core Cluster Metadata"
description: "Riak Core Cluster Metadata Internal"
category: Riak Core 
keywords: Cluster MetaData Riak Core
tags: [Riak Core]
location: Suzhou, China
---

Riak Core的cluster metadata主要用于存储全局的(cluster wide)的元数据信息，在Riak Core内部主要用来存储bucket property 和 [riak_core_security](https://github.com/basho/riak_core/blob/develop/src/riak_core_security.erl) 模块所依赖的相关元数据信息。对于开发者来说,可以使用这个特性来帮助你实现基于riak core开发的子系统，具体的描述细节和使用就不介绍了可以看Little Riak Core Book中的[Riak Core Metadata](https://marianoguerra.github.io/little-riak-core-book/riak_core_metadata.html)章节，注意下里面提到的Pitfall.

## 模块结构
---

- API模块: [riak_core_metadata](https://github.com/basho/riak_core/blob/develop/src/riak_core_metadata.erl)
- HashTree模块: [riak_core_metadata_hashtree](https://github.com/basho/riak_core/blob/develop/src/riak_core_metadata_hashtree.erl) 每个节点上都会存一个Hashtree, 具体的HashTree信息存在于内存和eleveldb内部，通过eleveldb的snapshot特性来提供这种copy-on-write的更新。具体为什么选择HashTree? 如何compare/update HashTree?这些可以直接看HashTree的2个实现模块: [hashtree](https://github.com/basho/riak_core/blob/develop/src/hashtree.erl), [hashtree_tree](https://github.com/basho/riak_core/blob/develop/src/hashtree_tree.erl), 里面的注释写得非常详细，再结合看这个链接[Riak Core HashTree结构](https://github.com/basho/riak_core/blob/develop/docs/hashtree.md)

![cluster metadata](/images/post/riak_core_cluster_metadata.png)

- [riak_core_broadcast_handler](https://github.com/basho/riak_core/blob/develop/src/riak_core_broadcast_handler.erl) behaviour 和 [riak_core_metadata_exchange_fsm](https://github.com/basho/riak_core/blob/develop/src/riak_core_metadata_exchange_fsm.erl): 用于和其他peer节点交换，metadata信息。

## Reference
---

- [Cluster Meta](https://gist.github.com/jrwest/d290c14e1c472e562548#36-removing-metadata-hashtree-files)
- [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree)

> 这块的实际应用中会少些，就不详细介绍了，Cheers!

