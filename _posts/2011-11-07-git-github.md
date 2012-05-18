---
layout: post
title: Git,Github开发流程
description: Git,Github开发流程
key: []
---
使用Git有几个月了，但一直在一个master上开发和发布版本，看了下git-flow方面的实践资料，准备在下一个版本中调整git的开发流程，下面描述下想法和具体实现：
**我们会把branch分成两个主要的分支：**
 - master:保存稳定版(production ready),随时都可以release,并在上面实现每日构建。
 - everyday-dev:开发分支，平时的代码都提交到everyday-dev分支上。
**下面是具体实现：**
 - 先在github服务端建立master分支,具体可以看[***利用Github管理Rails代码***][1]
 - 创建everyday-dev分支：
<pre>
$ git branch everyday-dev
$ git checkout everyday-dev  #切换到everyday-dev分支
$ git push origin everday-dev  #将everyday-dev分支提交到github
</pre>
 - 这样我们就可以在dev分支上开发，当everday-dev开发到成熟阶段,觉得有必要合并进master：
<pre>
$ git checkout master
$ git merge everday-dev  #合并代码
$ git push origin master
</pre>
 - 当另外的开发人员也在everyday-dev分支上提交了代码，有冲突的时候:
<pre>
$ git rebase origin everyday-dev  #相当于更新代码
$ git pull origin everyday-dev    #将自动合并代码，并非最佳方式,也可用:fetch/merge
</pre>
 - 很多的时候我们遇到冲突时会覆盖自己的代码：
<pre>
$ git checkout origin xxx.rb
</pre>
 - 到这里我们的代码已经在master分支上,还需要打个标签就可以release了：
<pre>
$ git checkout master
$ git tag everyday_1.4
$ git push --tag      #提交tag到github
</pre>

> 下面的事情就是，在服务器部署了，这里不再详述。对于git的更多使用还要在实践中更新，慢慢来吧！ (原创文章)

  [1]: http://tim.everyday-cn.com/zh/show_blog/github-rails "git"
