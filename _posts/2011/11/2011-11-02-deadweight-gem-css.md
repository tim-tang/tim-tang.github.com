---
layout: post
title: Deadweight gem找出未使用的css
description: Deadweight gem找出未使用的css
category: RubyOnRails
keywords: deadweight css
tags: [RubyGem, Rails]
location: Suzhou, China
alias: [/RubyOnRails/2011/11/02/deadweight-gem-css]
---
我们在做项目的时候，经常用到一些第三方的css模板，Jquery插件等，里面常包含一些我们不需要的css定义，这个时候逐个去删除这些没使用到的css时比较头痛而且很容易出错，下面介绍一个自动查找无用的css的gem--[***deadweight***][1]:

##首先我们安装deadweight:
	$ gem install deadweight

##安装过程发生如下错误：
![alt text][2]

##安装libxslt-dev, libxml2-dev 依赖包

	$ sudo apt-get install libxslt-dev libxml2-dev
	$ gem install nokogiri

##修改Gemfile,添加

	gem 'deadweight'

##新建#rails_app/lib/tasks/deadweight.rake

	begin
	  require 'deadweight'
	rescue LoadError
	end
	desc "run Deadweight CSS check (requires script/server)"
	task :deadweight do
	  dw = Deadweight.new
	  dw.stylesheets = ["/stylesheets/templatemo_style.css"]
	  dw.pages = ["/", "/tech_list","/gallery_list","/ibook_list","/guest_book","/show_blog/rails-fragment","/tag_ibook_list/asdf","/category_list/5","/archival_list/2011-10","/tag_list/RubyOnRails"]
	  dw.ignore_selectors = /flash_notice|flash_error|errorExplanation|fieldWithErrors/
	  puts dw.run
	end

##下面我们启动rails应用服务

##执行如下命令：

	bundle exec rake deadweight

##deadweight将自动找出所有未使用到的css结果:

    found 32 unused selectors out of 123 total
	.cleaner_h10
	.cleaner_h20
	.cleaner_h30
	.cleaner_h50
	.cleaner_h60
	.hr_divider
	.float_l
	.float_r
	.image_fr 
	cite
	cite span 
	.btn_more a
	#site_title a span
	#header_right
	.last
	.recent_comment li .author
	.ads a
	.service_box
	.service_box img
	.service_box .sb_right
	.comments li .commentbox2
	.comment_text .comment_author
	.comment_text .date
	.comment_text .time
	.comment_text .reply a 
	#gallery .last
	#contact_form
	#contact_form form
	#contact_form form .input_field
	#contact_form form label
	contact_form form textarea

> firefox也提供了类似的插件，具体可以google,希望这些工具能提高你的开发效率。（原创文章）

[1]: https://github.com/aanand/deadweight "deadweight"
[2]: http://cms.everyday-cn.com/system/pictures/958/large_nokogiri_error.png?1320198981 "nokogiri"
