---
layout: post
title: Rails3,Rspec,Factory_girl单元功能测试
description: Rails3,Rspec,Factory_girl单元功能测试
category: RubyOnRails
keywords: rails3 rspec factory_girl
tags: [Rails, RubyGem]
location: Suzhou, China
alias: [/RubyOnRails/2011/11/09/rails3-rspec-factory_girl]
---
Rspec使用行为驱动开发（Behaviour-driven development）,它从外围的业务成果的定义开始，然后深入到那些实现这个成果的功能块上。每一个功能都被收集成一个故事，它按照验收标准来定义这个功能的范围。在everyday中使用了一下，确实发现Rspec可以把测试用例写得更加易于理解。下面来看看如何用Rspec讲故事:

##先从安装说起：

	$ gem install rspec
	$ gem install rspec-rails
	$ gem install factory_girl_rails   #用factory_girl替代rails自带的fixture,因为它更加灵活
	$ gem install mocha    #rspec mock对方法对象的gem
	$ gem install rcov     #生成测试报告及代码的覆盖度gem

##修改Gemfile,添加如下：

	group :development, :test do
	  gem "rspec", "~> 2.7.0"
	  gem "rspec-rails", "~> 2.7.0"
	  gem "factory_girl_rails"
	  gem "rcov"
	  gem "mocha"
	end

##在rails_app中安装rspec：

	$ rails generate rspec:install   #生成#rails_app/spec/目录和#rails_app/spec/spec_helper.rb

##现在准备工作完成，我们首先写model的测试用例，以eyd_user 为例，创建#rails_app/spec/support/factory_girl.rb

	Factory.define :user, :class=>EydUser do |f|
	  f.id 1
	  f.name 'tim.tang'
	  f.hashed_password 'f154b034cf1e3dad29377e2b4496516889a8c60'
	  f.salt '833156400.9654452857118'
	  f.email 'tang.jilong@139.com'
	end

##我们还需要一个创建#rails_app/spec/models/eyd_user_spec.rb(注意命名规则)

	require 'spec_helper'
	describe EydUser do
	  before(:all) do
		@user = Factory.build(:user)   #在测试前创建@user实例
		@user.save
	  end
	  it "validates user name should be unique" do
		puts @user.errors.inspect
		@user.should be_valid
	  end
	  it "validates user name should not unique" do
		user = EydUser.new(:id=>2, :name=>'tim.tang')
		user.save
		user.should_not be_valid
	  end
	  it "validates password confirmation should not be same" do
		user = EydUser.new(:id=>2, :name=>'tim',:password=>'tim.tang', :password_confirmation=>'tim')
		user.save
		puts user.errors.inspect
		user.should_not be_valid
	  end
	  it "validates password confirmation should be same" do
		user = EydUser.new(:id=>2, :name=>'tim', :password=>'tim.tang', :password_confirmation=>'tim.tang')
		user.save
		puts user.errors.inspect
		user.should be_valid
	  end
	  it "should authenticate with matching username&password" do
		EydUser.authenticate('tim.tang','tim83tang').should == @user
	  end
	  it "should authenticate with incorrect username&password" do
		EydUser.authenticate('tim.tang','tim.tang').should be_nil
	  end
	  after(:all) do
		@user.delete #测试结束删除
	  end
	end

##下面我们可以用命令执行：

	$ rake spec #将自动执行spec目录下所有测试用例

##以上是model的测试，我们再看看controller的测试,新建#rails_app/spec/controllers/eyd_login_controller_spec.rb：

	require 'spec_helper'
	describe EydLoginController do
	  render_views
	  describe "showing up the login screen" do
		it "should start with /login" do
		  get 'login'
		  response.should be_success
		end
	  end
	  describe "login into admin" do
		before(:all) do
		  @user = Factory.build(:user)
		  @user.save
		end
		it "should login success" do
		  EydUser.stubs(:authenticate).returns(@user)
		  post 'authentication'
		  flash[:notice].should == "User #{@user.name} login success"
		  response.should redirect_to(avatar_index_path)
		end
		it "should login failure" do
		  EydUser.stubs(:authenticate).returns(nil)
		  post 'authentication'
		  response.should redirect_to(login_path)
		end
		after(:all) do
		  @user.delete
		end
	  end
	  describe "logout admin" do
		it "should logout success" do
		  post 'destroy'
		  response.should redirect_to(login_path)
		end
	  end
	end

##我们可以通过如下命令，执行测试并生成测试报告：

	$ rake spec:rcov

##下面看测试结果以及代码覆盖情况：
![alt text][1]

##具体的model和controller的代码覆盖：

![alt text][2]
![alt text][3]

> 具体rspec方面的书可以到这里下载[***The_Rspec_Book***][4],有空介绍下和CI的集成。（原创文章）

[1]: http://cms.everyday-cn.com/system/pictures/1010/large_overview_rspec.png?1320803540 "cover"
[2]: http://cms.everyday-cn.com/system/pictures/1009/large_eyd_user.png?1320803537 "rsec"
[3]: http://cms.everyday-cn.com/system/pictures/1011/large_spec_eyd_controller.png?1320803542 "a"
[4]: http://cms.everyday-cn.com/zh/ibook_download/12 "the rspec book"
