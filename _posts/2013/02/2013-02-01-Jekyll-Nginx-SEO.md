---
layout: post
title: "Jekyll and  Nginx SEO  tricks"
description: "最近折腾Jekyll和Nginx的SEO调优的一些经验"
category: Misc
keywords: Nginx Jekyll SEO Gzip
tags: [Nginx]
location: Suzhou, China
---

最近把tech talkin做了一下seo,发现还挺有意思，积累了一些这方面的东西分享一下。

### Jekyll方面：
---

- 生成[sitemap.xml](http://timtang.me/sitemap.xml)使用[Sitemap.xml Generator](http://www.kinnetica.com/projects/jekyll-sitemap-generator/)

> 注意如果使用Git Pages服务这个plugin是不会生成sitemap.xml的，github会认为你的plugin是不安全的，这种方式一般在自己的服务器上使用，如果使用github的服务可以参考:[sitemap.xml](https://github.com/tim-tang/tim-tang.github.com/blob/master/sitemap.xml)

- 可以将生成的sitemap.xml提交到[google webmaster](http://www.google.com/webmasters/), [baidu 站长工具](http://zhanzhang.baidu.com/?castk=LTE%3D)等

- 在页面header里面添加meta/rss信息方便搜索引擎抓取

- 合并javascript/css文件，并用[YUI Compressor](http://yui.github.com/yuicompressor/)压缩，加快文件加载速度减少请求次数

- 将页面中的javascript引用放到页面的最下端</body>标签前,加快页面加载

- 设置jekyll config.yml的permalink,避免将来分类修改导致搜索引擎中有死链接：

> permalink: /blog/:year/:month/:day/:title

- 如何在搜索引擎中已经有死链接，可以使用Jekyll plugin:[Alias Generator](https://github.com/tsmango/jekyll_alias_generator)去修复

- 还有就是注意页面的keywords/title/tags/等关键字，增加外链接等...最重要的还是文章质量

### 关于Nginx的一些调优
---

## 使用Gzip压缩页面，具体配置(需要重启Nginx)：

    gzip on; #开启Gzip
    gzip_min_length 1k; #不压缩临界值，大于1K的才压缩，一般不用改
    gzip_buffers 4 16k;
    gzip_comp_level 2; #压缩级别，1-10，数字越大压缩的越好，时间也越长,自己看情况
    gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png; #进行压缩的文件类型
    gzip_vary off;
    gzip_disable "MSIE [1-6]\."; #忽视IE6

## 用curl测试Gzip是否成功开启:

    curl -I -H "Accept-Encoding: gzip, deflate" "http://timtang.me"

    HTTP/1.1 200 OK
    Server: nginx/1.0.5
    Date: Fri, 01 Feb 2013 01:25:10 GMT
    Content-Type: text/html
    Last-Modified: Thu, 31 Jan 2013 13:06:13 GMT
    Connection: keep-alive
    Content-Encoding: gzip #测试结果gzip

## 有时我们会遇到<http://timtang.me>和<http://www.timtang.me>可以同时访问会分散搜索引擎的抓取，更重要的是可能更换域名后造成死链接，避免这些问题可以配置URL rewrite在server节点下面:

    error_page 404 = /404.html;
    if ($host != 'timtang.me' ) {
       rewrite ^/(.*)$  http://timtang.me/$1 permanent;
    }

> 做SEO也是个技术活，以上只是一些粗浅的经验，慢慢积累, Cheers!
