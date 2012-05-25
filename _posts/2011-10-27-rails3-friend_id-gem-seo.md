---
layout: post
title: Rails3利用friend_id gem,SEO优化
description: Rails3利用friend_id gem,SEO优化
category: RubyOnRails
tags: [Rails, RubyGem]
---
出于想增加blog被baidu,google 等搜索引擎收录的条目，于是想到了SEO优化，首先从url的美化开始，rails3中可以使用friendly_id 这个gem, github地址：[Friendly_id][1]

 - 安装gem
<pre>
    $gem install friendly_id
</pre>
 - 修改Gemfile,加入
<pre>
    $gem "friendly_id", "~> 4.0.0.beta14"
</pre>
 - 给我的eyd_blogs表增加一个slug字段,rails 命令：
<pre>
    $rails g migration add_slug_to_eyd_blog slug:string
</pre>
 - 修改生成的migration文件添加索引：
<pre>
    class AddSlugToEydBlog < ActiveRecord::Migration
       def self.up
          add_column :eyd_blogs, :slug, :string
          ***add_index :eyd_blogs, :slug, :unique=> true***   --新增
       end

       def self.down
          remove_column :eyd_blogs, :slug
       end
    end
</pre>
 - 到models目录下找到EydBlog添加：
<pre>
    class EydBlog < ActiveRecord::Base
       ***extend FriendlyId***    --新增
       ***friendly_id :title, :use => :slugged***    --新增
       belongs_to :eyd_user
       acts_as_taggable_on :tags
       attr_accessor :blog_tags
       validates :title, :presence => true, :uniqueness => true
    end
</pre>
 - 应用到mysql,数据库eyd_blog表增加一列：
<pre>
    rake db:migrate
</pre>
 - 下面当你新建blog的时候，blog的title会自动增加到slug字段，但你find这个blog的时候就可以看到url的效果如下：
![friendly_id][2]
显示的是title不再是id
> 最后还个问题就是slug只能识别英文，中文无法识别，所以title中存在中英文时它只会拿出英文单词作为slug,这个问题的替代解决方案是用google translate api来翻译中文，这里就不再介绍了。（原创文章）

  [1]: https://github.com/norman/friendly_id "friendly_id"
  [2]: http://cms.everyday-cn.com/system/pictures/931/large_friendly_id.png?1319703284 "result"
