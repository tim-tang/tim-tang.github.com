---
layout: post
title: "Linode Ubuntu 环境设置最佳实践"
description: "使用Linode Ubuntu服务器搭建维护环境"
category: Linode
keywords: Ubuntu nginx automysqlbackup ssh
tags: [Ubuntu]
location: Suzhou, China
---

使用Linode Ubuntu服务器快两年了一直没有好好的搭建维护环境，最近弄了下还是有不少的收获，下面分享一下。

### 用户创建和SSH无密码方式登陆
---

## 创建新用户及用户管理

    # 创建用户及其目录和组
    $ sudo adduser timtang --home /home/timtang --ingroup root
    # 授于timtang用户root权限
    $ sudo visudo /etc/sudoers 增加 timtang ALL=(ALL) ALL
    # 删除成员连他的 home目录也一起删除
    $ sudo userdel -r timtang
    # 显示系统中所有的组
    $ more /etc/group
    # 系统中所有的用户
    $ /etc/passwd

## 我们经常需要使用SSH 登陆远程服务器每次都要输入密码会麻烦，尤其是在使用shell脚本同步备份的时候无法自动化，可以添加信任用户来解决

    #在本地生成id_rsa公钥和私钥在~/.ss目录
    $ ssh-keygen -t rsa -C "<your email address>"
    # 将id_rsa.pub公钥上传到远程
    $ scp ~/.ssh/id_rsa.pub <user>@<remote-host>:/home/user/.ssh/uploaded_key.pub
    # 将上传的公钥添加到authorized_key文件中
    $ ssh <user>@<remote-host> "cat ~/.ssh/uploaded_key.pub >> ~/.ssh/authorized_keys"

> 注意一下步骤很重要，要给定适当的权限给远端服务器的.ssh目录

    $ chown -R <user>:<group> .ssh
    $ chmod 700 .ssh
    $ chmod 600 .ssh/authorized_keys

> 这样你就可以直接登陆远程服务器，无须输入秘密！

## 我们有时会处于安全考虑避免使用root用户登陆，可以如下设置：

    $ sudo vi /etc/ssh/sshd_config
    #添加如下两行
    PasswordAuthentication no
    PermitRootLogin no
    # 重启ssh 服务
    $ sudo service ssh restart
> 这样就无法使用root用户登陆了！

### Nginx 服务器管理
---

## 在Linode VPS Ubuntu 中，Nginx 默认安装在/opt/nginx/目录，但是不带init脚本启停服务，所有我们可以安装Linode提供的脚本来控制

    $ cd /opt
    $ wget -O init-deb.shhttp://library.linode.com/assets/602-init-deb.sh
    $ mv /opt/init-deb.sh /etc/init.d/nginx
    $ chmod +x /etc/init.d/nginx
    $ /usr/sbin/update-rc.d -f nginx defaults
> 完成以上步骤就安装完成了，我们可以使用如下命名来控制nginx服务：

    $ service nginx restart|stop|start|reload

## 另外在Ubuntu服务器中我们经常使用chkconfig来查看系统服务的状态，这里需要自己安装chkconfig

    $ sudo apt-get install chkconfig
    $ chkconfig --list nginx
    nginx 0:off  1:off  2:on   3:on   4:on   5:on   6:off

> 参考: [**Linode doc**](http://library.linode.com/securing-your-server)

### Mysql 数据库自动备份
---

## 经常手动备份数据是很麻的事情，这里我用了[**AutomySqlBackup**](http://sourceforge.net/projects/automysqlbackup/)这个工具:

    $ sudo apt-get install automysqlbackup

## 我们可以自定义配置：

    $ sudo vi /etc/default/automysqlbackup
    # 将备份的目录改下
    BACKUPDIR="/srv/mysql/backups/"

> 具体详细的配置，可以自己查看官方文档

## 接着设置定时任务，比如说设定每周备份

    $ sudo cp /usr/sbin/automysqlbackup /etc/cron.weekly/automysqlbackup
    # 给脚本执行权限
    $ sudo chmod +x /etc/cron.weekly/automysqlbackup

> 当然我们也可以手工触发，使用如下命令，然后去/srv/mysql/backps/目录即可看到备份文件

    $ sudo automysqlbackup

> 希望对大家有帮助，这篇blog将持续更新....

