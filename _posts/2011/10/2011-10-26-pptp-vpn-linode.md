---
layout: post
title: PPTP,VPN配置(Linode)
description: PPTP,VPN配置(Linode)
category: Msic
keywords: pptp vpn linode
tags: [Linode]
location: Suzhou, China
alias: [/Msic/2011/10/26/pptp-vpn-linode]
---
介绍下Linode VPS上，利用PPTP搭建VPN服务器：

##安装PPTP VPN

    $apt-get update
    $apt-get upgrade
    $apt-get install pptpd
##编辑/etc/pptpd.conf 。修改localip,remoteip的ip地址段，例如修改为:

    localip 192.168.1.1
    remoteip 192.168.1.100-200
##编辑/etc/ppp/pptpd-options,修改ms-dns 的dns地址，例如可以修改为:

    ms-dns 208.67.222.222
    ms-dns 208.67.220.220
##编辑/etc/ppp/chap-secrets,设置用户名密码，格式如下:

    user1 pptpd password1 *      --不限定分配ip地址
    user2 pptpd password2 10.10.10.102   --限定分配ip地址。
##编辑/etc/sysctl.conf,修改#net.ipv4.ip_forward=1为net.ipv4.ip_forward=1。执行如下命令:

    $sysctl -p
##iptables防火墙设置:

    iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j MASQUERADE
##iptables保存:

    $iptables-save > ~/iptables-script
##由于Linode VPS下没有ppp设备，需要执行如下命令:

    mknod /dev/ppp c 108 0
##启动PPTP 服务

    /etc/init.d/pptpd restart

> 最后要做的就是在自己的本机新建一个vpn链接就可以，这样就可以facebook/twitter/youtube了！ （原创文章）
