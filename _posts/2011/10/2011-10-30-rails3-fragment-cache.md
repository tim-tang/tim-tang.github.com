---
layout: post
title: Rails3,fragment cache 缓存局部页面
description: Rails3,fragment cache 缓存局部页面
category: RubyOnRails
keywords: rails3 fragment cache
tags: [Rails]
location: Suzhou, China
alias: [/RubyOnRails/2011/10/30/rails3-fragment-cache]
---
一直想对页面不经常更新的部分做缓存，看了下关于rails缓存的内容，觉得fragment缓存可以用，于是把everyday页面右边的博客分类/标签云/最近评论/博客归档都做了fragment缓存，果然页面加载快了很多，不用每次都读数据库，只要在需要更新的时候清缓存即可，下面介绍下实现：

##首先找到要加缓存的fragment,增加如下代码：
	<%cache 'comment_fragment' do%>
	...
	<% end %>

##下面我们在app/下新建sweepers目录(用于存放model的sweeper)，创建eyd_comment_sweeper.rb(在create,destroy时expire_fragment),代码如下：

	class EydCommentSweeper < ActionController::Caching::Sweeper
	  observe EydComment
	  def after_save(comment)
		expire_cache(comment)
	  end
	  def after_destory(comment)
		expire_cache(comment)
	  end
	  def expire_cache(comment)
		expire_fragment 'comment_fragment'
	  end
	end

##修改相应的controller,增加代码：

	cache_sweeper :eyd_comment_sweeper, :only=>[:create,:destroy]

##修改fetch_comments方法如下：

	def fetch_comments
	   **unless read_fragment('comment_fragment')**
		 @comments = EydComment.find_by_sql("select comment.* from eyd_comments comment where comment.is_guestbook = false order by comment.updated_at desc limit 5")
	   **end**
	end

##最后别忘了修改config/enviroments/development.rb:

	config.action_controller.perform_caching = true

##启动服务，查看log可以看到如下(已经不再读db,而是直接读取缓存)：

	Exist fragment? views/comment_fragment (0.0ms)
	Read fragment views/comment_fragment (0.0ms)
	Rendered eydf_home/_comments.html.erb (1.0ms)
> 现在页面的速度比以前提高很多，希望对大家有用！（原创文章）
