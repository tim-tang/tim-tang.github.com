---
layout: post
title: CruiseControl.rb,Rspec实践持续集成
description: CruiseControl.rb,Rspec实践持续集成
category: CI
keywords: curisecontrol rspec
tags: [Rspec, CI]
location: Suzhou, China
alias: [/CI/2011/11/10/cruisecontrol-rb-rspec]
---
现在很多agile development 开发团队在多人协作开发的时候，经常用到CI，在java中常用的CI工具有Hudson,cruisecontrol等，rails的项目我们可以用cruisecontrol.rb,它遵循Rails项目一贯的“convention over configuration”原则，CC.rb也允许你以非常简单的方式指定这些设置——没有XML，配置都是你熟悉的Ruby代码。下面我们实践下如何集成rspec去做ci:

##首先我们需要[***下载***][1]和解压cruisecontrol.rb

##把我们的rails项目添加到cruisecontrol.rb中，执行如下命令：

	$ cd #cruise_dir/     #你的cruisecontrol.rb的安装目录
	$ ./cruise add everyday --source-control git --repository git@github.com:tim-tang/everyday.git

##以上命令会做如下输出：

	cruise data root = '/home/tim-tang/.cruise'     #你以后的所有项目都会在这个目录下
	RAILS_ROOT = /home/tim-tang/Documents/thoughtworks-cruisecontrol.rb
	Adding project 'everyday' (this may take a while)...
	Project 'everyday' added.

##下面就是与rspec集成了，cruisecontrol.rb默认build的时候仍然执行Rails自带的test cases:

	rake db:test:purge  
	rake db:migrate  
	rake test  

##我们需要创建自己的rake,#rails_app/lib/tasks/custom_cc.rake:

	desc 'Custom curise task for RSpec'
	task :cruise do
	  ENV['RAILS_ENV'] = 'test'
	  if File.exists?(Dir.pwd + "/config/database.yml")
		if Dir[Dir.pwd + "/db/migrate/*.rb"].empty?
		  raise "No migration scripts found in db/migrate/ but database.yml exists, " +
			"CruiseControl won't be able to build the latest test database. Build aborted."
		end
		if Rake.application.lookup('db:migrate')
		  Rake::Task['db:migrate'].invoke
		end
	  end
	  Rake::Task['spec:rcov'].invoke
	  if Rake.application.lookup('db:test:purge')
		Rake::Task['db:test:purge'].invoke
	  end
	end

##具体的rspec集成rails使用可以看这里***[Rails3,Rspec,Factory_girl单元&功能测试][2]***

##到这里我们提交修改，启动cc.rb:

	$ cd #cruise_dir/
	$ ./cruise start

##服务启动之后cc.rb自动回去github拿代码，运行测试，下面看看结果,访问http://localhost:3333：

![alt text][3]
![alt text][4]
##cc.rb会记录没次buildlog,和测试情况，以及提交的情况。

##我在ci中常用的功能是当build失败或成功之后发送邮件，下面看如何配置这些，修改～/.cruise/site_config.rb：

	..
	 ActionMailer::Base.smtp_settings = {
	   :address =>        "smtp.gmail.com",
	   :port =>           587,
	   :domain =>         "gmail.com",
	   :authentication => :plain,
	   :user_name =>      "tang.jilong",
	   :password =>       "123",
	   :enable_starttls_auto => true
	 }
	..

##还要修改~/.cruise/projects/everyday/cruise_config.rb,去掉注释：

	project.email_notifier.emails = ['tang.jilong@139.com', 'tang.jilong@gmail.com']
	project.email_notifier.from = 'tang.jilong@gmail.com'

##对于像如何定时，多长时间检查github都可以在这里配置，不详述。

> 到这里一个简单的CI环境就有了，我们还可以完善如将metrical/rcov生成的测试报告自动放到#rails_app/public目录下方便查看，自动启动#rails_app等等...(原创文章)

  [1]: http://cruisecontrolrb.thoughtworks.com/documentation "cc.rb"
  [2]: http://cms.everyday-cn.com/en/show_blog/rails3-rspec-factory_girl "rspec"
  [3]: http://cms.everyday-cn.com/system/pictures/1019/large_build_log.png?1320883392 "build_log"
  [4]: http://cms.everyday-cn.com/system/pictures/1020/large_changeset.png?1320883394 "gitlog"
