---
layout: post
title: Nginx,Passenger,Rails3部署方案
description: Nginx,Passenger,Rails3部署方案
category: RubyOnRails
tags: [Nginx, Rails]
---
上一篇记录文章记录了，rails3的开发环境配置，下面说下rails3的生产环境的部署方案，everyday使用的是nginx+passenger+ubuntu10.04LTS的部署方案：

 - 安装nginx和passenger之前可能需要安装下列依赖包：
<pre>
    $sudo apt-get install build-essential libopenssl-ruby libcurl4-openssl-dev libssl-dev zlib1g-dev
</pre>
 - 还需要安装openssl,在$HOME/.rvm/src/ruby-1.9.2-p180/ext/openssl 执行：
<pre>
    $ruby extconf.rb && make && make install
</pre>
 - 开始安装nginx和passenger
<pre>
    $gem install passenger
    $passenger-install-nginx-module  --对于ubuntu11.10会出现如下错误：
</pre>
    ![alt text][1]
<pre>
    $sudo apt-get install gcc-4.4 g++-4.4 libstdc++6-4.4-dev   --需要装新的依赖包
    $passenger-install-nginx-module
</pre>
 - 安装成功之后修改nginx 配置文件($install_dir/nginx/conf/nginx.conf),内容如下：
<pre>
    .....
    passenger_root /usr/local/rvm/gems/ruby-1.9.2-p290@everyday/gems/passenger-3.0.8;
    passenger_ruby /usr/local/rvm/wrappers/ruby-1.9.2-p290@everyday/ruby;

    include       mime.types;

    default_type  application/octet-stream;

    client_max_body_size 30m; #指定最大上传文件size
    
    sendfile        on;

    keepalive_timeout  65;

    server {
        listen       80;
        server_name  everyday-cn.com;
        root /root/eyd_1.3/everyday/public;
        passenger_enabled on;
        location ~ ^/(images|javascripts|stylesheets)/ {
            root /root/eyd_1.3/everyday/public;
        }
    .....
</pre>
 - nginx可以同时配置多个应用，具体配置参考：[***nginx docs***][2]
 - 最后通过如下命令启动和停止服务：
<pre>
    $ sudo nginx/sbin/nginx
    $ sudo nginx/sbin/nginx -s stop
</pre>
> *注意：当系统存在新建上传文件目录时，记得给相应文件夹权限。* （原创文章）

  [1]: http://www.everyday-cn.com/system/pictures/919/medium_Screenshot%20at%202011-10-25%2020:20:19.png?1319590229 "passenger_error_ubuntu11.10"
  [2]: http://nginx.org/en/docs/ "nginx reference"
