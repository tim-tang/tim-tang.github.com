---
layout: post
title: Mac安装配置oh my zsh
description: Mac安装配置oh my zsh
category: Mac
keywords: mac oh-my-zsh
tags: [Mac, zsh]
location: Suzhou, China
alias: [/Mac/2011/12/09/mac-oh-my-zsh]
---
最近看了一些 ruby-china上的帖子，有人介绍说mac terminal下可以使用zsh(zsh是bash的一个扩展,并且兼容bash命令).但需要安装一些东西，mac默认使用的是bash shell。在mac 下有oh my zsh的东东介绍说不错，提供了很多的主题和rails/git/gem等的插件最重要的是提供了自动补全的功能，下面记录下具体的安装和配置：

##安装oh my zsh:

	wget --no-check-certificate https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O##| sh

##要让安装生效，只要重启终端即可

##我们可以看到在~/目录下生成了.zshrc文件，修改它让它支持rvm,方便rails开发，将原来.bash_profile与.profile中的自定义内容导入过来：

	...
	[[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm"
	...

##到这里我们就可以增加rails3开发要使用到的插件了,继续修改~/.zshrc文件：

    # Example format: plugins=(rails git textmate ruby lighthouse)
	plugins=(rails3 rails git textmate ruby rvm gem github brew bundler textmate pow osx)

##继续修改主题,个人比较喜欢的是candy和darkblood,更多主题可以看它的github wiki：

	...
	ZSH_THEME="darkblood"
	...

##使~/.zshrc文件生效：

	source ~/.zshrc

##这样我们就可以看到效果了，如图：

![oh-my-zsh][1]
##我们还可以查看所有oh my zsh提供的自动补全：

	$ grep -h -r -e '^alias' ~/.oh-my-zsh

> 就写到这里，更多资料可以看这里[oh-my-zsh][2]  原创文章

[1]: http://cms.everyday-cn.com/system/pictures/1195/large_oh-my-zsh.png?1323394528 "oh my zsh"
[2]: https://github.com/robbyrussell/oh-my-zsh "oh my zsh"
