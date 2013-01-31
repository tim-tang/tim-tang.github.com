---
layout: post
title: Rails3全文检索使用Sunspot gem
description: Rails3全文检索使用Sunspot gem
category: RubyOnRails
keywords: rails3 sunspot
tags: [Rails, RubyGem]
location: Suzhou, China
alias: [/RubyOnRails/2011/11/04/rails3-sunspot-gem]
---
在网站中经常用到全文检索，这样出于使用的方便打算给Everyday也做个全文检索的功能，网上比较了几个全文检索的gem,发现sunspot(内置了solr引擎)比较适合我的需求，并没有用到之前名气稍大的think_sphinx,下面介绍下rails3和[***Sunspot***][1]的集成：

##安装sunspot gem:

	$ gem install sunspot

##修改#rails_app/Gemfile:

	$ gem 'sunspot_rails'

##使用如下命令生成#rails_app/config/sunspot.yml:

	$ rails g sunspot_rails:install

##对生成的sunspot.yml不需要做任何修改，里面定义了对solr 引擎的配置：

	production:
	  solr:
		hostname: localhost
		port: 8983
		log_level: WARNING
	development:
	  solr:
		hostname: localhost
		port: 8982
		log_level: INFO
	test:
	  solr:
		hostname: localhost
		port: 8981
##由于sunspot gem 中内置了solr引擎，不需要单独安装直接启动即可：

	$ bundle exec rake sunspot:solr:start

##如下命令可以关闭solr引擎：

	$ bundle exec rake sunspot:solr:stop

##修改app/models/eyd_blog.rb,增加：

	...
	searchable do
		text :title, :boost =>5
		text :content
	end

##sunspot会给新的blog增加索引但已经存在的不会加，所有要执行如下命令：

	$ bundle exec rake sunspot:reindex

##添加页面search form代码：
![alt text][2]

##controller中增加方法：

	def search_list
	  @search = EydBlog.search do
		 fulltext params[:search]
	  end
	  @total_blogs = @search.results
	end

##修改#rails_app/config/routes.rb,增加:

	get 'search_list' => :search_list, :as => :search_list

##启动rails服务，测试结果如下：
![sunspot][3]

> ***需要注意的是当把solr服务器关闭后，我们需要重新reindex记录*** （原创文章）

## 补充：

	sunspot在production环境的命令：
	bundle exec rake sunspot:solr:start RAILS_ENV=production
	bundle exec rake sunspot:reindex RAILS_ENV=production
	production环境需要安装jdk环境，否则无法启动服务，查看服务是否启动：
	$ ps -ef|grep solr

  [1]: http://outoftime.github.com/sunspot/ "sunspot"
  [2]: http://cms.everyday-cn.com/system/pictures/973/large__search.png?1320390727 "search code"
  [3]: http://cms.everyday-cn.com/system/pictures/974/large_result_list.png?1320391117 "search_results"
