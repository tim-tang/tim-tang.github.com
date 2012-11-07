---
layout: post
title: "PostgreSQL open remote connection"
description: "Open PostgreSQL server remote connections."
category: Msic
tags: [postgresql]
location: Suzhou, China
---
Introduce how to open remote connections for postgresSQL server.

## Preparation:

* PostgreSQL9 installed on Mac. For installation details please refer [Mac OSX下PostgreSQL安装配置][http://tim.everyday-cn.com/Msic/2012/10/06/macpostgres/]

## Modify /usr/local/var/postgres/postgresql.conf

	listen_addresses = '*'

## Modify /usr/local/var/postgres/pg_hba.conf

	# IPv4 local connections:
	host    all             all             samenet                 password


> OK, Cheers!



