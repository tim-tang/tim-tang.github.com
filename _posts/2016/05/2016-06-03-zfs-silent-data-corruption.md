---
layout: post
title: "ZFS 静默数据损坏和自动修复"
description: "ZFS Silent Data Corruption You Should Know"
category: SmartOS
keywords: SmartOS ZFS zdb
tags: [SmartOS]
location: Suzhou, China
---

通过之前[ZFS 那点事](https://timtang.me/blog/2016/05/31/smartos-zfs-you-should-know)我们知道ZFS通过checksum可以检测到算坏的数据并修复它，口说无凭，我们还是要来测试验证下，在验证的过程中说不定我们会有意想不到的收获, 废话不多说，我们开始, 这里再次说明下以下所有操作都是在SmartOS下完成。

## 准备测试环境
---

我们先准备一个pool, 操作如下:

    $ mkfile 100m /var/tmp/disk0
    $ zpool create testpool /var/tmp/disk0
    $ zfs create testpool/sdc # 创建一个sdc的dataset
    $ cp /usr/dict/words /testpool/sdc/  # 复制一个系统自带的words文件到dataset
    $ ls -i /testpool/sdc/  # 找出文件的Inode号为8
    8 words

下面用zdb来找到这个文件在磁盘上的具体信息:

    $ zdb -ddddd testpool/sdc 8
    .... skip info ....
    Indirect blocks:
                   0 L1  0:68600:200 4000L/200P F=2 B=8/8
                   0  L0 0:28600:20000 20000L/20000P F=1 B=8/8
               20000  L0 0:48600:20000 20000L/20000P F=1 B=8/8

                    segment [0000000000000000, 0000000000040000) size  256K

这里我们主要看Indirect blocks的信息，我们可以看到block指针信息: L1  0:68600:200, _68600_是数据在磁盘的偏移量, 0:68600是数据的dva(Data virtual Address), F2用来表示这个pointer block下面又多少个非0指针, 由于我们的words文件有208K，所以需要2个128K的block来存，为什么是2个128K的block? 可以看我的上一篇blog:(ZFS Recordsize 和 TXG 探索)[https://timtang.me/blog/2016/06/01/zfs-recordsize-txg]。

## 开始测试
---

如何来模拟Silent Data Corruption的场景? 步骤如下:

- Unmount testpool
- 把第一个block(0:28600:20000)上的数据通过dd写128K zero数据来抹掉, 这样这块数据就没有信息了。
- 最后把testpool mount回去，看数据状态

执行如下命令unmount testpool:

    $ zpool export testpool

我们需要通过offset计算出磁盘上我们需要保留的元数据信息的情况:

    $ perl -e "\$x = ((0x400000 + 0x28600) / 512); printf \"\$x\\n\";"
    8515

> 0x400000＝4M，这里要提下zpool中每个磁盘都有4M的label用来存储元数据信息，具体看[ZFS On-Disk Specification](http://www.giis.co.in/Zfs_ondiskformat.pdf), 包括zdb的具体输出和dva等这些概念在这个文档里都有详细的解释。所有看到占用了8515个512 byte。

下面通过dd把这些信息写出来:

    $ dd if=/var/tmp/disk0 of=/tmp/fs01 bs=512 count=8515

将第一个数据块数据写出:

    $ dd if=/var/tmp/disk0 of=/tmp/bp bs=512 iseek=8515 count=256

将磁盘剩余数据写出:

    $ dd if=/var/tmp/disk0 of=/tmp/fs02 bs=512 skip=8771

下面我们开始重新写入:

    $ dd if=/dev/zero of=/tmp/fakedata bs=128k count=1
    $ cp -pRf /tmp/fs01 /var/tmp/disk0
    $ cat /tmp/fakedata >> /var/tmp/disk0
    $ cat /tmp/fs02 >> /var/tmp/disk0

最后我们重新import testpool:

    $ zpool import -d /var/tmp/ testpool
    $ zpool status testpool
    pool: testpool
    state: ONLINE
     scan: none requested
    config:

            NAME              STATE     READ WRITE CKSUM
            testpool          ONLINE       0     0     0
              /var/tmp/disk0  ONLINE       0     0     0

从status来看都是正常的，发生了什么？这里我们可以尝试去访问一下/testpool/sdc/words文件，然后再看状态:

    $ head /testpool/sdc/words ＃这里没有输出, 文件损坏
    $ zpool status testpool
      pool: testpool
     state: ONLINE
    status: One or more devices has experienced an unrecoverable error.  An
            attempt was made to correct the error.  Applications are unaffected.
    action: Determine if the device needs to be replaced, and clear the errors
            using 'zpool clear' or replace the device with 'zpool replace'.
       see: http://illumos.org/msg/ZFS-8000-9P
      scan: none requested
    config:

            NAME              STATE     READ WRITE CKSUM
            testpool          ONLINE       0     0     0
              /var/tmp/disk0  ONLINE       0     0     1

> 神奇的事情发生了，提示zpool有error, zfs的checksum起作用了，检查到了问题。

问题来了怎么修复？使用zpool scrub是无法修复，难道是我一只一个disk0盘的原因？那行我们试下mirror的情况，理论上mirror会用另一块盘上的正确的数据来修复它, 看这里[ZFS Scrub and Resilver](https://pthree.org/2012/12/11/zfs-administration-part-vi-scrub-and-resilver/)

    $ zpool destroy testpool
    $ mkfile 100m /var/tmp/disk0
    $ mkfile 100m /var/tmp/disk1
    $ zpool create testpool mirror /var/tmp/disk0 /var/tmp/disk1
    $ zpool status testpool 
      pool: testpool
     state: ONLINE
      scan: none requested
    config:
            NAME                STATE     READ WRITE CKSUM
            testpool            ONLINE       0     0     0
              mirror-0          ONLINE       0     0     0
                /var/tmp/disk0  ONLINE       0     0     0
                /var/tmp/disk1  ONLINE       0     0     0

下面重复之前的步骤，这里就直接省去了。当testpool 重新mount回来,直接看结果:

    $ head /testpool/sdc/words
    10th
    1st
    2nd
    3rd
    4th
    5th
    6th
    7th
    8th
    9th

我没可以看到和我们想象的一致，mirror的情况下用正常的副本修复了。再看下pool的状态:

    $ zpool status testpool
    pool: testpool
     state: ONLINE
    status: One or more devices has experienced an unrecoverable error.  An
            attempt was made to correct the error.  Applications are unaffected.
    action: Determine if the device needs to be replaced, and clear the errors
            using 'zpool clear' or replace the device with 'zpool replace'.
       see: http://illumos.org/msg/ZFS-8000-9P
      scan: scrub repaired 0 in 0h0m with 0 errors on Fri Jun  3 15:43:28 2016
    config:

            NAME                STATE     READ WRITE CKSUM
            testpool            ONLINE       0     0     0
              mirror-0          ONLINE       0     0     0
                /var/tmp/disk0  ONLINE       0     0     1
                /var/tmp/disk1  ONLINE       0     0     0

警告信息依然在，这里我们可以通过如下命令消除它。

    $ zpool clear testpool

现在再看状态就正常了。

    $ zpool status testpool
      pool: testpool
     state: ONLINE
      scan: scrub repaired 0 in 0h0m with 0 errors on Fri Jun  3 15:43:28 2016
    config:

            NAME                STATE     READ WRITE CKSUM
            testpool            ONLINE       0     0     0
              mirror-0          ONLINE       0     0     0
                /var/tmp/disk0  ONLINE       0     0     0
                /var/tmp/disk1  ONLINE       0     0     0


> 从上面的文档链接来看Raidz的整列方式，也是可以让数据self-healing的，这里就不做测试了，刚兴趣的朋友可以自己尝试下。

## 总结一下
---

从上面的这些测试中我们还是可以得到很多有用的东西:

- ZFS发生slient data corruption以后，ZFS本身无法主动的检测到，只有当用户或者应用读写到这个文件的时候才会触发checksum的检查，这个时候ZFS才知道，数据有问题， 所以zpool scrub这个动作最好要加到日常的维护中，让ZFS定时的检查和修复数据。
- Mirror/Raidz有数据盘冗余的场景下Self-Healing才能真正的工作，单个盘或则raid0那你只能祈求老天保佑了。

