---
layout: post
title: "Hibernate JPA Training-5"
description: "Hibernate many-to-many relationship"
category: J2EE 
keywords: Hibernate JPA
tags: [Hibernate]
location: Suzhou, China
---

这一篇是Hibernate Training 系列blog的最后一篇，将介绍Many-To-Many关联中的各种操作。

### 1- 准备工作
---
- Item和Tag是Many-To-Many关系
- 通过 @JoinTable 注解描述关联表和关联条件。其中一端定义为 owner, 另一端定义为 inverse(对关联表进行更新操作，这端被忽略)。
- 具体的代码在github中[**hibernate-jpa-training**](https://github.com/tim-tang/hibernate-jpa-training)    
- 培训PPT 链接 => <http://tim-tang.github.com/jekyll_presentation> 

### 2- Hibernate Many-To-Many 介绍
---

## 2.1- Many-To-Many 关系owner与非owner删除时的差异
---

**正常情况从item删除tag，代码**

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

**从log信息中我们可以看到，会删除中间表的关联,但不会删除Tag表的数据**

    2013-03-29 13:23:33,844 DEBUG [org.hibernate.SQL] - <insert into Item (name, id) values (?, ?)>
    2013-03-29 13:23:33,848 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-29 13:23:33,848 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-29 13:23:33,849 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>
    2013-03-29 13:23:33,849 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>
    2013-03-29 13:23:33,854 DEBUG [org.hibernate.SQL] - <delete from Item_Tag where ITEM_ID=? and TAG_ID=?>

**从tag来删除item,代码**
    
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

**看log,并不会去删除中间表的关联**

    2013-03-29 13:36:12,123 DEBUG [org.hibernate.SQL] - <insert into Item (name, id) values (?, ?)>
    2013-03-29 13:36:12,127 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-29 13:36:12,128 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-29 13:36:12,129 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>
    2013-03-29 13:36:12,129 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>

> 所以这是一个注意点。

## 2.2- Many-To-Many重置关系
---

**在开发中经常需要重置多对多实体之间的关系，代码**

    @Test
    @Transactional
    @Rollback(false)
    public void testResetTags(){
        entityManager.persist(item1);
        entityManager.flush();
        // reset item tag relationship.
        Set<Tag> tags = new HashSet<Tag>();
        Tag tag3 = new Tag();
        tag3.setName("tag3");
        tags.add(tag3);
        item1.setTags(tags);  
        entityManager.merge(item1);
    }

**从log中可以看出,hibernate会重置中间表关系，删除原有的并新建,并不会删除字表数据**

    2013-03-30 15:54:29,078 DEBUG [org.hibernate.SQL] - <insert into Item (name, id) values (?, ?)>
    2013-03-30 15:54:29,098 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-30 15:54:29,099 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-30 15:54:29,103 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>
    2013-03-30 15:54:29,104 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>
    2013-03-30 15:54:29,146 DEBUG [org.hibernate.SQL] - <select item0_.id as id3_1_, item0_.name as name3_1_, tags1_.ITEM_ID as ITEM1_3_3_, tag2_.id as TAG2_3_, tag2_.id as id5_0_, tag2_.name as name5_0_ from Item item0_ left outer join Item_Tag tags1_ on item0_.id=tags1_.ITEM_ID left outer join Tag tag2_ on tags1_.TAG_ID=tag2_.id where item0_.id=?>
    2013-03-30 15:54:29,185 DEBUG [org.hibernate.SQL] - <select nextval ('hibernate_sequence')>
    2013-03-30 15:54:29,187 INFO [HibernateInterceptor] - <====== OnSave Fired =====>
    2013-03-30 15:54:29,194 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-30 15:54:29,197 DEBUG [org.hibernate.SQL] - <delete from Item_Tag where ITEM_ID=? and TAG_ID=?>
    2013-03-30 15:54:29,198 DEBUG [org.hibernate.SQL] - <delete from Item_Tag where ITEM_ID=? and TAG_ID=?>
    2013-03-30 15:54:29,202 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>

> 只有当表关系中owner着一方的数据删除时候，才会级联删除子表数据。

## 2.3- 经常发生的场景是我们不需要，重置所有的关联，只是部分重置关系如何操作？
---

**为了避免这种情况，我们可以不reset整个collection，改用collection之上的,clear/removeAll/retainAll方法,通过如下代码测试**

    @Test
    @Transactional
    @Rollback(false)
    public void testResetTagsWithoutPersist(){
        Item item = (Item) entityManager.createQuery("from Item").getResultList().get(0);
        // assign managed entity to a transient entity.
        Tag tag1 = null;
        for(Tag tag: item.getTags()){
            if(tag.getName().equals("tag1")){
                tag1 = tag;
                break;
            }
        }
        
        // transient entity.
        Tag tag3 = new Tag();
        tag3.setName("tag3");
        //will use the original set will not delete tag2 relation
        item.getTags().clear();
        item.addTag(tag1);
        item.addTag(tag3);
        entityManager.merge(item);
    }

**从log中可以看到，不会全部重置关系，只是更新了特定中间表纪录，并写入子表**

    2013-04-01 08:22:09,240 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-04-01 08:22:09,243 DEBUG [org.hibernate.SQL] - <delete from Item_Tag where ITEM_ID=? and TAG_ID=?>
    2013-04-01 08:22:09,243 DEBUG [org.hibernate.SQL] - <insert into Item_Tag (ITEM_ID, TAG_ID) values (?, ?)>

## 2.4- 最后我们再来看只存子表数据会是什么情况？
---

**代码**

    @Test
    @Transactional
    @Rollback(false)
    public void testSaveTags() throws Exception {
        entityManager.persist(tag1);
        entityManager.persist(tag2);
    }

**我们可以在log中清楚的看到只会存子表数据没有主表和中间表数据**

    2013-03-30 16:00:48,287 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>
    2013-03-30 16:00:48,289 DEBUG [org.hibernate.SQL] - <insert into Tag (name, id) values (?, ?)>

> 到这里所有hibernate-jpa training的东西就告一段落了，Hibernate内容太多例如:Criteria/JPQL/HQL/事务的隔离和锁机制/Hibernate 2级缓存等.没办法一一讲到了，很多问题还需要深入。Hibernate 比较灵活，是一把双刃剑对开发者也提出的更高的要求，尤其在模型的设计上，一定要吃透业务需求！Cheers!
