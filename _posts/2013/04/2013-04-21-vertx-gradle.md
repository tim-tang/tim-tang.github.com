---
layout: post
title: "Vertx develop with gradle"
description: "Vertx 使用Gradle构建开发环境"
category: J2EE 
keywords: vertx,gradle
tags: [Vertx.io] 
location: Suzhou, China
---

之前写了一篇关于使用Eclipse/Maven来构建Vertx开发环境的blog:[Vertx.io Eclipse dev environment](http://timtang.me/blog/2013/04/13/vertx-eclipse-dev/),这篇文章是基于vertx 1.3.1.final的，[Vertx](https://github.com/vert-x/vert.x)在github上已经有2.0beta的版本，由于doc没有更新，所以作者Tim.Fox一直没有发布，在2.0版本中已经提供更好的基于Gradle的开发方式，下面来介绍下。


## 1- 我们可以从github上clone基于gradle开发的模版[Vertx-Gradle-Template](https://github.com/vert-x/vertx-gradle-template),里面提供了丰富的命令：
---

下面介绍几个常用的命令：

    $git clone https://github.com/vert-x/vertx-gradle-template

    $./gradlew eclipse    #生成eclipse项目开发的骨架
    $./gradlew assemble   #编译打包项目
    $./gradlew pullInDeps #下载所有项目依赖的module到mods目录
    $./gradlew runMod     #运行项目
    $./gradlew test       #运行项目中的测试用例

> 还有很多命令就不在这里介绍了，详细信息可以参考->[build.gradle](https://github.com/vert-x/vertx-gradle-template/blob/master/build.gradle)

## 2- 使用Vertx-Gradle-Template我们还需要做一些修改来满足自己的开发
---

- 修改[gradle.properties](https://github.com/vert-x/vertx-gradle-template/blob/master/gradle.properties)中properties。
- 修改[build.gradle](https://github.com/vert-x/vertx-gradle-template/blob/master/build.gradle)中的dependencies/configurePom节点。

> 以上的修改在这两个文件中都有详细的说明，这里不在具体介绍。

## 3- 使用Vertx-Gradle-Template开发的注意点
---

由于Vertx2.o使用的新的module命名规则，在我们deploy第三方module的时候要使用如下方式：

    // deploy mongodb persistor module and pass in the handler.
    container.deployModule("io.vertx~mod-mongo-persistor~2.0.0-SNAPSHOT", null, 1, mockDataHandler);

在resouces目录下要添加mod.json的描述文件，当有web页面在项目中时，需要如下设置，告诉vertx加载文件的目录设置：

    {
      "main":"me.timtang.server.VertxFeedApplication",
      "preserve-cwd":true
    }


> 详细内容可以参考[vertx-gradle-pubsub](https://github.com/tim-tang/vertx-gradle-pubsub),目前Vertx2.0还不是太稳定，周边的module相对较少，开发的时候可能遇到很多问题，这可能更Tim.Fox一个人维护整个项目有关，希望这些对大家有帮助。Cheers!
