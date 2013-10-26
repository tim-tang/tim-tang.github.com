---
layout: post
title: "Riak Cluster In LAN"
description: "Riak局域网环境下集群"
category: Riak
keywords: riak clustering lan 
tags: [Riak] 
location: Suzhou, China
---

很久没写博客了，最近用到Riak就写篇这方面相关的东西吧。具体特性和其它NoSQL的比较就不在这里介绍，大家可以看官方文档[Riak Doc](http://docs.basho.com/riak/latest/),这里主要关注Riak在局域网环境下的集群和性能情况。

## 1- 准备工作
---

1- 通过brew安装

    $ brew install riak

2- 设置ulimit参数

    $ ulimit -n 1024
    #If you want to set the limit for future sessions, use launchctl
    $ launchctl limit maxfiles 1024 1024    

> 具体的ulimit 参数可以根据你的内存情况调整.

## 2- 在局域网中的不同机器中配置Riak server节点
---

1- 找出Riak的安装位置 
    
    $ brew info riak
    riak: stable 1.4.2
    http://basho.com/riak/
    /usr/local/Cellar/riak/1.4.2 (3055 files, 4.2G) *
      Built from source
      From: https://github.com/mxcl/homebrew/commits/master/Library/Formula/riak.rb

2- 修改$RIAK_HOME/etc/app.config
   
    {http, [ {"127.0.0.1", 8098 } ]} 改为 {http, [{"<YOUR_HOST_IP>", 8098 }]}
    {pb, [ {"127.0.0.1", 8087 } ]} 改为 {pb, [ {"<YOUT_HOST_IP>", 8087 } ]}

3- 修改$RIAK_HOME/etc/vm.args

    -name riak@127.0.0.1
    改为
    -name riak@<YOUR_HOST_IP>

> 在你局域网中的另一台Riak node重复做如上配置。当然我们这里也可以用机器的domain name来替代IP.

## 3- 下面可以进行两台机器的集群操作
---

1- 启动两台Riak server
    
    $ riak start

2- 通过riak-admin命令将一个riak节点B加入到另一个节点A,形成cluster

    $ riak-admin cluster join riak@<YOUT_HOST_IP_A>

3- 形成Riak cluster plan然后提交cluster plan

    $ riak-admin cluster plan
    $ riak-admin cluster commit

4- 查看集群状态

    $ riak-admin status | grep ring_members
    $ riak-admin member_status

> 当让你也可以通过Riak Control这样的web tool来管理Clustering, 具体的使用可以参考[Riak Control](http://docs.basho.com/riak/latest/ops/advanced/riak-control/)

5- 关于Riak 在单机上的集群方式

- 4- Riak再单机上的集群可以参考[Five Minute Install](http://docs.basho.com/riak/latest/quickstart/).

## 一些有用的Riak的参考收集(这些资料非常有用,对理解Riak的实现和原理及使用有很大帮助)

- [Basic Riak Cluster](http://docs.basho.com/riak/latest/quickstart/)
- [Riak Basic Usage](https://github.com/basho/riak-java-client/wiki/Cookbook)
- [Riak Concepts](http://docs.basho.com/riak/latest/theory/concepts/)
- [Riak Video](http://vimeo.com/bashotech/videos/sort:date)
- [Useful Riak Http Query API](http://docs.basho.com/riak/latest/dev/references/http/)
- [Riak Load Testing Sample Data](http://docs.basho.com/riak/1.4.0/references/appendices/Sample-Data/)
- [Useful Riak Tools](http://docs.basho.com/riak/latest/dev/advanced/community-projects/)
- [Riak Load Balancing and Proxy Configuration](http://docs.basho.com/riak/latest/ops/advanced/configs/load-balancing-proxy/)
- [Riak Operating Riak FAQs](http://docs.basho.com/riak/latest/community/faqs/operations/)
- [Riak Configuration File](http://docs.basho.com/riak/latest/ops/advanced/configs/configuration-files/) - [Riak Log With Lager](https://github.com/basho/lager)
- [Riak Vector Clock](http://docs.basho.com/riak/latest/theory/concepts/Vector-Clocks/)
- [Riak-CLI-Riak](http://docs.basho.com/riak/latest/ops/running/tools/riak/)
- [Riak-CLI-RiakAdmin](http://docs.basho.com/riak/latest/ops/running/tools/riak-admin/)
- [Riak-CLI-SearchCMD](http://docs.basho.com/riak/latest/ops/running/tools/search-cmd/)
- [Riak-BackUp](http://docs.basho.com/riak/latest/ops/running/backups/)
- [Riak-Load-Balancing-With-HAProxy](http://docs.basho.com/riak/1.3.1/cookbooks/Load-Balancing-and-Proxy-Configuration/)
- [Riak-Eventual-Consistency-Video](http://vimeo.com/52371780)
- [Riak FAQs](http://docs.basho.com/riak/latest/community/faqs/)
- [Riak Control Cluster Nodes](http://docs.basho.com/riak/latest/ops/advanced/riak-control/)
- [Riak-Cluster-On-Seperate-Machine](http://docs.basho.com/riak/1.3.2/cookbooks/Basic-Cluster-Setup/#Add-a-Second-Node-to-Your-Cluster)

> Riak clustering 环境的下压力,容错,性能方面的介绍等有空再写了,Cheers!
