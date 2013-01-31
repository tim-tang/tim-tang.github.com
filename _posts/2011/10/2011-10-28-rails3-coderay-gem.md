---
layout: post
title: Rails3,CodeRay gem 高亮代码
description: Rails3,CodeRay gem 高亮代码
category: RubyOnRails
keywords: rails3 coderay highlight
tags: [Rails, RubyGem]
location: Suzhou, China
alias: [/RubyOnRails/2011/10/28/rails3-coderay-gem]
---
由于使用的wmd编辑器对代码支持不是很好，写博客一直困扰于代码的语法无法高亮，于是在网上找到了CodeRay的rails gem, 看起来效果还不错，好像railscasts也是用的这个gem,下面介绍下这个plugin的使用:

##安装coderay gem:

    gem install coderay
##在Gemfile中添加：

    gem 'coderay'
##在#rails_app/config/application.rb中增加：

    require 'coderay'
##在#rails_app/app/helpers/application_help.rb 增加 parse_coderay 方法:

    def parse_coderay(text)
      text.scan(/(\[code\:([a-z].+?)\](.+?)\[\/code\])/m).each do |match|
        text.gsub!(match[0],CodeRay.scan(match[2].strip, match[1].to_sym).div(:css => :class))
      end
      return text
    end
##添加coderay.css文件，文件链接[coderay.css][1]

##不要忘记在header中添加：

    <%= stylesheet_link_tag "coderay.css", :media => "screen" %>
##修改view:

    <%=simple_format parse_coderay(@blog.content)%>
##这样你就可以在编辑的时候使用:

    ......
    ..... code....
    ......

##下面看看效果
![coderay][2]

> (原创文章)
[1]: https://github.com/tim-tang/everyday/blob/master/public/stylesheets/coderay.css "coderay"
[2]: http://cms.everyday-cn.com/system/pictures/941/large_code_ray.png?1319766033 "coderay"
