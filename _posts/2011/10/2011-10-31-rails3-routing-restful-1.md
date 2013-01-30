---
layout: post
title: Rails3 Routing构建RESTFUL应用(1)
description: Rails3 Routing构建RESTFUL应用(1)
category: RubyOnRails
keywords: rails3 routing restful
tags: [Rails]
location: Suzhou, China
---
Rails routing 对于初学rails的人来说比较难理解，里面的东西也比较多和杂，需要静下心来慢慢琢磨，下面介绍下我对routing的理解：

##首先我们看下match形式的route,eg:

	match "/patients/:id" => "patients#show"
	这种形式的route将request分发给patents controller中的show方法，需要带id参数。
	view中这样使用:
	  <%= link_to "Patient Record", patient_path(@patient) %>
	  match "/patients/:id" => "patients#show", :as=>:display
	我们还可以自定义path为display,不一定非要使用action name.
	  match 'eydf_home/rss_feed' => 'eydf_home#rss_feed', :as => :rss_feed, :defaults=> {:format => 'atom'} 
	将request 分发给eydf_home controller中的rss_feed方法，还会设置params[:format] ='atom'

##关于Resource的routing,rails应用请求web页面通过特定的http 方法如：GET, POST, PUT , DELETE,每个http请求的方法都对应到相应的controller中的index/show/edit/update/new/create/destroy中，eg:

	resources :photos
	将产生如下不同的7个routes,对应到photos controller:

	GET 	/photos 	index 	display a list of all photos
	GET 	/photos/new 	new 	return an HTML form for creating a new photo
	POST 	/photos 	create 	create a new photo
	GET 	/photos/:id 	show 	display a specific photo
	GET 	/photos/:id/edit 	edit 	return an HTML form for editing a photo
	PUT 	/photos/:id 	update 	update a specific photo
	DELETE 	/photos/:id 	destroy 	delete a specific photo 
	可以通过以下命令查看route的详细信息：
	  $rake routes
	当有需求要定义一组controller在一个namespace下面，eg:
	namespace :admin do
	  resources :posts, :comments
	end
	可以得到如下routes:
	GET 	/admin/posts 	index 	admin_posts_path
	GET 	/admin/posts/new 	new 	new_admin_post_path
	POST 	/admin/posts 	create 	admin_posts_path
	GET 	/admin/posts/:id 	show 	admin_post_path(:id)
	GET 	/admin/posts/:id/edit 	edit 	edit_admin_post_path(:id)
	PUT 	/admin/posts/:id 	update 	admin_post_path(:id)
	DELETE 	/admin/posts/:id 	destroy 	admin_post_path(:id) 
	可以看到都在admin的namespace下面。
	如果posts controller不在admin目录下，可这样配置：
	scope :module => "admin" do
	  resources :posts, :comments
	end

##我们可以给resource 添加member routes 增加preview方法:

	resources :photos do
	  member do
		get 'preview'
	  end
	end

##直接定义controller方式 eg:

    controller :eyd_avatar do
		get 'avatar_index' => :index
		get 'avatar_show/:id' => :show, :as => :avatar_show
		get 'avatar_new' => :new
		post 'avatar_upload' => :upload
		delete 'avatar_destroy' => :destroy
    end

> 还有很多route的复杂用法，到时用到了再更新，详细的资料可以参考[Rails3 Routing][1]
[1]: http://guides.rubyonrails.org/routing.html#changelog "routing"
