---
layout: post
title: "PostgreSQL Tablespace 介绍"
description: "介绍PostgreSQL tablespace 的应用"
category: Misc
keywords: postgresql tablespace
tags: [PostgreSQL]
location: Suzhou, China
---

PostgreSQL 允许管理员在文件系统里定义表空间存储位置，这样创建数据库对象时候就可以引用这个表空间了。好处就不用多说了，可以把数据库对象存储到不同的分区上，比如更好的存储之类。默认initdb之后会有两个表空间pg_global和pg_default。

## 查看pgsql当前表空间

    postgres=> SELECT spcname FROM pg_tablespace;
    spcname
    ------------
     pg_default
     pg_global
    (2 rows)

    postgres=> \db
    Name    |  Owner   | Location
    ------------+----------+----------
    pg_default | postgres |
    pg_global  | postgres |

> 建立表空间需要注意的主要的是权限问题，而且要在新的空目录上建立，权限属于数据库管理员比如默认postgres。

## 建立目录

    $ mkdir /home/timtang/pgdata
    $ sudo chown -R postgres:postgres /home/timtang/pgdata

## 如果权限没设置好下面语句会报错

    postgres=> CREATE TABLESPACE space1 LOCATION '/home/timtang/pgdata';

## 建测试表

    postgres=> CREATE TABLE foo(i int) TABLESPACE space1;

## 查看表空间目录下多了文件

    postgres=> \! ls /home/timtang/pgdata

## 删除表空间，需要注意的是先要删除所有该表空间里的对象

    postgres=> DROP TABLESPACE space1;

## 然每次建表都指定TABLESPACE也有点麻烦，可以指定默认表空间

    postgres=> SET default_tablespace = space1;
    postgres=> CREATE TABLE foo(i int);

> 这样TABLESPACE就建立好了，Cheers!
