---
layout: post
title: Ubuntu,Memcached安装监控
description: Ubuntu,Memcached安装监控
category: Ubuntu
keywords: ubuntu memcached monitor
tags: [Memcached]
location: Suzhou, China
alias: [/Ubuntu/2011/10/27/ubuntu-memcached]
---
有于rails自身提供的page cache/action cache/fragment cache的缓存策略不够灵活，主要是生成缓存的html文件，所以考虑在后台加上数据缓存，首选肯定是memcached,下面先介绍下memcached在ubuntu上的安装和监控：

##Memcached 安装：

	sudo apt-get install memcached
	memcached -d -m 64 -p 11211 -u root --启动memcached server

##参数说明：

    -m 指定使用多少兆的缓存空间；
    -p 指定要监听的端口；
    -u 指定以哪个用户来运行 
##具体的启动项配置可以在这里找到：/etc/memcached.conf

**监控Memcached服务器**

	$ telnet 127.0.0.1 11211
	> stats
![alt text][1]

##参数说明:

    STAT pid 18006
    STAT uptime 702   //memcached运行的秒数
    STAT time 1292904537 //memcached服务器所在主机当前系统的时间，单位是秒。
    STAT version 1.4.5
    STAT pointer_size 64  //服务器所在主机操作系统的指针大小，一般为32或64
    STAT rusage_user 0.003999
    STAT rusage_system 0.013997
    STAT curr_connections 10   //表示当前的连接数
    STAT total_connections 11   //表示从memcached服务启动到当前时间，系统打开过的连接的总数。
    STAT connection_structures 11  //服务器分配的连接构造数
    STAT cmd_get 0   //查询缓存的次数，平均每秒缓存次数cmd_get/uptime
    STAT cmd_set 0   //设置key=>value的次数
    STAT cmd_flush 0
    STAT get_hits 0  //缓存命中的次数，缓存命中率=get_hits/cmd_get*100%
    STAT get_misses 0  //cmd_get-get_hits
    STAT delete_misses 0   delete未命中次数
    STAT delete_hits 0    delete命中次数
    STAT incr_misses 0  总未命中次数
    STAT incr_hits 0
    STAT decr_misses 0
    STAT decr_hits 0
    STAT cas_misses 0
    STAT cas_hits 0
    STAT cas_badval 0
    STAT auth_cmds 0
    STAT auth_errors 0
    STAT bytes_read 7  //memcached服务器从网络读取的总的字节数
    STAT bytes_written 0  //memcached服务器发送到网络的总的字节数。
    STAT limit_maxbytes 67108864  //memcached服务缓存允许使用的最大字节数  分配给  memcache的内存大小（字节）
    STAT accepting_conns 1
    STAT listen_disabled_num 0
    STAT threads 4  当前线程数
    STAT conn_yields 0
    STAT bytes 0
    STAT curr_items 0  服务器当前存储的items数量
    STAT total_items 0  从服务器启动以后存储的items总数量
    STAT evictions 0  为获取空闲内存而删除的items数（分配给memcache的空间用满后需要删除旧的items来得到空间分配给新的items）
    STAT reclaimed 0

> 缓存命中率 = get_hits/cmd_get * 100%
> get_misses的数字加上get_hits应该等于cmd_get
> total_items == cmd_set == get_misses，当可用最大内存用光时。
> 详细的memcached的服务器介绍可以查看这本书[Using_Memcached][1]
（原创文章）
[1]: http://cms.everyday-cn.com/system/pictures/929/large_memcached_stats.png?1319684668 "memcached_stat"
