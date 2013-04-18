---
layout: post
title: "Vertx.io Eclipse dev environment"
description: "vertx集成eclipse开发环境搭建"
category: J2EE 
keywords: vertx,eclipse,maven
tags: [Vertx.io] 
location: Suzhou, China
---

最近要做一个基于[Vertx.io](http://vertx.io)的pub/sub的功能，具体代码可见[vertx-pubsub](https://github.com/tim-tang/vertx-pubsub)，这个web框架比较新，目前还没有很好的IDE支持，下面介绍下自己摸索的基于eclipse/maven的一个开发环境。
最近还写了一个基于Grails集成Redis/Atmosphere的pub/sub 的sample，有兴趣的可以看看[grails-atmosphere-redis-feed](https://github.com/tim-tang/grails-atmosphere-redis-feed)

### 前提条件：
---

- JDK1.7已经安装
- Vert.x (1.3.1.final 版本) 已经正确安装，具体安装参考<http://vertx.io/install.html>：.

### 具体步骤：
---

## 1- 创建一个maven工程，pom.xml如下：

	<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.xplusz.vertx</groupId>
	<artifactId>vertx-feed</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>vertx-feed</name>
	<packaging>jar</packaging>
	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<java.version>1.7</java.version>
		<junit.version>3.8.1</junit.version>
		<vertx.version>1.3.1.final</vertx.version>
		<jruby.version>1.7.3</jruby.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>junit</groupId>
			<artifactId>junit</artifactId>
			<version>${junit.version}</version>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.vert-x</groupId>
			<artifactId>vertx-core</artifactId>
			<version>${vertx.version}</version>
		</dependency>
		<dependency>
			<groupId>org.vert-x</groupId>
			<artifactId>vertx-testframework</artifactId>
			<version>${vertx.version}</version>
		</dependency>
		<dependency>
			<groupId>org.vert-x</groupId>
			<artifactId>vertx-platform</artifactId>
			<version>${vertx.version}</version>
		</dependency>
		<dependency>
			<groupId>org.vert-x</groupId>
			<artifactId>vertx-lang-jruby</artifactId>
			<version>${vertx.version}</version>
		</dependency>
		<dependency>
			<groupId>org.jruby</groupId>
			<artifactId>jruby</artifactId>
			<version>${jruby.version}</version>
		</dependency>
    </dependencies>

	<repositories>
		<repository>
			<id>codehaus</id>
			<url>http://repository.codehaus.org/org/codehaus</url>
			<releases>
				<enabled>true</enabled>
			</releases>
			<snapshots>
				<enabled>false</enabled>
			</snapshots>
		</repository>
	</repositories>

	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<configuration>
					<source>${java.version}</source>
					<target>${java.version}</target>
				</configuration>
			</plugin>
		</plugins>
	</build>
	</project> 

## 2- 新建一个run configuration,使用org.vertx.java.deploy.impl.cli.Starter 
![vertx-run](/images/post/vertx-1.png)

## 3- 按照如下方式设置Arguments
![vertx-arg](/images/post/vertx-2.png)

## 4- 加入外部的vertx配置文件到classpath，点击Advanced -> External Folder and add ${VERTX_HOME}/conf
![vertx-conf](/images/post/vertx-3.png)

## 5- 下面是整个项目的目录结构
![vertx-overview](/images/post/vertx-4.png)

## 6- 如果要写一个vertx的module可以参考，github 上基于gradle的项目模版<https://github.com/vert-x/vertx-gradle-template>

> Vertx.io是最近在研究的一个基于事件驱动的框架，发现它的扩展性极强，nio，事件可以穿透web页面，基于pub/sub的eventBus等，有时间再写具体的介绍。Cheers!


