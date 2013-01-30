---
layout: post
title: "PostgreSQL Schema 应用"
description: "PostgreSQL 数据库Schema模式在项目中的应用"
category: Misc
keywords: postgresqldb schema
tags: [PostgreSQL]
location: Suzhou, China
---

最近项目中需要用到PostgresSQL的schema模式，看了下相关文档觉得相当的方便，下面介绍下：

### Schema的定义:

> 一个数据库包含一个或多个命名的模式，模式又包含表。模式还包含其它命名的对象，包括数据类型、函数，以及操作符。同一个对象名可以在不同的模式里使用而不会导致冲突； 比如，schema1和schema2都可以包含叫做version的表。和数据库不同，模式不是严格分离的：一个用户可以访问他所连接的数据库中的任意模式中的对象，只要他有权限。

### Schema的应用场景:
---

* 允许多个用户使用一个数据库而不会干扰其它用户。

* 把数据库对象组织成逻辑组，让它们更便于管理。

* 第三方的应用可以放在不同的模式中，这样它们就不会和其它对象的名字冲突。

* 本来需要放在不同数据库中的表可以放在同一个schema中，避免了在应用中使用JTA。

### 关于Schema的操作:

## 创建Schema

    -- 该模式被创建后，其便可拥有自己的一组逻辑对象，如表、视图和函数等
    CREATE SCHEMA schema1;

## 关于postgresql默认的public schema:

_**每当我们创建一个新的数据库时，PostgreSQL都会为我们自动创建该模式。当登录到该数据库时，如果没有特殊的指定，我们将以该模式(public)的形式操作各种数据对象。**_

    CREATE TABLE version( ... ) 等同于 CREATE TABLE public.version( ... )

## Schema权限控制:

    CREATE ROLE role_tim LOGIN PASSWORD '123456';
    CREATE SCHEMA schema1 AUTHORIZATION role_tim;

## 删除Schema:

    DROP SCHEMA schema1;
    -- 删除模式及其所有对象，使用级联删除
    DROP SCHEMA schema1 CASCADE;

## Schema 搜索路径:

_**PostgreSQL通过查找一个搜索路径来判断一个表究竟属于哪个schema中的表，这个路径是一个需要查找的模式列表。在搜索路径里找到的第一个表将被当作选定的表。如果在搜索路径中 没有匹配表，那么就报告一个错误，即使匹配表的名字在数据库其它的模式中存在也如此。**_

    -- 显示当前搜索路径
    SHOW search_path;
    -- 将模式加入到搜索路径中
    SET search_path TO schema1;
    -- 让某一个用户每次登陆都默认访问同一个模式
    ALTER USER user_name SET search_path to schema1

> 有了PostgreSQL的schema就不用因为有相同表建立多个数据库，可以将多个数据库中的schema放入单个数据库中的多个schema中，在做db-migration的时候做一份migration script就可以，同样避免了多个数据库时候事务同步问题，还方便了数据库的管理真是一举多得！

