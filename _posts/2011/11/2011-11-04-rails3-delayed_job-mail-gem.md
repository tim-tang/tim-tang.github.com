---
layout: post
title: Rails3,delayed_job,mail gem异步发送邮件实现
description: Rails3,delayed_job,mail gem异步发送邮件实现
category: RubyOnRails
keywords: rails3 delayed job mail
tags: [RubyGem, Rails]
location: Suzhou, China
alias: [/RubyOnRails/2011/11/04/rails3-delayed_job-mail-gem]
---
我们经常在项目中遇到发送email给指定的用户，而发送的邮件的工作需要在后台作为job异步的执行，那么在rails中如何实现，我们这里就介绍一下使用[**delayed job**][1]作为后台的异步工作队列，使用rails的mailer来发送邮件，下面看详细的实现：

##首先我们安装delayed_job gem:

	$ gem install delayed_job

##修改#rails_app/Gemfile增加:

	gem 'delayed_job'

##执行如下命令生成#rails_app/db/migrate/20111103030129_create_delayed_jobs.rb

	$ rails g delayed_job

##同步到db:

	$ rake db:migrate

##我们可以看到生成的表的字段描述：

	create_table :delayed_jobs, :force => true do |table|
	  table.integer  :priority, :default => 0      # Allows some jobs to jump to the front of the queue
	  table.integer  :attempts, :default => 0      # Provides for retries, but still fail eventually.
	  table.text     :handler                      # YAML-encoded string of the object that will do work
	  table.text   :last_error                   # reason for last failure (See Note below)
	  table.datetime :run_at                       # When to run. Could be Time.zone.now for immediately, or sometime in the future.
	  table.datetime :locked_at                    # Set when a client is working on this object
	  table.datetime :failed_at                    # Set when all retries have failed (actually, by default, the record is deleted instead)
	  table.string   :locked_by                    # Who is working on this object (if locked)
	  table.timestamps
	end

##我们还可以自定义delayed job配置如下：

	Delayed::Worker.destroy_failed_jobs = false     
	Delayed::Worker.sleep_delay = 30                 #job delayed time
	Delayed::Worker.max_attempts = 3                #job retry times
	Delayed::Worker.max_run_time = 5.minutes   #max job running time
	Delayed::Worker.delay_jobs = true                  #delayed /real time switcher

##到这里delayed job的安装基本配置结束，我们稍后说使用，先看看mailer的安装配置：

	$ gem install mail

##修改#rails_app/Gemfile增加：

	gem "mail", "~> 2.3.0"

##修改#rails_app/config/enviroments/development.rb:
	....
	  config.action_mailer.raise_delivery_errors = true  #去掉注释
	  config.action_mailer.delivery_method = :smtp     #增加
	....

##在#rails_app/config/initializers/下新建setup_mail.rb:

	require 'eyd_mail_interceptor'    #需要引入，稍后给出实现
	ActionMailer::Base.smtp_settings = {
	  :address => "smtp.gmail.com",
	  :port => 587,
	  :domain => "gmail.com",
	  :user_name => "tang.jilong",
	  :password => "***",
	  :authentication => "plain",
	  :enable_starttls_auto => true
	}
	ActionMailer::Base.default_url_options[:host] = "localhost:3000"
	Mail.register_interceptor(EydMailInterceptor)

##在#rails_app/lib下新建eyd_mail_interceptor.rb:

	class EydMailInterceptor
	  def self.delivering_email(message)
		message.subject = "#{message.to} #{message.subject}"
		message.to = "tang.jilong@139.com"
	  end
	end

##我们还需要新建#rails_app/app/mailer/eyd_mailer.rb,配置要发送的信息:

	class EydMailer < ActionMailer::Base
	  default :from => "tang.jilong@gmail.com"
	  def mail_new_posts
		attachments["wmd-buttons.png"] = File.read("#{Rails.root}/public/images/wmd-buttons.png")
		mail(:to => "tang.jilong <tang.jilong@139.com>", :subject => "This is my first Everyday email")
	  end
	end

##现在我们就可以在controller中使用如下代码异步发送邮件了：

	....
	EydMailer.delay.mail_new_posts       #不需要deliver方法
	....

##在后台我们可以通过如下命令查看job是否被成功执行:

	$ bundle exec rake jobs:work

##如果job成功执行，delayed_jobs表生成一条数据

##我们有时需要清空job队列，可执行：

	$ bundle exec rake jobs:clear  #同时清空delayed_jobs表

##我们可以执行下controller中的action,看看邮件有没有发送成功,结果：
![delayed_job][2]

> 好大功告成！（原创文章）

  [1]: https://github.com/collectiveidea/delayed_job "delayed job"
  [2]: http://cms.everyday-cn.com/system/pictures/972/large_everyday_139.png?1320368578 "mail"
