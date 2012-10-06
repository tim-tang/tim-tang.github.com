
---
layout: post
title: "Mac OSX下PostgreSQL安装配置"
description: "在Mac OSX 安装postgres配置终端"
category: Msic
tags: [postgres]
---

Prequistion: 已经安装Homebrew：

 - Installing postgreSQL by home brew:
<pre>
brew install postgresql
</pre>

 - For my old mac book pro, I will use following command:
<pre>
brew install postgresql --no-python --without-ossp-uuid
</pre>

 - After installing finished then create database folder:
<pre>
sudo mkdir /usr/local/var/
sudo mkdir /usr/local/var/postgres
sudo chown yourusername /usr/local/var/postgres
</pre>

 - And initialize database:
<pre>
initdb /usr/local/var/postgres
</pre>

 - Add alias startup to script to .bash_profile
<pre>
alias ptstart='postgres -D /usr/local/var/postgres &'
</pre>

 - If you guys happened to meet the PSQL  can not connect to server error.You can use following command:
<pre>
curl http://nextmarvel.net/blog/downloads/fixBrewLionPostgres.sh | sh
</pre>

 - Reconfiguration .psqlrc and put it to the ~/.psqlrc
<pre>
\pset null '<NULL>'
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
</pre>
