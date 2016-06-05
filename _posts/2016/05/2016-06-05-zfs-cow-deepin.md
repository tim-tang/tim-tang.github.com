---
layout: post
title: "ZFS COW 深入分析"
description: "ZFS Copy On Write You Should Know"
category: SmartOS
keywords: SmartOS ZFS COW
tags: [SmartOS]
location: Suzhou, China
---

从前面的文章 [ZFS 那点事](https://timtang.me/blog/2016/05/31/smartos-zfs-you-should-know), 我们了解到ZFS是基于COW(Copy On Write)的机制，我们来实验下在ZFS对文件的修改是不是真的只是改动修改的数据块和元数据块，看看有没有什么收获？

## 准备测试环境
---

我们先准备一个pool, 操作如下:

    $ mkfile 100m /var/tmp/disk0
    $ zpool create testpool /var/tmp/disk0
    $ zfs create testpool/sdc # 创建一个sdc的dataset
    $ zfs get recordsize testpool/sdc
    NAME          PROPERTY    VALUE    SOURCE
    testpool/sdc  recordsize  128K     default
    $ cp /usr/dict/words /testpool/sdc/  # 复制一个系统自带的words文件到dataset
    $ ls -i /testpool/sdc/  # 找出文件的Inode号为8
    8 words

## 开始测试
---

使用ZDB看words文件的磁盘信息:

    $ zdb -ddddd testpool/sdc 8
    ... skip info ...
    Indirect blocks:
                   0 L1  0:90e00:200 4000L/200P F=2 B=8/8
                   0  L0 0:50e00:20000 20000L/20000P F=1 B=8/8
               20000  L0 0:70e00:20000 20000L/20000P F=1 B=8/8

                    segment [0000000000000000, 0000000000040000) size  256K

然后我们将第2个数据block读出来:

    $ zdb -R testpool 0:50e00:20000:r > /tmp/file1
    $ zdb -R testpool 0:70e00:20000:r > /tmp/file2 
    $ cat /tmp/file2 >> /tmp/file1  #合并文件
    $ diff /tmp/file1 /testpool/sdc/words  #比较文件，看看有没有差异
    Warning: missing newline at end of file /tmp/file1
    25145d25144
    <

到这里我们看到文件是完全相同的, 接着我们来修改一下words文件，看看COW是不是只更新了修改的数据，然后把block pointer改掉。

    $ vi /testpool/sdc/words
    zygote ==> zygott   #将最后一行的改动
    $ ls -i /testpool/sdc/words
    21 /testpool/sdc/words

看起来情况不妙，文件的inode id变化了，再用zdb看看:

    $ zdb -ddddd testpool/sdc 21
    Indirect blocks:
               0 L1  0:3fe600:200 4000L/200P F=2 B=205/205
               0  L0 0:39e600:20000 20000L/20000P F=1 B=205/205
           20000  L0 0:3de600:20000 20000L/20000P F=1 B=205/205

                segment [0000000000000000, 0000000000040000) size  256K

整个Indirect block是全新的，看起来象是写了一个全新的文件，我们再看看老的文件还在不在?

    $ zdb -R testpool 0:70e00:20000:r
    ... skip info ...
    zoom
    Zorn
    Zoroaster
    Zoroastrian
    zounds
    z's
    zucchini
    Zurich
    zygote  ##上一版本

没问题老的文件信息还在, 问题出哪里了？难道是vi的问题，每次修改保存会重写整个文件，导致所有数据块和blok pointer metadata数据全部从新分配?

为了排除vi的问题我们再做另外一个测试通过rsync --inplace来试试, 先看看这个参数什么意思:

       --inplace
          This option is useful for transferring large files
          with  block-based  changes  or  appended data, and
          also on systems that are disk bound,  not  network
          bound.   It  can  also  help  keep a copy-on-write
                                               *************
          filesystem snapshot from diverging the entire con‐
          *******************
          tents of a file that only has minor changes.

下面开始操作:

    $ cp /testpool/sdc/words /tmp/words
    $ vi /tmp/words 
    zygott ==> zygottt   #将最后一行的改动
    $ rsync -av --inplace --no-whole-file /tmp/words /testpool/sdc/words 
    sending incremental file list
    words
    sent 1428 bytes  received 1807 bytes  6470.00 bytes/sec
    total size is 206675  speedup is 63.89

看起来不错只同步了1428byte数据,我们来看下Indirect block信息：

    $ zdb -ddddd testpool/sdc 21
     Indirect blocks:
                   0 L1  0:42c600:200 4000L/200P F=2 B=517/517
                   0  L0 0:39e600:20000 20000L/20000P F=1 B=205/205
               20000  L0 0:40c600:20000 20000L/20000P F=1 B=517/517

                    segment [0000000000000000, 0000000000040000) size  256K

看起来不错，block pointer的metadata和第2个数据block变了, B=517/517 transaction group Id也是一致的， 第一个数据block没任何变化, 这是我们想要的，我们在来看看数据：

    $ zdb -R testpool 0:40c600:20000:r
    ... skip info ...
    zone
    zoo
    zoology
    zoom
    Zorn
    Zoroaster
    Zoroastrian
    zounds
    z's
    zucchini
    Zurich
    zygottt  #数据正确
 
> Bingoo! ZFS没有忽悠你。

我们在来看看上一个版本的数据还在不在?

    $ zdb -R testpool 0:3de600:20000:r
    ... skip info ...
    zoo
    zoology
    zoom
    Zorn
    Zoroaster
    Zoroastrian
    zounds
    z's
    zucchini
    Zurich
    zygott #中间版本，数据还在

> 完美! 

## 这次测试的收获
---

- 如果是大文件rsync同步数据需要 --inplace参数，尤其重要在基于COW的文件系统上,比如: ZFS/BTRFS。
- 直接通过vi这样的编辑器对文本文件的修改会导致整个数据文件的重新写入, 磁盘上所有这个文件的block重新分配。
- ZFS的COW机制极大的便利了数据的snapshot和clone的操作。

