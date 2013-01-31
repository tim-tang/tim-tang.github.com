---
layout: post
title: "Use spring3.1 hibernate4 atomikos3.8 to implements JTA(XA)"
description: "Implements JTA on jetty with several open source framework."
category: J2EE
keywords: jta spring3 hibernate4 atomikos3.8
tags: [JTA]
location: Suzhou, China
alias: [/J2EE/2012/12/25/spring-hibernate4-atomiks-jta]
---
Introduce to hibernate JPA integrate with spring to implements JTA.

### Preparation
---

* Spring3.1
* Hibernate4
* Atomikos3.8
* Jetty

### Dependency Library
---

* transactions.jar
* transactions-jta.jar
* transactions-jdbc.jar
* transactions-hibernate3.jar
* cglib.jar (hibernate4 depends it)
* spring related libs
* hibernate related libs

### Following is detailed configuration:
---

## Atomikos datasource configuration, we have two datasource like:

	<bean id="firstDataSource" class="com.atomikos.jdbc.AtomikosDataSourceBean" init-method="init" destroy-method="close">
		<description>first XA DataSource</description>
			<property name="uniqueResourceName">
		<value>firstDS</value>
		</property>
			<property name="xaDataSourceClassName" value="${jdbc.driver}" />
			<property name="xaProperties">
			<props>
				<prop key="user">username</prop>
				<prop key="password">password</prop>
				<prop key="serverName">127.0.0.1</prop>
				<prop key="portNumber">5432</prop>
				<prop key="databaseName">dataSource1</prop>
			</props>
		</property>
		<property name="poolSize" value="10"/>
	</bean>

	<bean id="secondDataSource" class="com.atomikos.jdbc.AtomikosDataSourceBean" init-method="init" destroy-method="close">
		<description>second XA DataSource</description>
		<property name="uniqueResourceName">
			<value>secondDS</value>
		</property>
		<property name="xaDataSourceClassName" value="${jdbc.driver}" />
		<property name="xaProperties">
		<props>
			<prop key="user">username</prop>
			<prop key="password">password</prop>
			<prop key="serverName">127.0.0.1</prop>
			<prop key="portNumber">5432</prop>
			<prop key="databaseName">dataSource2</prop>
		</props>
		</property>
		<property name="poolSize" value="10"/>
	</bean>

## Configure the spring entity manager factory

	  <bean id="auditEntityManagerFactory"
	          class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
	        <property name="dataSource" ref="firstDataSource"/>
	        <property name="packagesToScan" value="mtx.audit.model"/>
	        <property name="persistenceUnitName" value="first"/>
	        <property name="jpaVendorAdapter">
	            <bean class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter">
	                <property name="databasePlatform" value="org.hibernate.dialect.PostgreSQLDialect"/>
	            </bean>
	        </property>
	        <property name="jpaProperties">
	            <value>
	                hibernate.show_sql=true
	                hibernate.format_sql=true
	                hibernate.temp.use_jdbc_metadata_defaults=false
	                hibernate.current_session_context_class=jta
	                hibernate.connection.release_mode=on_close
	                hibernate.connection.isolation=3
	              	hibernate.transaction.factory_class=org.hibernate.engine.transaction.internal.jta.CMTTransactionFactory
	                hibernate.transaction.manager_lookup_class=com.atomikos.icatch.jta.hibernate3.TransactionManagerLookup
	            </value>
	        </property>
	   </bean>

	    <bean id="contentEntityManagerFactory"
	          class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
	       	<property name="dataSource" ref="secondDataSource"/>
	        <property name="packagesToScan" value="mtx.authoring.model"/>
	        <property name="persistenceUnitName" value="second"/>
	        <property name="jpaVendorAdapter">
	            <bean class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter">
	                <property name="databasePlatform" value="org.hibernate.dialect.PostgreSQLDialect"/>
	            </bean>
	        </property>
	        <property name="jpaProperties">
	            <value>
	                hibernate.show_sql=true
	                hibernate.format_sql=true
	                hibernate.temp.use_jdbc_metadata_defaults=false
	                <!--
	                hibernate.current_session_context_class=jta
	                hibernate.connection.release_mode=on_close
	                hibernate.connection.isolation=3
	                hibernate.transaction.factory_class=org.hibernate.engine.transaction.internal.jta.CMTTransactionFactory
	                hibernate.transaction.manager_lookup_class=com.atomikos.icatch.jta.hibernate3.TransactionManagerLookup
	                 -->
	            </value>
	        </property>
	    </bean>

## Configure transaction manager

	<tx:annotation-driven transaction-manager="globalTransactionManager" proxy-target-class="true" />

	<bean id="globalTransactionManager" class="org.springframework.transaction.jta.JtaTransactionManager">
		<property name="transactionManager" ref="atomikosTransactionManager"/>
		<property name="userTransaction"  ref="atomikosUserTransaction"/>
	</bean>

	<bean id="atomikosTransactionManager" class="com.atomikos.icatch.jta.UserTransactionManager"
		init-method="init" destroy-method="close">
		<description>Atomikos Transaction Manager</description>
		<property name="forceShutdown">
			<value>true</value>
		</property>
	</bean>

	<bean id="atomikosUserTransaction" class="com.atomikos.icatch.jta.UserTransactionImp">
		<property name="transactionTimeout" value="300" />
	</bean>

## Put jta.properties file into classpath:

	com.atomikos.icatch.service=com.atomikos.icatch.standalone.UserTransactionServiceFactory
	com.atomikos.icatch.console_file_name = tm.out
	com.atomikos.icatch.log_base_name = tmlog
	com.atomikos.icatch.tm_unique_name = com.atomikos.spring.jdbc.tm
	com.atomikos.icatch.console_log_level = INFO
	com.atomikos.icatch.max_timeout=3600000

> Now you can use @Transaction/@PersistenceContext(unitName = "second") to generate the transacton and get the entitymanager, in spring application context.
> Cheers!
