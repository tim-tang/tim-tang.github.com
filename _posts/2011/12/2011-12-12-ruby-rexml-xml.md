---
layout: post
title: Ruby使用rexml解析xml
description: Ruby使用rexml解析xml
category: Ruby
keywords: ruby rexml
tags: [Ruby, RubyGem]
location: Suzhou, China
alias: [/Ruby/2011/12/12/ruby-rexml-xml]
---
在开发中常用到xml解析，在ruby中我们可以使用rexml来解析xml,rexml具有如下特点:

 - 100%用ruby编写
 - 可以用来解析SAX和DOM
 - 轻量，不足2000行代码
 - 提供完整的API支持
 - ruby中内置

##下面我们来看看如何使用它,假设我们有如下xml文件：

	<collection shelf="New Arrivals">
		<movie title="Enemy Behind">
			<type>War, Thriller</type>
			<format>DVD</format>
			<year>2003</year>
			<rating>PG</rating>
			<stars>10</stars>
			<description>Talk about a US-Japan war</description>
		</movie>
		<movie title="Transformers">
			<type>Anime, Science Fiction</type>
			<format>DVD</format>
			<year>1989</year>
			<rating>R</rating>
			<stars>8</stars>
			<description>A schientific fiction</description>
		</movie>
		<movie title="Trigun">
			<type>Anime, Action</type>
			<format>DVD</format>
			<episodes>4</episodes>
			<rating>PG</rating>
			<stars>10</stars>
			<description>Vash the Stampede!</description>
		</movie>
		<movie title="Ishtar">
			<type>Comedy</type>
			<format>VHS</format>
			<rating>PG</rating>
			<stars>2</stars>
			<description>Viewable boredom</description>
		</movie>
	</collection>

##解析DOM：

	require 'rexml/document'
	include REXML
	xmlfile = File.new("movies.xml")
	xmldoc = Document.new(xmlfile)
	root = xmldoc.root
	puts "Root element : " + root.attributes["shelf"]
	xmldoc.elements.each("collection/movie"){
		|e| puts "Movie Title : " + e.attributes["title"]
	}
	xmldoc.elements.each("collection/movie/type") {
		|e| puts "Movie Type : " + e.text
	}
	xmldoc.elements.each("collection/movie/description") {
		|e| puts "Movie Description : " + e.text
	}

##使用XPATH：

	require 'rexml/document'
	include REXML
	xmlfile = File.new("movies.xml")
	xmldoc = Document.new(xmlfile)
	movie = XPath.first(xmldoc, "//movie")
	p movie
	XPath.each(xmldoc, "//type") { |e| puts e.text }
	names = XPath.match(xmldoc, "//format").map {|x| x.text }
	p names

> 以备不时之需!
