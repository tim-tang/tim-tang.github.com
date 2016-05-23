---
layout: post
title: "双网卡安装SmartOS使用VirtualBox"
description: "在VirtualBox中使用NAT, Host-Only双网卡安装SmartOS"
category: IAAS
keywords: smartos virtualbox nat host-only
tags: [IAAS]
location: Suzhou, China
---

最近业余时间在看[SmartOS](http://wiki.smartos.org/display/DOC/Home)和[FiFo](https://docs.project-fifo.net/en/latest/index.html)相关的IaaS的东西，就尝试了一把在VirtualBox中安装smartos, 最初只是使用NAT的连接方式, 发现主机无法访问global/local zone. 当然通过NAT的端口转发还是可以访问global zone的，local zone就没有办法直接访问了。 经过一番折腾后终于实现了我的目的， 在global/local zone中可以访问外网（通过NAT的连接), 主机可以访问global/local zone (通过Host-Only的连接), 记录下安装方案以备忘。 在这里就不再废话SmartOS在VirtualBox中的安装了，具体的可以看李宇的blog -> [在VirtualBox中跑SmartOS](http://liyu1981.github.io/smartos-virtualbox/)已经讲的非常到位了, 这里只描述双网卡的配置！

## 配置VirtualBox的NAT, Host-Only网卡
---

* NAT很简单，直接默认的NAT的虚拟网卡配置就可以, 如图:

![vbox-nat](/images/post/vbox-nat.png)

* Host-Only就复杂点，先要在virtualbox中新建一个Adapter:

![vb-hostonly-1](/images/post/vbox-hostonly.png)

![vb-hostonly-2](/images/post/vbox-hostonly-1.png)

![vb-hostonly-3](/images/post/vbox-hostonly-2.png)

> 这个Adapter是dhcp enable的，自动分配ip, 192.168.56.1相当于主机的ip, virtual VM 可以通过这个ip来访问主机！

![vb-hostonly-4](/images/post/vbox-hostonly-3.png)

> 这里我们启用Host-Only方式的虚拟网卡, 注意Promiscuous Mode要选择 Allow All.


## SmartOS中网络配置
---

这里我们假设你已经在virtual box中把smartos跑起来了. 我应该可以看到e1000g0(NAT的虚拟网卡)已经可用了, 安装smartos的时候使用dhcp的方式，自动分配到了IP。

    e1000g0: flags=1004943<UP,BROADCAST,RUNNING,PROMISC,MULTICAST,DHCP,IPv4> mtu 1500 index 2
            inet 10.0.2.15 netmask ffffff00 broadcast 10.0.2.255
            ether 8:0:27:b0:cd:4c

同时我们还可以通过_dladm show-link_命令看到如下信息，自动创建了一个_vmwarebr_的桥接:

    [root@08-00-27-b0-cd-4c /opt]# dladm show-link
    LINK        CLASS     MTU    STATE    BRIDGE     OVER
    e1000g0     phys      1500   up       vmwarebr   --
    vmwarebr0   bridge    1500   up       --         e1000g0

这个时候我们会问， Host-Only的虚拟网卡在哪里? 

    [root@08-00-27-b0-cd-4c /opt]# dladm show-phys -m
    LINK         SLOT     ADDRESS            INUSE CLIENT
    e1000g0      primary  8:0:27:b0:cd:4c    yes  e1000g0
    e1000g1      primary  8:0:27:9c:77:4d    yes  e1000g1

> e1000g1 网卡是存在的只是没有启动而已!

启用Host-Only虚拟网卡, 同时对应建立一个worldbr的bridge:

    $ ifconfig e1000g1 plumb
    $ ifconfig e1000g1 dhcp
    $ dladm create-bridge -l e1000g1 worldbr
    $ sysinfo -u

看结果:

    [root@08-00-27-b0-cd-4c /opt]# dladm show-link
    LINK        CLASS     MTU    STATE    BRIDGE     OVER
    e1000g0     phys      1500   up       vmwarebr   --
    e1000g1     phys      1500   up       worldbr    --
    vmwarebr0   bridge    1500   up       --         e1000g0
    worldbr0    bridge    1500   up       --         e1000g1

修改/usbkey/config增加一个external的vnic给smartos, 清单:

    #
    # This file was auto-generated and must be source-able by bash.
    #

    # admin_nic is the nic admin_ip will be connected to for headnode zones.
    admin_nic=8:0:27:53:61:ae
    admin_ip=dhcp
    admin_netmask=
    admin_network=...
    admin_gateway=dhcp
    external_nic=8:0:27:9c:77:4d
    external0_ip=dhcp
    external0_gateway=dhcp
    headnode_default_gateway=

    dns_resolvers=8.8.8.8,8.8.4.4
    dns_domain=

    ntp_hosts=0.smartos.pool.ntp.org
    compute_node_ntp_hosts=dhcp

> 注意，这里external_nic的值是host-only虚拟网卡的mac地址

## 创建双网卡的smart machine(local zone)
---

因为我们要在local zone中访问外网并可以让主机直接访问，所以需要配置2 个vnics, myvm.json清单:

    {
    "brand": "joyent",
    "image_uuid": "fdea06b0-3f24-11e2-ac50-0b645575ce9d",
    "alias": "web01",
    "hostname": "web01",
    "max_physical_memory": 1024,
    "quota": 20,
    "resolvers": ["114.114.114.114", "8.8.8.8", "8.8.4.4"],
    "nics": [
      {
        "nic_tag": "admin",
        "ip": "10.0.2.58",
        "netmask": "255.255.255.0",
        "gateway": "10.0.2.2"
      },
      {
        "nic_tag": "external",
        "ip": "192.168.56.242",
        "netmask": "255.255.255.0",
        "gateway": "192.168.56.1"
      }
    ]
    }

> 一个使用NAT的网卡，另一个使用Host-Only网卡

由于smartos 的local zone不支持密码登录，我们需要把主机的id\_rsa.pub公钥文件放入local zone的authorized_keys文件,

    /zones/<LOCAL_ZONE_UUID>/root/root/.ssh/authorized_keys 

下面就可以直接在主机登录local zone来测试了:

    $ ssh root@192.168.56.242
    The authenticity of host '192.168.56.242 (192.168.56.242)' can't be established.
    RSA key fingerprint is ec:4c:62:85:2d:c9:75:87:0e:c7:a3:a0:05:79:70:cb.
    Are you sure you want to continue connecting (yes/no)? yes
    Warning: Permanently added '192.168.56.242' (RSA) to the list of known hosts.
    Last login: Thu Sep 11 12:03:53 2014 from 192.168.56.1
       __        .                   .
     _|  |_      | .-. .  . .-. :--. |-
    |_    _|     ;|   ||  |(.-' |  | |
      |__|   `--'  `-' `;-| `-' '  ' `-'
                       /  ; SmartMachine base64 1.8.4
                       `-'  http://wiki.joyent.com/jpc2/SmartMachine+Base

    [root@web01 ~]#


访问外网：

    $ ping -a timtang.me
    timtang.me (173.255.253.43) is alive

当然你也可以同样的方式来测试global zone, 如果global zone中域名无法解析可以修改/etc/resolv.conf增加，dns服务器地址:

    nameserver 114.114.114.114
    nameserver 8.8.8.8
    nameserver 8.8.4.4

> Cherrs!

