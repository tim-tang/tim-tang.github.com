---
layout: post
title: Ruby目录(Diretories)文件(files)操作
description: Ruby目录(Diretories)文件(files)操作
key: []
---
最近一直在用ruby写crawler engine,不可避免的需要用到一些对文件和目录的操作，下面记录一下：

 - 操作目录
<pre>
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
</pre>
 - 文件
<pre>
file = File.new( “file.rb”, “w” ) # => #<File:file.rb> 其中的w是表示可以写，还有很多模式：r, r+, w, w+, a, a+,b
file = File.open( “sonnet_129.txt” )
file.each { |line| print “#{file.lineno}. ”, line } #lineno 是行号
file.close
File.new( “books.txt”, “w” )
File.rename( “books.txt”, “chaps.txt” )
File.delete( “chaps.txt” )
</pre>
 - 操作URI
<pre>
require 'open-uri'
url = “http://www.google.com/search?q=ruby”
open(url) { |page| page_content = page.read()
links = page_content.scan(/<a class=l.*?href=\"(.*?)\"/).flatten
links.each {|link| puts link}
}
</pre>
 - 文件查询
<pre>
File::open(“file.rb”) if File::exists?( “file.rb” )
File.file?( “sonnet29.txt” ) # => true 
File::directory?( “/usr/local/bin” ) # => true 
File::directory?( “file.rb” ) # => false 
File.readable?( “sonnet_119.txt” ) # => true 
File.writable?( “sonnet_119.txt” ) # => true 
File.executable?( “sonnet_119.txt” ) # => false 
system(“touch chap.txt”) # Create a zero-length file with a system command 
File.zero?( “chap.txt” ) # => true 
File.size?( “sonnet_129.txt” ) # => 594 
File.size( “sonnet_129.txt” ) # => 594 
File::ftype( “file.rb” ) # => “file” 
File::ctime( “file.rb” ) # => Wed Nov 08 10:06:37 -0700 2006 
File::mtime( “file.rb” ) # => Wed Nov 08 10:44:44 -0700 2006 
File::atime( “file.rb” ) # => Wed Nov 08 10:45:01 -0700 2006
</pre>
 - 操作文件权限
<pre>
file = File.new( “books.txt”, “w” )
file.chmod( 0755 ) 
file = File.new( “books.txt”, “w” ).chmod(0755 ) #另一种方法
system “ls -l books.txt” # => -rwxr-xr-x     1 mikejfz  mikejfz     0 Nov  8 22:13 
books.txt
</pre>

> 就写到这里，方便将来查找。
