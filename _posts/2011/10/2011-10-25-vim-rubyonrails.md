---
layout: post
title: Vim开发RubyOnRails 环境打造
description: Vim开发RubyOnRails 环境打造
category: Vim
keywords: vim ror development eviroment
tags: [Vim, Rails]
location: Suzhou, China
alias: [/Vim/2011/10/25/vim-rubyonrails]
---

vim是一个很好的开发工具，对于习惯了IDE开发环境的程序员来说初用它可能会很痛苦，我也经历了这样的阶段（虽然我还是刚入门^_^），下面就介绍下我的vim开发环境配置：

##**首先从安装说起还是ubuntu上：** 

    $sudo apt-get remove vim-tiny --删除ubuntu默认安装的tiny版本
    $sudo apt-get install vim
##**创建～/.vimrc 文件，配置如下：**

	set nocompatible
	filetype on
	filetype plugin indent on
	" 禁止生成临时文件
	  set nobackup
	  set noswapfile
	" 历史记录数
	  set history=50
	" 设置编码  
	  set enc=utf-8  
	" 设置文件编码  
	  set fenc=utf-8  
	" 设置文件编码检测类型及支持格式  
	  set fencs=utf-8,ucs-bom,gb18030,gbk,gb2312,cp936  
	" 设置开启语法高亮  
	  syntax on  
	" 显示行号  
	  set number  
	" 高亮显示匹配的括号
	  set showmatch
	" 搜索忽略大小写
	  set ignorecase  
	" 查找结果高亮度显示  
	  set hlsearch
	  set incsearch
	" tab宽度  
	  set tabstop=4  
	  set cindent shiftwidth=4  
	  set autoindent shiftwidth=4  
	" 命令行下按tab键自动完成
	  set wildmode=list:full
	  set wildmenu
	" 带有如下符号的单词不要被换行分割
	  set iskeyword+=_,$,@,%,#,-
	" 通过使用: commands命令，告诉我们文件的哪一行被改变过
	  set report=0
	" 可以在buffer的任何地方使用鼠标（类似office中在工作区双击鼠标定位）
	  set mouse=a
	  set selection=exclusive
	  set selectmode=mouse,key
	" 把 F8 映射到 启动NERDTree插件
	  map <F8> :NERDTree<CR>  

##用到的插件有NERDTree/rails.vim/snipMate.vim/surround.vim/ctags等，github链接[my vim config][1]。

##这里再罗嗦下NERDTree插件的使用：

     m: 提供文本文件系统菜单来创建/删除/移动/复制目录或文件
     r:  刷新当前目录
     R: 刷新根目录
     e: 切换到当前目录
     ctrl+w+l/h:tree和编辑文件间切换

##**介绍下ctags，一个可以让vim像ide一样转跳代码的插件:**

    $sudo apt-get install exuberant-ctags
    $cd %your_project%
    $ctags -R --exclude=.git --exclude=log *  --生成ctags文件，在代码中按下"Ctrl-]"。用"Ctrl-o"退回原来的地方

##最后贴一些有用的vim命令：

    :e ~/Desktop/xxx   打开文件
    :b#       返回到原来编辑的文件
    设置vim的查找路径
    :set path=~/everyday/**
    :find eyd_ tab 自动呼出所有可能选项。
    :set ft=xml 设置vim的文件的类型 html/sql/ruby/...
    gg=G   格式化全文代码
    :saveas path  文件另存路径
    vim 多列注释：
    ctrl+v  选择列模式
    输入I（大写），输入#或//，ctrl+[ 多列注释。
![alt text][2]    

> 现在基本习惯了vim的开发环境，鼠标的使用率明显减少，给个可以供学习的vim视频(需要翻墙)：[***Vimeo***][3]  (原创文章)

[1]: https://github.com/tim-tang/vim "vim"
[2]: http://cms.everyday-cn.com/system/pictures/912/medium_Screenshot%20at%202011-10-25%2011:00:08.png?1319511830 "vim"
[3]: http://vimeo.com/6332848 "vimcast"
