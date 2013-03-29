---
layout: post
title: "Hibernate JPA Training-5"
description: "Hibernate many-to-many relationship"
category: J2EE 
keywords: Hibernate JPA
tags: [Hibernate]
location: Suzhou, China
---

这一篇是hibernate training 系列blog的最后一篇，将介绍many-to-many关联中的各种操作。

### 准备工作
---

- Item和Tag是many-to-many关系
- 具体的代码在github中[**hibernate-jpa-training**](https://github.com/tim-tang/hibernate-jpa-training)

## many-to-many 关系owner与非owner删除时的差异

_正常情况从item删除tag，代码_

	@Test
    @Transactional
    @Rollback(false)
    public void testSaveItems() throws Exception {
        entityManager.persist(item1);
        // will flush entity state from session to database. It will not commit.
        entityManager.flush();
        // item is relationship owner
        item1.getTags().remove(tag1);
        entityManager.merge(item1);
    }

_从log信息中我们可以看到，会删除中间表的关联_

    2013-03-29 13:23:33,844 DEBUG [org.hibernate.SQL] - <insert into Item (name, id) values (?, ?)>
    2013-03-29 13:23:33,848 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-29 13:23:33,848 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-29 13:23:33,849 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>
    2013-03-29 13:23:33,849 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>
    2013-03-29 13:23:33,854 DEBUG [org.hibernate.SQL] - <delete from Item_Tag where ITEM_ID=? and TAG_ID=?>

_从tag来删除item,代码_
    
    @Test
    @Transactional
    @Rollback(false)
    public void testSaveItems() throws Exception {
        entityManager.persist(item1);
        // will flush entity state from session to database. It will not commit.
        entityManager.flush();
        // will not drop associated table relationship. cause tag is not relationship owner.
        tag1.getItems().remove(item1);
        entityManager.merge(item1);
    }

_看log,并不会去删除中间表的关联_

    2013-03-29 13:36:12,123 DEBUG [org.hibernate.SQL] - <insert into Item (name, id) values (?, ?)>
    2013-03-29 13:36:12,127 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-29 13:36:12,128 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-29 13:36:12,129 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>
    2013-03-29 13:36:12,129 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>

> 所以这是一个注意点。

## TO BE CONTINUE ...
