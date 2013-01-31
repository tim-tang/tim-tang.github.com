---
layout: post
title: "Mac OSX下PostgreSQL安装配置"
description: "在Mac OSX 安装postgres配置终端"
category: Msic
keywords: mac postgresql installation
tags: [PostgreSQL]
location: Suzhou, China
alias: [/Msic/2012/10/06/macpostgres]
---

Prequistion: 已经安装Homebrew：

##Installing postgreSQL by home brew:

    brew install postgresql

##For my old mac book pro, I will use following command:

    brew install postgresql --no-python --without-ossp-uuid

##After installing finished then create database folder:

	sudo mkdir /usr/local/var/
	sudo mkdir /usr/local/var/postgres
	sudo chown yourusername /usr/local/var/postgres

##And initialize database:

	initdb /usr/local/var/postgres

##Add alias startup to script to .bash_profile

	alias ptstart='postgres -D /usr/local/var/postgres &'

##If you guys happened to meet the PSQL  can not connect to server error.You can use following command:

	curl http://nextmarvel.net/blog/downloads/fixBrewLionPostgres.sh | sh

##Reconfiguration .psqlrc and put it to the `~/.psqlrc`

	\pset null <NULL>
	\set HISTFILE ~/.psql_history- :HOST - :DBNAME
	\set HISTSIZE 2000
	\set FETCH_COUNT 1000
	\timing
	\set PROMPT1 '(%n@%M:%>) [%/] > '
	\set PROMPT2 ''
	\encoding unicode
	\pset border 2
	\pset format wrapped
	\pset pager off
