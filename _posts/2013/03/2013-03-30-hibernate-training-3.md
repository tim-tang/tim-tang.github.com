---
layout: post
title: "Hibernate JPA Training-3"
description: "Hibernate one-to-many relationship"
category: J2EE 
keywords: Hibernate JPA
tags: [Hibernate]
location: Suzhou, China
---

这篇blog介绍hibernate比较常用的one-to-many关系,涉及mappedBy,属性使用,JoinColumn annotation的使用，orderBy annotation使用，entity hashcode设置等。

### 1- 准备工作
---

- PointOfSale和Category是One-To-Many关系
- mappedBy定义：定义在被拥有方的,他指向拥有方,mappedBy的含义，应该理解为，拥有方能够自动维护跟被拥有方的关系
- inverse定义：指定由哪一方来维护之间的关联关系,当一方中指定了“inverse=true”，那么另一方就有责任责实体之间的关联关系
- entityManager.flush(): 将Hibernate一级缓存中的实体操作flush到数据库
- entityManager.clear(): 将Hibernate一级缓存清空
- 具体的代码在github中[**hibernate-jpa-training**](https://github.com/tim-tang/hibernate-jpa-training)
- 培训PPT 链接 => <http://tim-tang.github.com/jekyll_presentation> 

### 2- One-To-Many 介绍
---

## 2.1- one-to-many使用和不使用mappedBy时的差异
---

**当PointOfSale不使用mappedBy的时候，执行如下代码:**

	@Test
    @Rollback(true)
    public void testMappedBy(){
        entityManager.persist(pos);
        entityManager.flush();
    }

**从log中我们可以看到它会自动生成中间表,并维护中间表关系**

    2013-03-29 10:10:34,526 DEBUG [org.hibernate.SQL] - <insert into PointOfSale (name, id) values (?, ?)>
    2013-03-29 10:10:34,530 DEBUG [org.hibernate.SQL] - <insert into Category (name, pointOfSale, priority, id) values (?, ?, ?, ?)>
    2013-03-29 10:10:34,530 DEBUG [org.hibernate.SQL] - <insert into Category (name, pointOfSale, priority, id) values (?, ?, ?, ?)>
    2013-03-29 10:10:34,532 DEBUG [org.hibernate.SQL] - <insert into PointOfSale_Category (PointOfSale_id, categories_id) values (?, ?)>
    2013-03-29 10:10:34,532 DEBUG [org.hibernate.SQL] - <insert into PointOfSale_Category (PointOfSale_id, categories_id) values (?, ?)>

**当PointOfSale中使用mappedBy来管理关系,并通过关系拥有方来维护,执行上面的代码，从log中可以看出,只有3条sql，没有中间表**

    2013-03-29 10:16:54,325 DEBUG [org.hibernate.SQL] - <insert into PointOfSale (name, id) values (?, ?)>
    2013-03-29 10:16:54,329 DEBUG [org.hibernate.SQL] - <insert into Category (name, pointOfSale, priority, id) values (?, ?, ?, ?)>
    2013-03-29 10:16:54,330 DEBUG [org.hibernate.SQL] - <insert into Category (name, pointOfSale, priority, id) values (?, ?, ?, ?)>

> mappedBy 使用时不需要中间表，否则需要中间表维护。

## 2.2- 使用JoinColumn annotation来避免产生中间表
---

**这里还可以通过在PointOfSale entity上设置如下代码，避免中间表产生**

    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "pointOfSale")
    private List<Category> categories = new ArrayList<Category>();

**执行上面的test case, 我们可以在log中看到，无需维护中间表**

    2013-04-01 07:55:46,243 DEBUG [org.hibernate.SQL] - <insert into PointOfSale (name, id) values (?, ?)>
    2013-04-01 07:55:46,247 DEBUG [org.hibernate.SQL] - <insert into Category (name, pointOfSale, priority, id) values (?, ?, ?, ?)>
    2013-04-01 07:55:46,248 DEBUG [org.hibernate.SQL] - <insert into Category (name, pointOfSale, priority, id) values (?, ?, ?, ?)>
    2013-04-01 07:55:46,249 DEBUG [org.hibernate.SQL] - <update Category set pointOfSale=? where id=?>
    2013-04-01 07:55:46,249 DEBUG [org.hibernate.SQL] - <update Category set pointOfSale=? where id=?>

## 2.3- OrderBy 注解的使用  
---

**将OrderBy annotation加入实体属性上，执行如下代码测试**

	@Test
    @Rollback(true)
    public void testPriorityWithMappedBy(){
        List<PointOfSale> list =  entityManager.createQuery("from PointOfSale").getResultList();
        if(!CollectionUtils.isEmpty(list)){
            PointOfSale result = list.get(0);
            Assert.assertTrue(result.getCategories().get(0).getPriority()==1);
        }else{
            fail();
        }
    }

## 2.4- 针对id判断实体相等就是合理的策略了吗？
---
关键还是看你怎样才认为实体对象是相等的，这个倒不能采取hibernate对id的特殊用法。 如果认为业务属性无所谓，只要id相等就相等，那就完全可以用id作为判断相等的依据,如果需要根据业务属性来判定，那么id就不是合理的策略，因为很可能id不等但是业务属性都相等。 

**针对以上的分析，有没有最佳实践呢?**
- 用无意义主键id做hashCode/equals 
- 用的所有值做hashCode/equals 
- 用一个(或者几个)相对稳定的业务字段做hashCode/equals (比如user, 就用userName). 

## 2.5- 下面我们来分析一下项目中用id来重写equlas/hashCode的处理方式

     @Override
    public int hashCode() {
        return new HashCodeBuilder().append(getId()).toHashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Character) {
            return ((Character) obj).getId() == getId();
        }
        return false;
    }

**貌似没什么问题，实际上我们执行如下代码：**

    @Test
    @Rollback(false)
    public void testSaveWithInvalidHashCode(){
        System.out.println("=======" + account.getCharacters().size() + "=========");
        entityManager.persist(account);
    }

**从log中可以看到，character只有一条插入，实际我们需要2条，问题出在equals/hashCode的重写，因为transient对象没有主键，在set中比较时hibernate会认为它们相等**

    =======1=========
    2013-04-02 08:19:18,320 DEBUG [org.hibernate.SQL] - <insert into Account (accountId, id) values (?, ?)>
    2013-04-02 08:19:18,327 DEBUG [org.hibernate.SQL] - <insert into Character (account_id, characterId, wallet_id, id) values (?, ?, ?, ?)>

> 因此如果与业务无关，不需要覆盖equals和hashcode方法，直接沿用Object的就可以

**有业务相关性属性name来重写equals/hashcode方法**
    
    @Override
    public int hashCode() {
        return new HashCodeBuilder().append(name).toHashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof PointOfSale) {
            PointOfSale pos = (PointOfSale) obj;
            return new EqualsBuilder().append(this.name, pos.getName()).isEquals();
        }
        return false;
    }

> Cheers!

