---
layout: post
title: "Hibernate JPA Training-4"
description: "Hibernate one-to-many relationship 2"
category: J2EE 
keywords: Hibernate JPA
tags: [Hibernate]
location: Suzhou, China
---

接着之前的blog继续介绍hibernate one-to-many关系，将涉及到orphanRemoval使用，one-to-many单向和双向关联不同产生的问题。

### 1- 准备工作
---

- Account和Character是one-to-many关系
- orphanRemoval定义：当主表更新的时候会观察many一方的集合变化，级联更新
- 具体的代码在github中[**hibernate-jpa-training**](https://github.com/tim-tang/hibernate-jpa-training)
- 培训PPT 链接 => <http://tim-tang.github.com/jekyll_presentation> 

### 2- One-To-Many 介绍
---
## 2.1- One-To-Many 级联更新子表(使用mappedBy,实体关系的owner为character)
---

**执行如下代码**

	@Test
    @Rollback(false)
    public void testSaveAccount(){
        entityManager.persist(account);
        for(Character character: account.getCharacters()){
            if(character.getCharacterId()==1){
                account.getCharacters().remove(character);
            }
        }
        entityManager.merge(account);
    }

**我们可以看到log删除了子表的一条character数据**

    2013-03-29 11:52:59,331 DEBUG [org.hibernate.SQL] - <insert into Account (accountId, id) values (?, ?)>
    2013-03-29 11:52:59,335 DEBUG [org.hibernate.SQL] - <insert into Character (account_id, characterId, wallet_id, id) values (?, ?, ?, ?)>
    2013-03-29 11:52:59,335 DEBUG [org.hibernate.SQL] - <insert into Character (account_id, characterId, wallet_id, id) values (?, ?, ?, ?)>
    2013-03-29 11:52:59,337 DEBUG [org.hibernate.SQL] - <delete from Character where id=?>

**当我们更改account关联的character唯一键characterId时无法删除这个entity,看代码**

	@Test
    @Rollback(false)
    public void testSaveAccount(){
        entityManager.persist(account);
        for(Character character: account.getCharacters()){
            if(character.getCharacterId()==1){
                //if change unique key in entity can not remove the entity.
                character.setCharacterId(100L);
                account.getCharacters().remove(character);
            }
        } 
        Assert.assertTrue(account.getCharacters().size()==2);
        entityManager.merge(account);
    }

**log信息,只是更新了character对象**
    
    2013-03-29 12:28:06,364 DEBUG [org.hibernate.SQL] - <insert into Account (accountId, id) values (?, ?)>
    2013-03-29 12:28:06,369 DEBUG [org.hibernate.SQL] - <insert into Character (account_id, characterId, wallet_id, id) values (?, ?, ?, ?)>
    2013-03-29 12:28:06,369 DEBUG [org.hibernate.SQL] - <insert into Character (account_id, characterId, wallet_id, id) values (?, ?, ?, ?)>
    2013-03-29 12:28:06,371 DEBUG [org.hibernate.SQL] - <update Character set account_id=?, characterId=?, wallet_id=? where id=?>

> 如果我们不去更新这个受管态对象character的状态，则可以删除，使用的时候要注意这个问题。

## 2.2- One-To-Many 单向和双向关联所产生的不同点
---

**Account和Character单向关联的情况**

	@Test
    @Rollback(false)
    public void testSaveBidirection(){
        entityManager.persist(account);
        Character character = account.getCharacters().iterator().next();
        // can not get account by character.
        Assert.assertTrue(character.getAccount()==null);
    }

**我们可以看到无法从many方取得one方的状态, 下面看双向**

	@Test
    @Rollback(false)
    public void testSaveBidirection(){
        // build bidirection relationship.
        for(Character character: account.getCharacters()){
            character.setAccount(account);
        }
        entityManager.persist(account);
        Character character = account.getCharacters().iterator().next();
        // will get account by character.
        Assert.assertTrue(character.getAccount()!=null);
    }

> 开发的时候需要注意，需要建立双向关联才能从子表得到主表的状态。

## 2.3- One-To-Many 重置子表关系
---

**保存一个Transient状态的Account并重新设置它所关联的character子表,这个account实体已经在数据库存在，看会发生什么**

	@Test
    @Rollback(false)
    public void testSaveWhenResetCharacters(){
    	// transient state.
        Account account = new Account();
        account.setAccountId(1L);
        
        //Modify the id here: -> fetch the id from databse.
        account.setId(588L);
        
        // transient state.
        Character character3 = new Character();
        character3.setCharacterId(4L);
         
        // reset account-character relationship.
        Set<Character> characters = new HashSet<Character>();
        characters.add(character3);
        account.setCharacters(characters);
        entityManager.merge(account);
    }

**看log我们只发现了一条sql insert语句，并不会去drop之前关联的characters,因为account不是关系的owner，owner为character**

    2013-03-29 13:00:21,326 DEBUG [org.hibernate.SQL] - <insert into Character (account_id, characterId, wallet_id, id) values (?, ?, ?, ?)>

**再使用@JoinColumn来设置双向关联**

        //再account enity中characters属性设置
        @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
        @JoinColumn(name="account_id")  //will not generate associated table.

**再次执行上面的test case, 看log:**

    2013-04-01 12:54:54,843 DEBUG [org.hibernate.SQL] - <insert into Character (account_id, characterId, wallet_id, id) values (?, ?, ?, ?)>
    2013-04-01 12:54:54,846 DEBUG [org.hibernate.SQL] - <update Character set account_id=null where account_id=? and id=?>
    2013-04-01 12:54:54,846 DEBUG [org.hibernate.SQL] - <update Character set account_id=null where account_id=? and id=?>
    2013-04-01 12:54:54,847 DEBUG [org.hibernate.SQL] - <update Character set account_id=? where id=?>
    2013-04-01 12:54:54,848 DEBUG [org.hibernate.SQL] - <delete from Character where id=?>
    2013-04-01 12:54:54,848 DEBUG [org.hibernate.SQL] - <delete from Character where id=?>

**因为account和character是双向关联，任意一端都可以维护关系，所以会删除character 子表**

> Cheers!
