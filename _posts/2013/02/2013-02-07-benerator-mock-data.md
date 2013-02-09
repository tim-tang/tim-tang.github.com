---
layout: post
title: "Use Benerator to generate mock data"
description: "使用Benerator产生压力测试数据"
category: J2EE
keywords: benerator mock data
tags: [Benerator]
location: Suzhou, China
---

项目中原来的使用Java来生成模拟数据，随着业务逻辑的复杂和数据量的增加变的难以维护，而且执行速度缓慢。找一款既能描述复杂业务逻辑又兼顾速度的工具，成了当务之急。下面来说说为什么[_Benerator_](http://databene.org/databene-benerator.html)被我们选中：

- 支持XML Schema, CSV, TXT Files and Excel作为导出/导入文件
- 使用XML 作为数据库schema的描述，语意丰富。
- 支持freemark模板语言
- 支持主流数据库：Oracle/MySQL/PostgreSQL etc,屏蔽异构数据源

> 目前该项目提供两种license，GPL/Commercial，具体看[_benerator license_](http://databene.org/databene-benerator/135-benerator-license.html)

### Benerator 提供的两种安装方式：
---


## 通过安装包安装，具体安装信息:[_installing-the-benerator-distribution_](http://databene.org/databene-benerator/112-installing-the-benerator-distribution.html)
> 注意：要设置环境变量，并把相应数据库的驱动放入lib/目录


## 用maven plugin的方式安装,在项目的pom.xml中加入benerator plugin的配置：

	<plugin>
 	 	<groupId>org.databene</groupId>
		<artifactId>maven-benerator-plugin</artifactId>
		<version>0.7.7</version>
		<configuration>
			<descriptor>mtx-mock/mtx.ben.xml</descriptor>
			<encoding>iso-8859-1</encoding>
		</configuration>
		<dependencies>
			<dependency>
				<groupId>postgresql</groupId>
				<artifactId>postgresql</artifactId>
				<version>9.1-901.jdbc4</version>
			</dependency>
			<dependency>
				<groupId>org.slf4j</groupId>
				<artifactId>slf4j-api</artifactId>
				<version>1.6.4</version>
			</dependency>
			<dependency>
				<groupId>org.slf4j</groupId>
				<artifactId>slf4j-log4j12</artifactId>
				<version>1.6.4</version>
			</dependency>
			<dependency>
				<groupId>log4j</groupId>
				<artifactId>log4j</artifactId>
				<version>1.2.16</version>
				<exclusions>
					<exclusion>
						<groupId>javax.jms</groupId>
						<artifactId>jms</artifactId>
					</exclusion>
					<exclusion>
						<groupId>com.sun.jdmk</groupId>
						<artifactId>jmxtools</artifactId>
					</exclusion>
					<exclusion>
						<groupId>com.sun.jmx</groupId>
						<artifactId>jmxri</artifactId>
					</exclusion>
					<exclusion>
						<groupId>javax.mail</groupId>
						<artifactId>mail</artifactId>
					</exclusion>
				</exclusions>
			</dependency>
		</dependencies>
	</plugin>

> 使用 $mvn benerator:generate 即可执行


## 下面我们看下执行结果，这里有45张表，涉及到3个database schema，14000条数据,内部还包含了相当的业务处理，使用了23秒。
![Benerator Results](/images/post/benerator-result.png){:width=680 :height=80}


## Benerator的使用，我们可以参考如下文档：

- [_**Benerator Tutorial**_](http://databene.org/download/databene-benerator-manual-0.7.6.pdf)  非常重要的文档，开发是常用的语法，组件都可以在这里找到用法。

- [_**Database Population Tutorial**_](http://databene.org/databene-benerator/tutorials/85-database-population-tutorial.html) 常用的生成数据库数据例子。

- 安装包中的demo/目录中又很多有用的例子，可以参考帮助你实现功能。

> Cheers！
