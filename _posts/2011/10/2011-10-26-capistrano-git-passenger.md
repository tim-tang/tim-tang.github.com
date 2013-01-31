---
layout: post
title: 打造Capistrano,Git,Passenger自动部署环境
description: 打造Capistrano,Git,Passenger自动部署环境
category: RubyOnRails
keywords: ROR capistrano git passenger deployment
tags: [Git, RubyGem]
location: Suzhou, China
alias: [/RubyOnRails/2011/10/26/capistrano-git-passenger]
---
对于rails应用capistrano提供的很好的自动化部署方案，支持部署版本的回滚，和github,svn等scm服务器有不错的集成，介绍下目前everyday所使用到的capistrano配置方案：

##安装capistrano gem.

    $gem install capistrano
    $cap -V         --检查安装是否正确
    $cap -T         --查看capistrano 命令
##让你的rails app 使用git hub,可以注册一个github帐号，具体的github安装配置参考[利用Github管理Rails代码][1]。

##进入～/Documents/everyday目录：

    $cap .            -- 生成Capfile & config/deploy.rb
    $cap deploy:setup   --生成release/shared目录
    $cap deploy:check   --检查capistrano 所需要的环境是否满足
##修改config/deploy.rb文件，下面是everyday的例子：

    set :application, "everyday"
    set :repository,  "git@github.com:tim-tang/everyday.git"
    set :branch, "master"
    set :deploy_via, :remote_cache
    set :scm, :git
    set :scm_username, "tang.jilong@139.com"   
    set :scm_passphrase, "*****"
    set :use_sudo,   false 
    set :deploy_to,   "/home/tim-tang/Documents/#{application}"
    set :user, "root"
    set :password, "*****"
    ssh_options[:forward_agent] = true
    server "192.168.1.104", :app, :web, :db, :primary => true
    namespace :deploy do
      task :start, :roles => :app, do  
        invoke_command "/home/tim-tang/nginx/sbin/nginx"
      end
      task :stop, :roles => :app,  do 
        invoke_command "/home/tim-tang/nginx/sbin/nginx -s stop"
      end
      task :restart, :roles => :app, :except => { :no_release => true } do
        run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
        invoke_command "/home/tim-tang/nginx/sbin/nginx -s stop"
        invoke_command "/home/tim-tang/nginx/sbin/nginx"
      end
    end
##还需要修改下nginx的配置，~/nginx/conf/nginx.conf

    ......
    root /home/tim-tang/Documents/everyday/current/public;  --将原来的部署目录指到current下面。
    ......

##最后可以执行如下命令部署，将从github同步代码，并且自动重启nginx服务器。

    $cap deploy:cold  ---冷部署第一次使用
    $cap deploy   ---- 以后每次可以用

> 这样我们可以用shell+crontab让capistrano定时去部署master上的代码。（原创文章）
  [1]: http://tim.everyday-cn.com/en/show_blog/245 "git config"
