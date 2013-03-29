---
layout: post
title: "Hibernate JPA Training-2"
description: "Hibernate one-to-one unidirection/bidirection relationship"
category: J2EE 
keywords: Hibernate JPA
tags: [Hibernate]
location: Suzhou, China
---

这篇blog将介绍hibernate 实体间one-to-one关系的单向和双向关联的差异,以及hibernate lazy loading问题。

### 准备工作
---

- 我们有两个entity分别是character和wallet它们之间是1对1的关联关系
- 在character中的wallet属性上加上OneToOne(cascade = CascadeType.ALL)

## 单向关联与双向关联差异：
---

_单向关联setup代码_
	 @Before
    public void setup(){
        // initial character
        character = new Character();
        character.setCharacterId(100000L);
        
        //initial wallet
        Wallet wallet = new Wallet();
        wallet.setCurrency("RMTC");
        wallet.setHardBalance(1L);
        wallet.setSoftBalance(1L);
        
        //set wallet to character
        character.setWallet(wallet);
    }
    
_双向关联setup代码_

    @Before
    public void setup(){
        // initial character
        character = new Character();
        character.setCharacterId(100000L);
        
        //initial wallet
        Wallet wallet = new Wallet();
        wallet.setCurrency("RMTC");
        wallet.setHardBalance(1L);
        wallet.setSoftBalance(1L);
        
        //set wallet to character
        character.setWallet(wallet);
        //set character to wallet
        wallet.setCharacter(character);
    }

_都运行测试_
    @Test
    @Rollback(false)
    public void testSave(){
       entityManager.persist(character);       
    }

**在log中可以看到单向关联执行了2条insert语句：**

    2013-03-29 08:35:16,434 DEBUG [org.hibernate.SQL] - <insert into Wallet (character_id, currency, hardBalance, softBalance, id) values (?, ?, ?, ?, ?)>
    2013-03-29 08:35:16,441 DEBUG [org.hibernate.SQL] - <insert into Character (account_id, characterId, wallet_id, id) values (?, ?, ?, ?)>

**而双向关联执行了2条insert语句和一条update语句用来更新关系:**

    2013-03-29 08:47:34,884 DEBUG [org.hibernate.SQL] - <insert into Wallet (character_id, currency, hardBalance, softBalance, id) values (?, ?, ?, ?, ?)>
    2013-03-29 08:47:34,889 DEBUG [org.hibernate.SQL] - <insert into Character (account_id, characterId, wallet_id, id) values (?, ?, ?, ?)>
    2013-03-29 08:47:34,891 DEBUG [org.hibernate.SQL] - <update Wallet set character_id=?, currency=?, hardBalance=?, softBalance=? where id=?>

> 在remove的时候也是一样双向关联的会多一条update语句，使用的时候要特别注意！

## Hibernate lazy loading 问题介绍及避免
---

_执行如下代码，找出某个character_

    @Test
    @Rollback(false)
    public void testGet(){
        List<Character> characters = entityManager.createQuery("from Character").getResultList();
        Character character = characters.get(0);
        Wallet wallet = null;
        if(character!=null){
            wallet = character.getWallet();
            wallet.getCurrency();
        }       
    }

_我们只执行了一条sql查询但是看log我们发现执行了2条select语句：_

    2013-03-29 08:53:36,401 DEBUG [org.hibernate.SQL] - <select character0_.id as id2_, character0_.account_id as account3_2_,...
    2013-03-29 08:53:36,413 DEBUG [org.hibernate.SQL] - <select wallet0_.id as id6_3_, wallet0_.character_id as character5_6_3...

> 多出来这条sql是在character.getWallet()的时候去执行的。

_可以通过在第一次查询的时候把关联数据一起查出来，来解决这个问题，看如下代码_

    @Test
    @Rollback(false)
    public void testGetJoin(){
        List<Character> characters = entityManager.createQuery("from Character c join fetch c.wallet").getResultList();
        Character character = characters.get(0);
        Wallet wallet = null;
        if(character!=null){
            wallet = character.getWallet();
            wallet.getCurrency();
        } 
    }

_这样只会产生一条sql log_

    2013-03-29 09:02:13,344 DEBUG [org.hibernate.SQL] - <select character0_.id as id2_0_, wallet1_.id as id6_1_, character0_.account_id as account3_2_0_, character0_.characterId as characte2_2_0_, character0_.wallet_id as wallet4_2_0_, wallet1_.character_id as character5_6_1_, wallet1_.currency as currency6_1_, wallet1_.hardBalance as hardBala3_6_1_, wallet1_.softBalance as softBala4_6_1_ from Character character0_ inner join Wallet wallet1_ on character0_.wallet_id=wallet1_.id> 

> 使用的时候要特别注意这个问题, Cheers!
