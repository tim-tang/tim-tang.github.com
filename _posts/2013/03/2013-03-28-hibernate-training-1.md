---
layout: post
title: "Hibernate JPA Training-1"
description: "JPA state transition"
category: J2EE 
keywords: JPA
tags: [Hibernate]
location: Suzhou, China
---

最近需要做一个hibernate和JPA的培训，整理了一些这方面的东西，下面分享一下,着一部分主要介绍jpa state transition 及entity之间的关联关系。

### 准备工作
---

- 具体的代码在github中[**hibernate-jpa-training**](https://github.com/tim-tang/hibernate-jpa-training)
- 培训PPT 链接 => <http://tim-tang.github.com/jekyll_presentation> 

##  下面这张图展现了entity的生命周期
---
![JPA-state-transition](/images/post/jpa-state-transitions.png)

- New/Transient，新创建的实体对象，没有主键(identity)值
- Managed，对象处于Persistence Context(持久化上下文）中，被EntityManager管理
- Detached，对象已经游离到Persistence Context之外，进入Application Domain
- Removed, 实体对象被删除

### 下面通过几个API介绍下entity 在EntityManager中的声明周期管理
---

## public void persist(Object entity); 
---

- 如果entity是一个新建的实体(transient)，将会变成entitiyManager管理的受管态(持久态)
- 如果entity已经是持久态，将会ignore
- 如果entity是游离态(detached) ,将会变成受管态
- 如果CascadeType.PERSIST.设置某个属性，这个操作将会递归保存所有这个属性关联的对象。

## public void remove(Object entity);
---

- 如果entity是新建的对象(transient),操作ignore
- 如果entity是受管态，将删除entity
- 如果entity是一个已经移除的对象，操作ignore
- 如果entity是一个游离态对象，将抛出IllegalArgumentException
- 如果CascadeType.REMOVE设置在某个属性，将移除所关联的对象

## public void refresh(Object entity);
---

- 如果entity是transient状态，抛出IllegalArgumentException
- 如果entity是managed状态，将会读取数据库中最新的数据
- 如果entity已经不存在，操作ignore
- 如果entity是detached状态，抛出IllegalArgumentException
- 如果CascadeType.REFRESH设置在属性上，所有关联的对象将被刷新

## public Object merge(Object entity);
---

- 如果entity是detached，那么将会把entity的属性值复制到受管的entity中，如果没有受管状态的entity,那就直接新建一个
- 如果entity是transient状态，就创建一个受管状态的entity'
- 如果entity是managed状态,操作ignore
- 如果entity已经被移除，抛出IllegalArgumentException
- 如果CascadeType.MERGE设置在属性上，所有关联都将更新

## public void lock (Object entity, LockModeType mode);
---

- LockModeType.READ 其他事务只能并发的读entity不能并发的写
- LockModeType.WRITE 其他事务不能并发的读也不能并发的写这个entity


### Hibernate 实体间关联关系
---

**对关联关系映射的要点如下:**

    |RELATION-TYPE             | OWNING-SIDE  | INVERSE-SIDE
    ---------------------------|------------|---------------------------------------
    |One-To-One                |@OneToOne   |@OneToOne(mappedBy="othersideName")
    ---------------------------|------------|---------------------------------------
    |One-To-Many/Many-To-One   |@ManyToOne  |@OneToMany(mappedBy="xxx")
    ---------------------------|------------|---------------------------------------
    |Many-To-Many              |@ManyToMany |@ManyToMany(mappedBy ="xxx")
    ---------------------------|------------|---------------------------------------

**其中 many-to-many关系的owning-side可以使用@JoinTable声明自定义关联表**

## 事件及监听
---

![hibernate-event](/images/post/hibernate-event.gif)

## hibernate traing blog列表
---

- [Hibernate JPA Training-2](http://timtang.me/blog/2013/03/29/hibernate-training-2/)
- [Hibernate JPA Training-3](http://timtang.me/blog/2013/03/30/hibernate-training-3/)
- [Hibernate JPA Training-4](http://timtang.me/blog/2013/03/30/hibernate-training-4/)
- [Hibernate JPA Training-5](http://timtang.me/blog/2013/03/30/hibernate-training-5/)

> Cheers!

