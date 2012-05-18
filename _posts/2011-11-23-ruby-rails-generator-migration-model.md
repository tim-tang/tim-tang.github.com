---
layout: post
title: ruby使用rails generator生成migration&model文件
description: ruby使用rails generator生成migration&model文件
key: []
---
最近在业余时间写一个[***crawler engine***][1]的rubygem, 主要用途是通过rss抓取各个网站的最新新闻、博客等，期间用到了rails migration成数据库表结构和model，下面接介绍下如何在rubygem中使用rails/generator:

 - 首先我们要编写文件lib/generators/crawler_engine_generator.rb：
<pre>
require 'rails/generators'
require 'rails/generators/migration'
require 'rails/generators/active_record'
class CrawlerEngineGenerator < Rails::Generators::Base
	include Rails::Generators::Migration
	extend ActiveRecord::Generators::Migration
	desc "Generates migration for crawler engine model"
	def self.source_root
		File.expand_path('../templates', __FILE__)
	end
	def create_migration_file
		migration_template 'migration.rb', 'db/migrate/create_crawler_engine'
	end
	def crate_model_file
		template 'post.rb', 'app/models/post.rb'
		template 'source.rb', 'app/models/source.rb'
	end
end
</pre>
 - 在CrawlerEngineGenerator类中，会逐个执行public 方法。
 - 下面可以创建我们的lib/generators/templates/migration.rb:
<pre>
class CreateCrawlerEngine < ActiveRecord::Migration
	def self.up
		create_table :sources, :force => true do |t|
			t.string :site_name
			t.string :link
			t.string :filter
			t.string :category
			t.datetime :crawled_at # When to run. Could be Time.now for immediately, or sometime in the future.
		end
    end
    	def self.down
		drop_table :sources
		drop_table :posts
	end
end
</pre>
 - 如果同时生成model文件，我们只要在template目录下添加，post.rb&source.rb文件如下：
<pre>
class Source < ActiveRecord::Base
end
</pre>
<pre>
class Post < ActiveRecord::Base
end
</pre>
 - 接下来就是build的你的rubygem并安装即可，这样就可以在rails项目中执行如下命令：
<pre>
$ rails g crawler_engine
</pre>
 - 我们可以看到生成了migration文件和model文件。

> 就写到这里，要查看更详细的信息可以看[***crawler engine***][1]这个rubygem.(原创文章)

  [1]: https://github.com/tim-tang/crawler_engine "crawler-engine"
