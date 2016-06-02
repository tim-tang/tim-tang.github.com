---
layout: post
title: "ZFS Recordsize 和 TXG 探索"
description: "ZFS Recordsize and Transaction Group You Should Know"
category: SmartOS
keywords: SmartOS ZFS zdb
tags: [SmartOS]
location: Suzhou, China
---

ZFS的recordsize参数对于磁盘的性能调优很重要，ZFS默认的recordsize是128K, 这个值相对来说是比较大的，对大文件的读写有利，metadata较少，但是会导致更多的碎片, 文件的最后一个数据块通常只填充大约 1/2, 每个文件浪费大约 64 KB, 这可能影响很大, 但是可以通过ZFS提供的compression参数来缓解，一般使用lz4的压缩方式来达到比较好的压缩比和效率。这里我们主要来探究ZFS内部对recordsize的处理以及和transaction group之间的关系, 看看能否得到一些结论。对于ZFS的基础知识，可以看看这里:[ZFS 那点事](https://timtang.me/blog/2016/05/31/smartos-zfs-you-should-know)。

## 准备工作
---

下面我们先在在默认的recordsize=128K的场景下做一些测试, 为了测试方便先建立一个测试的pool:

    $ mkfile 100m /var/tmp/poolfile
    $ zpool create testpool /var/tmp/poolfile
    $ zfs get recordsize,compression testpool
    NAME      PROPERTY     VALUE     SOURCE
    testpool  recordsize   128K      default
    testpool  compression  off       default

> 这里会用到[zdb](https://www.freebsd.org/cgi/man.cgi?query=zdb&sektion=&n=1)来分析整个数据处理情况, 这篇blog [Examining ZFS At Point-Blank Range](http://www.cuddletech.com/blog/pivot/entry.php?id=980)也许能帮助你更好的使用zdb。

## 测试-1, recordsize=128K, 文件写到磁盘是不是每次都写128K的block?
---

我们先从简单的开始，使用dd命令在testpool上写一个128K的文件, 这个文件正好符合recordsize的大小，看看ZFS是如何处理的。

    $ dd if=/dev/zero of=/testpool/foo bs=128k count=1
    $ zdb -ddddd testpool
    Indirect blocks:
                   0 L0 EMBEDDED et=0 200L/1dP B=4

                    segment [0000000000000000, 0000000000000200) size   512

        Object  lvl   iblk   dblk  dsize  lsize   %full  type
             8    1    16K   128K   128K   128K  100.00  ZFS plain file (K=inherit) (Z=inherit)
                                            168   bonus  System attributes
            dnode flags: USED_BYTES USERUSED_ACCOUNTED
            dnode maxblkid: 0
            path    /foo
            uid     0
            gid     0
            atime   Thu Jun  2 12:59:50 2016
            mtime   Thu Jun  2 12:59:50 2016
            ctime   Thu Jun  2 12:59:50 2016
            crtime  Thu Jun  2 12:59:50 2016
            gen     113
            mode    100644
            size    131072
            parent  4
            links   1
            pflags  40800000004
    Indirect blocks:
                   0 L0 0:14c00:20000 20000L/20000P F=1 B=113/113

                    segment [0000000000000000, 0000000000020000) size  128K


这里我们看到/foo这个文件在磁盘的信息，我们主要看_Indirect blocks_这块的输出，0:14c00:20000 代表vdev:offset:size 0是它的vdev(virtual device)的编号,这里就一个默认的vdev所以你看到的是0，14c00是它在磁盘上的offset, 20000(0x20000=128K)是它的大小，20000L/20000P 这个值是压缩前后逻辑大小/物理大小，由于没有开启compress所以是相同的，前面的几个是都是16进制，B=113/113 代表它这次写入操作所在的transaction group。

下面我们写个只有2k的小文件,看它是不用了128K的磁盘存储空间:

    $ rm /testpool/foo
    $ dd if=/dev/zero of=/testpool/foo bs=2k count=1
    $ zdb -ddddd testpool
    Indirect blocks:
               0 L0 EMBEDDED et=0 200L/1dP B=4

                segment [0000000000000000, 0000000000000200) size   512

        Object  lvl   iblk   dblk  dsize  lsize   %full  type
             9    1    16K     2K     2K     2K  100.00  ZFS plain file (K=inherit) (Z=inherit)
                                            168   bonus  System attributes
            dnode flags: USED_BYTES USERUSED_ACCOUNTED
            dnode maxblkid: 0
            path    /foo
            uid     0
            gid     0
            atime   Thu Jun  2 13:22:32 2016
            mtime   Thu Jun  2 13:22:32 2016
            ctime   Thu Jun  2 13:22:32 2016
            crtime  Thu Jun  2 13:22:32 2016
            gen     385
            mode    100644
            size    2048
            parent  4
            links   1
            pflags  40800000004
    Indirect blocks:
               0 L0 0:45c00:800 800L/800P F=1 B=385/385

                segment [0000000000000000, 0000000000000800) size    2K

这里我们可以看到offset为45c00, 大小为800(0x800=2K)。

> 所以从这里看, ZFS是可以动态的根据不同大小的文件进行计算，动态的选择最佳的数据块, block size是可变的。

## 测试-2: 存储一个大于128K的文件, 看看ZFS如何处理?
----

这里我们尝试存储一个200K的文件, 做类似操作:

    $ rm /testpool/foo
    $ dd if=/dev/zero of=/testpool/foo bs=200k count=1
    $ zdb -ddddd testpool    
    Indirect blocks:
             0 L0 EMBEDDED et=0 200L/1dP B=4

             segment [0000000000000000, 0000000000000200) size   512

        Object  lvl   iblk   dblk  dsize  lsize   %full  type
            10    2    16K   128K   257K   256K  100.00  ZFS plain file
                                            168   bonus  System attributes
            dnode flags: USED_BYTES USERUSED_ACCOUNTED
            dnode maxblkid: 1
            path    /foo
            uid     0
            gid     0
            atime   Thu Jun  2 13:46:40 2016
            mtime   Thu Jun  2 13:46:40 2016
            ctime   Thu Jun  2 13:46:40 2016
            crtime  Thu Jun  2 13:46:40 2016
            gen     675
            mode    100644
            size    262144
            parent  4
            links   1
            pflags  40800000004
    Indirect blocks:
                   0 L1  0:97400:200 4000L/200P F=2 B=675/675
                   0  L0 0:57400:20000 20000L/20000P F=1 B=675/675
               20000  L0 0:77400:20000 20000L/20000P F=1 B=675/675

                    segment [0000000000000000, 0000000000040000) size  256K

从输出来看，这个文件有2个数据block都是128K, 由于一个128K的block不够，外加一个indirect block(这个block存储指向2个数据block的指针), 这里4000L/200P, 我们可以看到indirect block的数据是压缩过的,所以compress关闭对于metadata来说没有影响，它们始终是压缩的。

> 从这个结果来看，我们只存了200K的文件，但实际磁盘却存了256K的数据，所以当文件的大小超过recordsize的时候，多出来的部分72K, 会存另外一个128K的block, 实际上会浪费掉56K的存储空间。如果你比较关注空间效率，最好要开启compress。

## 测试-3: 存储多个2K的小文件，这个时候transaction group如何处理?
---

下面我们尝试存储6个2K的小文件：
    
    $ rm /testpool/foo
    $ for i in {1..6}; do dd if=/dev/zero of=/testpool/f$i bs=2k count=1; done
    $ zdb -ddddd testpool    
    ...
            path    /f1
    Indirect blocks:
                   0 L0 0:14f200:800 800L/800P F=1 B=955/955

            path    /f2
    Indirect blocks:
                   0 L0 0:14fc00:800 800L/800P F=1 B=955/955

            path    /f3
    Indirect blocks:
                   0 L0 0:150600:800 800L/800P F=1 B=955/955

            path    /f4
    Indirect blocks:
                   0 L0 0:150e00:800 800L/800P F=1 B=955/955

            path    /f5
    Indirect blocks:
                   0 L0 0:151600:800 800L/800P F=1 B=955/955

            path    /f6
    Indirect blocks:
                   0 L0 0:151e00:800 800L/800P F=1 B=955/955

这里去掉了一部分不必要的输出，我们可以看到6*2K=12K 小于recordsize 128K, 每个文件实际存储都是2K, 而且它们还在一个128K的磁盘block里面(14f200-151e00), 它们都在一个transaction group 955里面。那么问题来了，如果我尝试将每次写入放到不同的transaction group又会是怎么样呢?它们还会不会写在一个128K的磁盘block上? 

Let's do it, 我们将每次写操作延迟6秒, 为什么是6秒？ZFS的transaction group会每隔最多5秒，将数据同步到磁盘一次。

    $ for i in {1..6}; do rm /testpool/f$i; done
    $ for i in {1..6}; do dd if=/dev/zero of=/testpool/f$i bs=2k count=1; sleep 6; done
    $ zdb -ddddd testpool    
            path    /f1
    Indirect blocks:
                   0 L0 0:165e00:800 800L/800P F=1 B=1208/1208

            path    /f2
    Indirect blocks:
                   0 L0 0:16fa00:800 800L/800P F=1 B=1209/1209

            path    /f3
    Indirect blocks:
                   0 L0 0:176c00:800 800L/800P F=1 B=1210/1210

            path    /f4
    Indirect blocks:
                   0 L0 0:180800:800 800L/800P F=1 B=1211/1211

            path    /f5
    Indirect blocks:
                   0 L0 0:18a800:800 800L/800P F=1 B=1212/1212

            path    /f6
    Indirect blocks:
                   0 L0 0:196000:800 800L/800P F=1 B=1214/1214

我们看到每次写的transaction group都不同了，它们并不是都在一个128K的磁盘block上。

## 测试-4: 尝试写一个稍微大点的文件，会不会在同一个Transaction Group?
----

我们再尝试写一个4M的文件：

    $ for i in {1..6}; do rm /testpool/f$i; done
    $ dd if=/dev/zero of=/testpool/big bs=4096k count=1
    $ zdb -ddddd testpool
    path    /big
    Indirect blocks:
                   0 L1  0:47b600:200 4000L/200P F=32 B=1456/1456
                   0  L0 0:71c00:20000 20000L/20000P F=1 B=1450/1450
               20000  L0 0:51c00:20000 20000L/20000P F=1 B=1450/1450
               40000  L0 0:11c00:20000 20000L/20000P F=1 B=1450/1450
               60000  L0 0:91c00:20000 20000L/20000P F=1 B=1450/1450
               80000  L0 0:131c00:20000 20000L/20000P F=1 B=1450/1450
               a0000  L0 0:31c00:20000 20000L/20000P F=1 B=1450/1450
               c0000  L0 0:d1c00:20000 20000L/20000P F=1 B=1450/1450
               e0000  L0 0:1c7a00:20000 20000L/20000P F=1 B=1450/1450
              100000  L0 0:111c00:20000 20000L/20000P F=1 B=1450/1450
              120000  L0 0:1a7a00:20000 20000L/20000P F=1 B=1450/1450
              140000  L0 0:b1c00:20000 20000L/20000P F=1 B=1450/1450
              160000  L0 0:f1c00:20000 20000L/20000P F=1 B=1450/1450
              180000  L0 0:1e7a00:20000 20000L/20000P F=1 B=1450/1450
              1a0000  L0 0:207a00:20000 20000L/20000P F=1 B=1450/1450
              1c0000  L0 0:227a00:20000 20000L/20000P F=1 B=1450/1450
              1e0000  L0 0:331800:20000 20000L/20000P F=1 B=1453/1453
              200000  L0 0:251800:20000 20000L/20000P F=1 B=1453/1453
              220000  L0 0:411800:20000 20000L/20000P F=1 B=1453/1453
              240000  L0 0:271800:20000 20000L/20000P F=1 B=1453/1453
              260000  L0 0:391800:20000 20000L/20000P F=1 B=1453/1453
              280000  L0 0:291800:20000 20000L/20000P F=1 B=1453/1453
              2a0000  L0 0:2d1800:20000 20000L/20000P F=1 B=1453/1453
              2c0000  L0 0:351800:20000 20000L/20000P F=1 B=1453/1453
              2e0000  L0 0:2f1800:20000 20000L/20000P F=1 B=1453/1453
              300000  L0 0:371800:20000 20000L/20000P F=1 B=1453/1453
              320000  L0 0:2b1800:20000 20000L/20000P F=1 B=1453/1453
              340000  L0 0:311800:20000 20000L/20000P F=1 B=1453/1453
              360000  L0 0:3b1800:20000 20000L/20000P F=1 B=1453/1453
              380000  L0 0:3f1800:20000 20000L/20000P F=1 B=1453/1453
              3a0000  L0 0:3d1800:20000 20000L/20000P F=1 B=1453/1453
              3c0000  L0 0:43b600:20000 20000L/20000P F=1 B=1456/1456
              3e0000  L0 0:45b600:20000 20000L/20000P F=1 B=1456/1456

                    segment [0000000000000000, 0000000000400000) size    4M

> 从outputs我们可以看到以128K的文件存储在磁盘，分布在不同transaction group上。所以一次写会根据recordsize跨多个transaction group。

## 测试-5: 最后我们来测试下压缩的情况
---

我们使用推荐的LZ4的压缩方式:

    $ zfs set compression=lz4 testpool
    $ zfs get recordsize,compression testpool
    NAME      PROPERTY     VALUE     SOURCE
    testpool  recordsize   128K      default
    testpool  compression  off       default

先用NULL的数据来测试下看看，写入2个128K的文件：

    $ dd if=/dev/zero of=/testpool/zero bs=128k count=2
    $ zdb -ddddd testpool
    Object  lvl   iblk   dblk  dsize  lsize   %full  type
        26    2    16K   128K      0   256K    0.00  ZFS plain file
                                        168   bonus  System attributes
        dnode flags: USED_BYTES USERUSED_ACCOUNTED
        dnode maxblkid: 1
        path    /zero
        uid     0
        gid     0
        atime   Thu Jun  2 15:06:28 2016
        mtime   Thu Jun  2 15:06:28 2016
        ctime   Thu Jun  2 15:06:28 2016
        crtime  Thu Jun  2 15:06:28 2016
        gen     1638
        mode    100644
        size    262144
        parent  4
        links   1
        pflags  40800000004
    Indirect blocks:

> 这里我们看到Indirect blocks是没有输出的，看起来compression起作用了!

再试下文本数据的写入是什么情况:

    $ dd if=/usr/dict/words of=/testpool/foo.compressed bs=128k count=2
    $ zdb -ddddd testpool
    Object  lvl   iblk   dblk  dsize  lsize   %full  type
            27    2    16K   128K   141K   256K  100.00  ZFS plain file
                                            168   bonus  System attributes
            dnode flags: USED_BYTES USERUSED_ACCOUNTED
            dnode maxblkid: 1
            path    /foo.compressed
            uid     0
            gid     0
            atime   Thu Jun  2 15:09:35 2016
            mtime   Thu Jun  2 15:09:35 2016
            ctime   Thu Jun  2 15:09:35 2016
            crtime  Thu Jun  2 15:09:35 2016
            gen     1676
            mode    100644
            size    206674
            parent  4
            links   1
            pflags  40800000004
    Indirect blocks:
                   0 L1  0:4ba800:200 4000L/200P F=2 B=1676/1676
                   0  L0 0:4a4600:16200 20000L/16200P F=1 B=1676/1676
               20000  L0 0:497800:ce00 20000L/ce00P F=1 B=1676/1676

                    segment [0000000000000000, 0000000000040000) size  256K

我们可以看到20000L/16200P, 20000L/ce00P 这2个值就知道压缩了，具体压缩了多少，自己转换下就可以算出来，这里就不废话了。

## 小结一下
---

- ZFS的recordsize实际上是写一个文件到磁盘block上的最大值，但写入的文件大小小于这个值(比如:128K), ZFS自动调整写入的磁盘block为文件大小，如果写入的文件大于这个值，ZFS把recordsize的大小作为磁盘的block大小，会造成一定的磁盘空间浪费，但可以通过compression来缓解。
- 对于使用database的场景建议recordsize使用8K, 这样能对随机的读写来密集的处理大文件的情况有比较好的提升, 尤其是IOPS.
- 写一个大文件会跨多个transaction group。 
- 对于ZFS的分析来说zdb非常有用, 需要用好。

## 很不错的资料
---

- [ZFS On-Disk Data Walk](http://www.osdevcon.org/2008/files/osdevcon2008-max.pdf)
- ZFS大神Max Bruning的blog: [Max Bruning's weblog](http://mbruning.blogspot.jp/2009/04/raidz-on-disk-format.html)
- [ZFS On-Disk Format Using mdb and zdb视频](https://www.youtube.com/watch?v=BIxVSqUELNc)

