---
layout: post
title: "使用Git管理命令行配置"
description: "借助Git和GitHub来管理你的命令行配置文件"
category: Mac
keywords: github terminal dotfiles
tags: [Mac]
location: Suzhou, China
---

对于命令行重度依赖的开发者来说管理命令行的这些配置文件是比较头痛的问题，每次重新安装或服务器部署的时候都要拷贝文件重新配置，现在可以借助git来管理这些配置文件，通过写一个shell或则ruby的脚本即可实现，下面介绍具体实现：

## 在GitHub上创建dotfiles的项目并把代码pull到本地

## 把你本地的.gitconfig/.vimrc/.psqlrc等配置文件拷贝到工程目录下，并且重命名成＊.symlink

## 创建一个link-fies.rb文件（目前我用ruby来实现）

    #!/usr/bin/env ruby
    safe_mode = ARGV.include? '--safe'

    linkables = Dir.glob('*{.symlink}')
    linkables.each do |linkable|
        file = linkable.split('/').last.split('.symlink').last
        unless safe_mode and File.exists?("#{ENV['HOME']}/.#{file}")
        %x(ln -s -i -v $PWD/#{linkable} ~/.#{file})
        puts ".#{file} linked" if safe_mode
       end
    end
    # copy .vim folder into $HOME/
    %x(cp -r $PWD/.vim $HOME/)

## 为了方便同步脚本到 GitHub,我创建了两个alias 放在$HOME/.bash_profile

    alias pull-dotfiles='pushd $HOME/Documents/dotfiles && git pull origin master && ./link-files.rb --safe; popd'
    alias push-dotfiles='pushd $HOME/Documents/dotfiles && git add -A && git commit -m "Update dot files." && git push origin master; popd'

> 别忘了 $source ~/.bash_profile

## 具体的用法:

    $ ./link-files --safe

> 要看详细的代码和配置可以看我在GitHub上的代码[**dotfiles**](https://github.com/tim-tang/dotfiles)
