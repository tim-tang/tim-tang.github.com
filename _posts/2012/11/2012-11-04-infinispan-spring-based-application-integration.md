---
layout: post
title: "Infinispan integrate with spring based application"
description: "Integrate Infinispan with spring based application and cluster customization."
category: Cluster
keywords: infinispan spring integration
tags: [Infinispan]
location: Suzhou, China
alias: [/Cluster/2012/11/04/infinispan-spring-based-application-integration]
---
This blog will introduce infinispan integrate with spring. While we need to use jboss cluster, we need to do infinispan-spring costomization.

## Preparation

* Add inifinspan spring related jars:

		<dependency>
			<groupId>org.infinispan</groupId>
			<artifactId>infinispan-core</artifactId>
			<version>5.1.2.Final</version>
		</dependency>
		<dependency>
			<groupId>org.infinispan</groupId>
			<artifactId>infinispan-spring</artifactId>
			<version>5.1.2.Final</version>
		</dependency>

### Usage

## Configuration

* Add infinispan.xml file(we use the simplest configuration for demo) into the classpath:

		<infinispan
		    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		    xsi:schemaLocation="urn:infinispan:config:5.1 http://www.infinispan.org/schemas/infinispan-config-5.1.xsd"
		    xmlns="urn:infinispan:config:5.1">

		    <namedCache name="mtx.infinispan.global">
		        <eviction strategy="LIRS" maxEntries="50000" />
		    </namedCache>
		</infinispan>

* Add configuration for sping application_context.xml

		<beans profile="default, dev">
		   <bean id="cacheManager" class="org.infinispan.spring.provider.SpringEmbeddedCacheManagerFactoryBean"
			   p:configurationFileLocation="classpath:infinispan.xml">
		   </bean>
		</beans>

> For SpringEmbeddedCacheManagerFactoryBean.java we need to specify the infinispan.xml location. This bean will implements spring FactoryBean interface.Then will provide CacheManage application context dynamic.

### Programming

* Now we can use the spring @Cacheable annotation on method, like following:

		@Cacheable(value = "infinispan cache name", key = "KEY: #id")
		//@Cacheable annotation will use the input parameter as the cache key by default.
		public Object getSomeThing(Long id) throws DAOException {
			//...
		}

* For programming usage we just need to injection CacheManager interface.

		@Autowired
		private CacheManager cacheManager;

### Infinispan Clustering

* While we need to use jboss clustering, we have to  customization SpringEmbeddedCacheManagerFactoryBean, cause we need to use JNDI to create cache manager.

* Create JndiSpringCacheManagerFactoryBean.java override afterPropertySet method

		 @Override
		 public void afterPropertiesSet() throws Exception {
		     this.logger.info("Initializing SpringEmbeddedCacheManager instance ...");
		     JndiTemplate jndiTemplate = new JndiTemplate();
		     final EmbeddedCacheManager nativeEmbeddedCacheManager = (EmbeddedCacheManager) jndiTemplate
		            .lookup("java:jboss/infinispan/container/cluster");
		     this.cacheManager = new SpringEmbeddedCacheManager(nativeEmbeddedCacheManager);
	         LOG.info("Successfully initialized SpringEmbeddedCacheManager instance [" + this.cacheManager + "]");
	     }

* Add config in application-context.xml:

		 <!-- Clustering Infinispan cache manager -->
		 <beans profile="production">
		    <bean id="cacheManager" class="mtx.core.infinispan.JndiSpringCacheManagerFactoryBean"
		          p:InfinispanJNDI="java:jboss/infinispan/container/cluster">
		    </bean>
		 </beans>

> For more jboss cluster related information please look up last blog.
> Cheers!
