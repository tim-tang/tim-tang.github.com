---
layout: post
title: Ruby使用DBI gem操作mysql
description: Ruby使用DBI gem操作mysql
category: Ruby
keywords: ruby dbi mysql
tags: [Ruby, RubyGem]
location: Suzhou, China
alias: [/Ruby/2011/12/12/ruby-dbi-gem-mysql]
---
之前使用rails开发，处理数据库操作这方面都是使用active record, 它是一个orm的框架，一直在找一个更加轻量的gem，于是找到了dbi，它包括数据库接口（具有跨平台性）和数据库驱动（数据库独立），下面介绍如何使用它：

##安装dbi,dbd-mysql

	gem install dbi
	gem install dbd-mysql

>如果发现上面的命令安装不了，我们可以去rubygems.org下载以后手动安装

##下面给出具体使用的代码：

	require 'dbi'
	begin
		dbh = DBI.connect('DBI:Mysql:crawler_engine', 'root', 'root')
		dbh['AutoCommit'] = false # Set auto commit to false.
		sql = "insert into sources(site_name, link, filter, category) VALUES (?,?,?,?)"
		dbh.prepare(sql) do | sth |
			1.upto(13) { |i| sth.execute("tim #{i}", "link#{i*10}", "filter#{i*100}", "cat#{i*100}")}
		end
		dbh.select_all('select * from sources') do | row |
			p row
		end
		usql="update sources set filter=? where id > ?"
		dbh.prepare(usql) do |stmt|
			stmt.execute("xxxxxxxxxxxx", 10)
		end
		dbh.select_all("select * from sources where id>10") do |row|
			p row
		end
		dbh.do('delete from sources where id > 10')
		dbh.commit
	rescue DBI::DatabaseError => e
			puts "Error: #{e}"
			dbh.rollback
	ensure
			dbh.disconnect if dbh
	end

> 就写到这里，方便查阅。
