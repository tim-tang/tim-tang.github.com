---
layout: post
title: Rails3,MongoDB,MongoID完整实例
description: Rails3,MongoDB,MongoID完整实例
category: RubyOnRails
tags: [Rails, MongoDB]
---
一直想尝试下rails3和mongodb,mongoid的集成使用，网上找了一圈没发现有好的文档，最后只能自己动手了，主要参考了railscasts和mongoid的官方文档，下面介绍下具体实现:

 - 前提条件MongoDB已经成功安装，具体安装可参考：[*Ubuntu11.10,MongoDB安装测试*][1]
 - 下面开始安装mongid gem:
<pre>
$ gem install mongoid bson_ext
</pre>
 - 创建blog_mongo项目：
<pre>
$ rails new blog_mongo
</pre>
 - 修改项目的Gemfile,添加：
<pre>
$ gem "mongoid", "~> 2.3"
$ gem "bson_ext", "~> 1.4"
</pre>
 - 运行如下命令找到相应的依赖gem(依赖rails3.1)
<pre>
$ bundle install
</pre>
 - 接下来我们需要产生config/mongid.yml
<pre>
$ rails g mongoid:config
</pre>
 - 原来的database.yml已经没有用了，我们通过修改blog_mongo/config/application.rb，来删除它:
<pre>
*#require 'rails/all'*   --删除
require "action_controller/railtie"
require "action_mailer/railtie"
require "active_resource/railtie"
require "rails/test_unit/railtie"
</pre>
<pre>
$ rm -f blog_mongo/config/database.yml
</pre>
 - 现在我需要产生一个blog的scaffold
![mongoid][2]
 - 和一个comment的model

![comment][3]
 - 下面我们需要修改相应的文件，首先是blog_mongo/app/models/blog.rb：
<pre>
class Blog
  include Mongoid::Document
  field :name
  field :content
  validates_presence_of :name
  embeds_many :comments
end
</pre>
 - 其次是blog_mongo/app/models/comment.rb
<pre>
class Comment
  include Mongoid::Document
  field :name
  field :content
  embedded_in :blog, :inverse_of => :comments
end
</pre>
 - 从上面的修改可以看出blog和comment是一对多关系，下面修改blog_mongo/config/routes:
<pre>
resources :blogs do 
    resources :comments
end
</pre>
 - 到这里我们还需要产生一个comment的controller:
![controller][4]
 - 修改blog_mongo/app/controllers/comments_controller.rb增加方法：
<pre>
def create
    @blog = Blog.find(params[:blog_id])
    @comment = @blog.comments.create!(params[:comment])
    redirect_to @blog, :notice => "Comment created!"
end
</pre>
 - 修改blog_mongo/app/views/blogs/show.html.erb,增加:
[code:html]
...
<% if @article.comments.size > 0 %>
  <p>Comments</p>
  <% for comment in @article.comments %>
    <p><%= comment.name %></p>
    <p><%= comment.content %></p>
  <% end %>
<% end %>
<p>New Comment</p>
<%= form_for [@article, Comment.new] do |f| %>
  <p><%= f.label :name %> <%= f.text_field :name %></p>
  <p><%= f.text_area :content, :rows => 10 %></p>
  <p><%= f.submit %></p>
<% end %>
....
</pre>
 - 运行服务器,访问页面会看到如下错误：
<pre>
Undefined method debug_rjs= for ActionView::Base Class
</pre>
 - 原来是rails3.1已经不使用debug_rjs,修改blog_mongo/config/environments/development.rb:
<pre>
*#config.action_view.debug_rjs  = true*
</pre>
 - 启动服务就可有正常运行了，下面看看运行结果：
![alt text][5]

> (原创文章)

  [1]: http://tim.everyday-cn.com/zh/show_blog/ubuntu11-10-mongodb "MongoDB Installation"
  [2]: http://cms.everyday-cn.com/system/pictures/953/large_mongo_scaffold.png?1320105964 "scaffold"
  [3]: http://cms.everyday-cn.com/system/pictures/950/large_g_model.png?1320105960 "mongoid comment"
  [4]: http://cms.everyday-cn.com/system/pictures/949/large_g_controller_comments.png?1320105958 "controller"
  [5]: http://cms.everyday-cn.com/system/pictures/954/large_Screenshot.png?1320108987 "result"
