---
layout: post
title: Rails3全文检索使用Sunspot gem
description: Rails3全文检索使用Sunspot gem
key: []
---
在网站中经常用到全文检索，这样出于使用的方便打算给Everyday也做个全文检索的功能，网上比较了几个全文检索的gem,发现sunspot(内置了solr引擎)比较适合我的需求，并没有用到之前名气稍大的think_sphinx,下面介绍下rails3和[***Sunspot***][1]的集成：

 1. 安装sunspot gem:
<pre>
$ gem install sunspot
</pre>
 2. 修改#rails_app/Gemfile:
<pre>
$ gem 'sunspot_rails'
</pre>
 3. 使用如下命令生成#rails_app/config/sunspot.yml:
<pre>
$ rails g sunspot_rails:install
</pre>
 4. 对生成的sunspot.yml不需要做任何修改，里面定义了对solr 引擎的配置：
<pre>
production:
  solr:
    hostname: localhost
    port: 8983
    log_level: WARNING
development:
  solr:
    hostname: localhost
    port: 8982
    log_level: INFO
test:
  solr:
    hostname: localhost
    port: 8981
</pre>
 5. 由于sunspot gem 中内置了solr引擎，不需要单独安装直接启动即可：
<pre>
$ bundle exec rake sunspot:solr:start
</pre>
 6. 如下命令可以关闭solr引擎：
<pre>
$ bundle exec rake sunspot:solr:stop
</pre>
 7. 修改app/models/eyd_blog.rb,增加：
<pre>
...
searchable do
    text :title, :boost =>5
    text :content
end
</pre>
 8. sunspot会给新的blog增加索引但已经存在的不会加，所有要执行如下命令：
<pre>
$ bundle exec rake sunspot:reindex
</pre>
 9. 添加页面search form代码：
![alt text][2]
 10. controller中增加方法：
<pre>
  def search_list
    @search = EydBlog.search do
       fulltext params[:search]
    end
    @total_blogs = @search.results
  end
</pre>
 11. 修改#rails_app/config/routes.rb,增加:
<pre>
get 'search_list' => :search_list, :as => :search_list
</pre>
 12. 启动rails服务，测试结果如下：
![sunspot][3]

> ***需要注意的是当把solr服务器关闭后，我们需要重新reindex记录*** （原创文章）

----------
补充：
sunspot在production环境的命令：
<pre>
bundle exec rake sunspot:solr:start RAILS_ENV=production
bundle exec rake sunspot:reindex RAILS_ENV=production
</pre>
production环境需要安装jdk环境，否则无法启动服务，查看服务是否启动：
<pre>
$ ps -ef|grep solr
</pre>

  [1]: http://outoftime.github.com/sunspot/ "sunspot"
  [2]: http://everyday-cn.com/system/pictures/973/large__search.png?1320390727 "search code"
  [3]: http://everyday-cn.com/system/pictures/974/large_result_list.png?1320391117 "search_results"
