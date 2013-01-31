---
layout: post
title: 使用bundler管理gems
description: 使用bundler管理gems
category: RubyOnRails
keywords: bundler gems
tags: [Rails, RubyGem]
location: Suzhou, China
alias: [/RubyOnRails/2011/11/15/bundler-gems]
---
#### Bundle介绍 ##

Rails 3中引入Bundle来管理项目中所有gem依赖，该命令只能在一个含有Gemfile的目录下执行，如rails 3项目的根目录。

##关于Gemfile和Gemfile.lock

所有Ruby项目的信赖包都在Gemfile中进行配置，不再像以往那样，通过require来查找。Rails 3中如果需要require某个gem包，必须通过修改Gemfile文件来管理。
Gemfile.lock则用来记录本机目前所有依赖的Ruby Gems及其版本。所以强烈建议将该文件放入版本控制器，从而保证大家基于同一环境下工作。

#### Bundle命令详解 ##

##显示所有的依赖包

	$ bundle show

##显示指定gem包的安装位置

	$ bundle show [gemname]

##检查系统中缺少那些项目以来的gem包

	$ bundle check

##安装项目依赖的所有gem包

	$ bundle install

##安装指定的gem包

	$ bundle install [gemname]

##更新系统中存在的项目依赖包，并同时更新项目Gemfile.lock文件

	$ bundle update

##更新系统中指定的gem包信息，并同时更新项目Gemfile.lock中指定的包信息

	$ bundle update [gemname]

##可以使用bundle lock来锁定当前环境，这样便不能通过bundle update来更新依赖包的版本，保证了统一的环境

	$ bundle lock

##解除锁定

	$ bundle unlock
##bundle package会把当前所有信赖的包都放到 ./vendor/cache/ 目录下，发布时可用来保证包版本的一致性。

	$ bundle package
##bundle open打开gem的源码查看，首先要设置编辑器

	export EDITOR='vim' \#在.bashrc中设置
	$ bundle open xxgem

> 关于bundle 的东西比较基础，希望对大家有帮助！
