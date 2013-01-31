---
layout: post
title: "Integrate spring3.1 hibernate4 with JBoss AS7 JTA"
description: "Use JBoss AS7 JTA to integrate with spring3.1 and hibernate4 JPA"
category: J2EE
keywords: jta spring3.1 hibernate4 integration jbossas7
tags: [JTA]
location: Suzhou, China
alias: [/J2EE/2012/12/25/integrate-spring3-hibernate4-with-jboss-as7-jta]
---

Use JBoss AS7 JTA to integrate with spring3.1 and hibernate4 JPA.

### Some traps:
---

* JBoss AS7 use hibernate4.0.1.Final as default JPA implementation, so do not use hiberante3.

* Use xa-datasource configuration in standalone.xml

### JBoss AS7 standalone.xml config:
---

## xa-datasource configuration

	 <xa-datasource jndi-name="java:jboss/datasources/firstDS" pool-name="firstDS" enabled="true" use-java-context="true" spy="true">
		<xa-datasource-property name="user">
			username
		</xa-datasource-property>
		<xa-datasource-property name="password">
			password
		</xa-datasource-property>
		<xa-datasource-property name="serverName">
			localhost
		</xa-datasource-property>
		<xa-datasource-property name="portNumber">
			5432
		</xa-datasource-property>
		<xa-datasource-property name="databaseName">
			firstDS
		</xa-datasource-property>
		<driver>postgresql</driver>
		<xa-pool>
			<min-pool-size>5</min-pool-size>
			<max-pool-size>100</max-pool-size>
			<prefill>false</prefill>
			<is-same-rm-override>false</is-same-rm-override>
			<interleaving>false</interleaving>
			<no-tx-separate-pools>false</no-tx-separate-pools>
		</xa-pool>
		<validation>
			<valid-connection-checker class-name="org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLValidConnectionChecker"/>
			<exception-sorter class-name="org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLExceptionSorter"/>
		</validation>
	</xa-datasource>
	<xa-datasource jndi-name="java:jboss/datasources/secondDS" pool-name="secondDS" enabled="true" use-java-context="true">
		<xa-datasource-property name="user">
			username
		</xa-datasource-property>
		<xa-datasource-property name="password">
			password
		</xa-datasource-property>
		<xa-datasource-property name="serverName">
			localhost
		</xa-datasource-property>
		<xa-datasource-property name="portNumber">
			5432
		</xa-datasource-property>
		<xa-datasource-property name="databaseName">
			secondDS
		</xa-datasource-property>
		<driver>postgresql</driver>
		<xa-pool>
		<min-pool-size>5</min-pool-size>
		<max-pool-size>100</max-pool-size>
		<prefill>false</prefill>
			<is-same-rm-override>false</is-same-rm-override>
			<interleaving>false</interleaving>
			<no-tx-separate-pools>false</no-tx-separate-pools>
		</xa-pool>
	  <validation>
			<valid-connection-checker class-name="org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLValidConnectionChecker"/>
			<exception-sorter class-name="org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLExceptionSorter"/>
		</validation>
      </xa-datasource>
	<drivers>
		<driver name="postgresql" module="org.postgresql">
			<xa-datasource-class>org.postgresql.xa.PGXADataSource</xa-datasource-class>
		</driver>
    </drivers>

### Spring application context related configuration
---

## We need to add META-INF/persistence.xml in classpath

	<?xml version="1.0" encoding="UTF-8" ?>
	<persistence version="2.0"
	xmlns="http://java.sun.com/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd">
	<persistence-unit name="firstUnit" transaction-type="JTA">
		<provider>org.hibernate.ejb.HibernatePersistence</provider>
		<jta-data-source>java:jboss/datasources/firstDS</jta-data-source>
		<class>test.jta.model.Testing1</class>
		<exclude-unlisted-classes>true</exclude-unlisted-classes>
		<properties>
			<property name="jboss.entity.manager.factory.jndi.name"
				value="java:jboss/firstUnitEntityManagerFactory" />
			<property name="hibernate.dialect" value="org.hibernate.dialect.PostgreSQLDialect" />
			<property name="hibernate.show_sql" value="true" />
			<property name="hibernate.format_sql" value="true" />
			<property name="hibernate.temp.use_jdbc_metadata_defaults"
				value="false" />
			<property name="hibernate.transaction.factory_class"
				value="org.hibernate.engine.transaction.internal.jta.CMTTransactionFactory" />
			<property name="hibernate.transaction.jta.platform"
				value="org.hibernate.service.jta.platform.internal.JBossAppServerJtaPlatform" />
		</properties>
	</persistence-unit>

	<persistence-unit name="secondUnit" transaction-type="JTA">
		<provider>org.hibernate.ejb.HibernatePersistence</provider>
		<jta-data-source>java:jboss/datasources/secondDs</jta-data-source>
		<class>test.jta.model.Testing2</class>
		<exclude-unlisted-classes>true</exclude-unlisted-classes>
		<properties>
			<property name="jboss.entity.manager.factory.jndi.name"
				value="java:jboss/secondUnitEntityManagerFactory" />
			<property name="hibernate.dialect" value="org.hibernate.dialect.PostgreSQLDialect" />
			<property name="hibernate.show_sql" value="true" />
			<property name="hibernate.format_sql" value="true" />
			<property name="hibernate.temp.use_jdbc_metadata_defaults"
				value="false" />
			<property name="hibernate.transaction.factory_class"
				value="org.hibernate.engine.transaction.internal.jta.CMTTransactionFactory" />
			<property name="hibernate.transaction.jta.platform"
				value="org.hibernate.service.jta.platform.internal.JBossAppServerJtaPlatform" />
		</properties>
	</persistence-unit>
	</persistence>

## Configuration for sping-applicationContext.xml

  	<tx:jta-transaction-manager />

	<bean id="globalTransactionManager" class="org.springframework.transaction.jta.JtaTransactionManager"/>

	<bean id="firstEntityManagerFactory"
		  class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
		<property name="dataSource" ref="firstDS"/>
		<property name="persistenceUnitName" value="firstUnit"/>
	</bean>

	<bean id="secondEntityManagerFactory"
		  class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
		<property name="dataSource" ref="secondDS"/>
		<property name="persistenceUnitName" value="secondUnit"/>
		<property name="persistenceProvider">
			<bean class="mtx.core.utils.ConfigurableHibernatePersistence">
				<property name="interceptor">
					<bean class="mtx.core.utils.HibernateInterceptor"/>
				</property>
			</bean>
		</property>
	</bean>

	<bean id="firstDS" class="org.springframework.jndi.JndiObjectFactoryBean"
		  p:jndiName="java:jboss/datasources/firstDS" p:lookupOnStartup="false"
		  p:proxyInterface="javax.sql.DataSource"/>

	<bean id="secondDS" class="org.springframework.jndi.JndiObjectFactoryBean"
		  p:jndiName="java:jboss/datasources/secondDS" p:lookupOnStartup="false"
		  p:proxyInterface="javax.sql.DataSource"/>

> Now you guys can build your application and deploy it to you JBoss AS7.
> Any questions please leave a comment. For the related jars please refer: [Use spring3.1 hibernate4 atomikos3.8 to implements JTA(XA)](http://tim.everyday-cn.com/J2EE/2012/12/25/spring-hibernate4-atomiks-jta/)
> Cheers!
