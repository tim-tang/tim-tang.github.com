---
layout: post
title: Rails3,ruby-debug19调试攻略
description: Rails3,ruby-debug19调试攻略
key: []
---
在之前的j2ee的项目中经常需要debug复杂的逻辑的代码，但在rails3的项目中如何来使用debug功能，这个也是一直想了解的，任何项目都可能有复杂逻辑，网上找了一圈资料，下面介绍下如何安装和使用ruby-deug在rails3环境下：

 - 首先还是安装ruby-debug gem(在rails3环境下比较特殊):
<pre>
$ gem install ruby-debug19 -- --with-ruby-include=$rvm_path/src/ruby-1.9.2-rc2/
$ gem install ruby-debug-ide19 -- --with-ruby-include=$rvm_path/src/ruby-1.9.2-rc2/  #可选
</pre>
 - 修改Gemfile：
<pre>
gem 'ruby-debug19', :require => 'ruby-debug'
</pre>
 - 在你的rails_app中在需要调试的代码前加入：
<pre>
 def show_blog
    debugger
    @blog = EydBlog.find(params[:id])
    @total_comments = EydComment.paginate_by_sql ["select comment.* from eyd_comments comment where comment.blog_id=#{@blog.id} order by comment.updated_at asc"], :page => params[:page], :per_page=>10
 end
</pre>
 - 以debug模式启动rails服务：
<pre>
$ rails s --debugger
</pre>
 - 当执行到show_blog方法时进入断点：
<pre>
/home/tim-tang/Documents/everyday/app/controllers/eydf_home_controller.rb:80
@blog = EydBlog.find(params[:id])
(rdb:8) list
[75, 84] in /home/tim-tang/Documents/everyday/app/controllers/eydf_home_controller.rb
   75      @total_blogs = EydBlog.paginate_by_sql ["select blog.* from eyd_blogs blog where blog.user_id=2 and blog.is_draft=false order by blog.created_at desc"], :page => params[:page], :per_page=>20
   76    end
   77  
   78    def show_blog
   79      debugger
=> 80      @blog = EydBlog.find(params[:id])
   81      @total_comments = EydComment.paginate_by_sql ["select comment.* from eyd_comments comment where comment.blog_id=#{@blog.id} order by comment.updated_at asc"], :page => params[:page], :per_page=>10
   82      @prev_next_blogs = EydComment.find_by_sql("SELECT * FROM eyd_blogs WHERE user_id = #{session[:userId]} and id IN (SELECT CASE WHEN SIGN(id - #{@blog.id}) > 0 THEN MIN(id) WHEN SIGN(id - #{@blog.id}) < 0 THEN MAX(id) END AS id FROM eyd_blogs WHERE id <> #{@blog.id} GROUP BY SIGN(id - #{@blog.id}) ORDER BY SIGN(id - #{@blog.id})) ORDER BY id ASC")
   83      if @prev_next_blogs.size >1
   84        @prev_blog = @prev_next_blogs[1]
(rdb:8) 

</pre>
 - 我们可以用list命令看到当前执行到了80行，用next命令执行一行，看@blog变量内容如下：
<pre>
(rdb:8) next
/home/tim-tang/Documents/everyday/app/controllers/eydf_home_controller.rb:81
@total_comments = EydComment.paginate_by_sql ["select comment.* from eyd_comments comment where comment.blog_id=#{@blog.id} order by comment.updated_at asc"], :page => params[:page], :per_page=>10
(rdb:8) list
[76, 85] in /home/tim-tang/Documents/everyday/app/controllers/eydf_home_controller.rb
   76    end
   77  
   78    def show_blog
   79      debugger
   80      @blog = EydBlog.find(params[:id])
=> 81      @total_comments = EydComment.paginate_by_sql ["select comment.* from eyd_comments comment where comment.blog_id=#{@blog.id} order by comment.updated_at asc"], :page => params[:page], :per_page=>10
   82      @prev_next_blogs = EydComment.find_by_sql("SELECT * FROM eyd_blogs WHERE user_id = #{session[:userId]} and id IN (SELECT CASE WHEN SIGN(id - #{@blog.id}) > 0 THEN MIN(id) WHEN SIGN(id - #{@blog.id}) < 0 THEN MAX(id) END AS id FROM eyd_blogs WHERE id <> #{@blog.id} GROUP BY SIGN(id - #{@blog.id}) ORDER BY SIGN(id - #{@blog.id})) ORDER BY id ASC")
   83      if @prev_next_blogs.size >1
   84        @prev_blog = @prev_next_blogs[1]
   85        @next_blog = @prev_next_blogs[0]
(rdb:8) @blog
#<EydBlog id: 235, title: "睡着也能拉便便", author: "lisa.dong", video_url: "", content: "![][1] \n![][2] \n![][3] \n 这两天yoyo每天到了早晨六点多，就闭着眼睛在床上扭...", constant_id: 2, user_id: 1, is_draft: false, created_at: "2011-10-21 11:49:15", updated_at: "2011-11-04 03:46:17", view_count: 38, slug: nil>
(rdb:8) 
</pre>
 - 这样我们就可以看到@blog变量的内容了，下面看下相关的debug命令的使用：
<pre>
help 	Display help information
l 	list: Show the code
where or backtrace 	Print application backtrace
frame 3 	Move to backtrace 3
up 3 	Move up 3 backtrace
down 3 	Move down 3 backtrace
thread 	Shows the current thread
thread list 	List all threads and their statuses
thread stop 3 	Stop thread 3
thread resume 3 	Resumes thread 3
thread switch 3 	Switches the current thread context to 3
instance_variables 	Print instance variables
instance_variables.include? "@account" 	Is account initialized
next 	Execute next line (Step over)
step 3 or step -3 	Move forward or backward
v const T1 	Show constant
v g 	Show global variables
v i o1 	show instance variables o1
v l 	Show locals
v i Account.new 	Execute a method
pp Ruby_Expression 	Pretty print a value of a Ruby expression
display @account 	Watch a variable
undisplay 3 	Un-display the watched variable 3
break 10 	Break at line 10
break account.rb:10 [if expression] 	Set breakpoint in a file with an optional if conditional
break Account#view [if expression] 	Set breakpoint in a instance method
break Account.view [if expression] 	Set breakpoint in a class method
info breakpoints 	List breakpoints
delete 3 	Delete breakpoint
c 	Resume execution after a break point
fin 	finish until the current selected frame
fin 3  finish after frame 3
tm 3 	textmate frame 3
edit account.rb:10 	edit file at line 10
q 	quit
</pre>

> 目前开发everyday用到debug的机会比较少，从长远项目角度来看debug始终是必不可少的。（原创文章）
