---
layout: post
title: "Rails3,GridFS,MongoID,CarrierWave实现图片上传"
description: "Rails3, MongoID, CarrierWave使用MongoDB的GridFS作为图片存储,实现图片上传功能"
category: RubyOnRails
keywords: rails3 gridfs mongoid carrierwave photo upload
tags: [Rails, MongoDB]
location: Suzhou, China
alias: [/RubyOnRails/2012/05/24/rails3gridfsmongoidcarrierwave]
---

最近准备将Everyday CMS的数据存储由MySQL切换到MongoDB,作为实验先探探路，看看能不能用MongoDB的GridFS来存储图片，下面具体的实现：

## 首先环境准备：Rails 3.1.3/Ruby 1.9.2p320/MongoDB 已经安装并启动.

## 创建app

	$ rails new demo

## 修改Gemfile文件，加入如下Gems

	gem 'mongoid' #2.4.10
	gem 'bson_ext' #1.6.2
	gem 'carrierwave' #0.5.8
	gem 'carrierwave-mongoid', :require => 'carrierwave/mongoid' #0.1.7
	gem 'mini_magick' #3.4

## 生成mongoid.yml

	$ rails g mongoid:config

## 通过修改 config/application.rb去掉对默认数据库依赖

	require 'rails/all'
	require "action_controller/railtie"
	require "action_mailer/railtie"
	require "active_resource/railtie"
	require "rails/test_unit/railtie"

## 继续添加以下代码，防止 error mongoid not found 的问题

	config.generators do |g|
	  g.orm :active_record
	end

## 删除默认的 config/database.yml，并用scaffold创建blog应用:

	$ rm -f config/database.yml
	$ rails g scaffold blog name:string content:text

## 添加carrierwave配置文件 config/initializers/carrierwave.rb

	CarrierWave.configure do |config|
	  config.storage = :grid_fs
	  config.grid_fs_access_url = ""
	  config.grid_fs_database = Mongoid.database.name
	  config.grid_fs_host = Mongoid.config.master.connection.host
	end

## 生成File Uploader

	$ rails g uploader File

## 修改app/uploaders/file_uploader.rb

	class FileUploader < CarrierWave::Uploader::Base
	  include CarrierWave::MiniMagick
	  # Choose what kind of storage to use for this uploader:
	  storage :grid_fs
	  # Override the directory where uploaded files will be stored.
	  def store_dir
		"uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
	  end
	  def default_url
		 "/uploads/fallback/" + [version_name, "default.png"].compact.join('_')
	  end
	  # Create different versions of your uploaded files:
	  version :thumb do
		 process :resize_to_fill=> [50, 50]
	  end
	  version :normal do
		 process :resize_to_fill => [150, 200]
	  end
	  version :big do
		 process :resize_to_fill => [250, 300]
	  end
	  version :large do
		 process :resize_to_fill => [350, 400]
	  end
	  def extension_white_list
		 %w(jpg jpeg gif png)
	  end
	  def filename
		 "something.jpg" if original_filename
	  end
	end

## 生成生成gridfs的controller

	$ rails g controller gridfs

## 修改GridfsController,内容如下

	class GridfsController < ActionController::Metal
	  def serve
		gridfs_path = env["PATH_INFO"].gsub("/uploads/", "uploads/")
		begin
		  puts "---------------------------------------"
		  puts gridfs_path
		  puts Mongoid.database.name
		  puts "---------------------------------------"
		  gridfs_file = Mongo::GridFileSystem.new(Mongoid.database).open(gridfs_path, 'r')
		  self.response_body = gridfs_file.read
		  self.content_type = gridfs_file.content_type
		rescue Exception => e
		  self.status = :file_not_found
		  Rails.logger.debug { "#{e}" }
		  self.content_type = 'text/plain'
		  self.response_body = ''
		  raise e
		end
	  end
	end

## 修改routes.rb，使开发模式下，通过gridfs这个controller来管理图片文件

	if Rails.env.development?
	  match "/uploads/*path" => "gridfs#serve"
	end

## 修改app/models/blog.rb，添加file字段，并挂载uploader, 注意这里不再继承active record.

	class Blog
	 include Mongoid::Document
	   field :name
	   field :content
	   field :file
	   mount_uploader :file, FileUploader
	end

## 修改app/views/blogs/_form.html.erb，在content表单项下面添加图片上传

    <%= f.label :file %>
    <%= f.file_field :file %>

## 修改 app/views/blogs/index.html.erb, 用来展现上传的图片

	<%= blog.file.size %>
	<%= blog.file.filename%>
	<%= image_tag blog.file_url(:thumb)%>
	<%= image_tag blog.file_url(:normal)%>
	<%= image_tag blog.file_url(:big)%>
	<%= image_tag blog.file_url(:large)%>

## 到这里终于可以启动服务，上传图片了，看看结果

![carrierwave-mogoid](/images/post/carrierwave-mongoid.png){:width=600}

## 再看mongodb的查询结果，多了三个collection以及对于的储存记录

![mogo-result](/images/post/mongodb-result.png){:width=600}

> 注意:尽量不要在rails3.1以下版本操作，否则会出现无法集成mongoid的问题，OK JSUT DO IT!
