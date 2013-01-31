---
layout: post
title: Ruby目录(Diretories)文件(files)操作
description: Ruby目录(Diretories)文件(files)操作
category: Ruby
keywords: ruby directory files
tags: [Ruby]
location: Suzhou, China
alias: [/Ruby/2011/11/28/ruby-diretories-files]
---
最近一直在用ruby写crawler engine,不可避免的需要用到一些对文件和目录的操作，下面记录一下：

## 操作目录

	Dir.chdir( “/Users/weston” )  #进入目录
	home =Dir.pwd  #=> “/Users/weston/” * 显示目录
	Dir.mkdir( “/Users/weston/” )  ＃创建目录，和*nix命令一样吧
	Dir.rmdir( “/Users/weston/test” ) # 删除目录
	Dir.mkdir( “/Users/weston/test”,755 ) #常见目录，设置权限
	d = Dir.entries( “/Users/weston” ).each { |e| puts e } #=> Array
	d2 = d.delete_if{ |e| e=~ /^\..*/} #=>这样出来的就是不包含隐藏文件了
	dir = Dir.open( “/Users/weston” ) # => #<Dir:0x1cd784>
	dir.path # => “/Users/weston”
	dir.tell # => “.”
	dir.read # => 1
	dir.tell # => “..”
	dir.rewind # => rewind to beginning
	dir.each { |e| puts e } # puts each entry in dir
	dir.close # => close stream

## 文件操作

	file = File.new( “file.rb”, “w” ) # => #<File:file.rb> 其中的w是表示可以写，还有很多模式：r, r+, w, w+, a, a+,b
	file = File.open( “sonnet_129.txt” )
	file.each { |line| print “#{file.lineno}. ”, line } #lineno 是行号
	file.close
	File.new( “books.txt”, “w” )
	File.rename( “books.txt”, “chaps.txt” )
	File.delete( “chaps.txt” )

> 就写到这里，方便将来查找。
