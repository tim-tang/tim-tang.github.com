---
layout: post
title: "Handle optimistic lock for JPA and Hibernate integrated architecture"
description: "Introduce to handle optimistic lock for JPA and Hibernate integration."
category: J2EE
keywords: hibernate jpa optimistic lock
tags: [optimistic-lock]
location: Suzhou, China
alias: [/J2EE/2012/11/27/hibernate-optimistic-lock]
---

While using DTO instead of managed entity to pass between backend and frontend KendoUI, @Version annotation for JPA will not work because DTO
is not in persistence context and managed.

The solution is to use Spring managed Hibernate interceptor in JPA, when updating an entity, we compare the entity current timestamp with latest timestamp in db,
	when current timestamp is earlier than that of db, we throw concurrency exception because it means this entity is already updated by another user.

## So here are steps of how to configure the interceptor:

<http://blog.krecan.net/2009/01/24/spring-managed-hibernate-interceptor-in-jpa/>

I have been trying to teach Hibernate injecting dependencies into Entities (I know, there is magic @Configurableannotation, I wanted to try it without magic). It is quite easy to do it using Hibernate interceptor (for example likethis). But there is one drawback. It is not straightforward to inject interceptor into Hibernate when JPA abstraction is in the way.


## It is simple to define interceptor in persistence.xml using hibernate.ejb.interceptor property. But it is only possible to specify class name, you can not inject Spring bean. If you read documentation to SpringLocalContainerEntityManagerFactoryBean there is no possibility to specify the interceptor bean there neither. But there is a way how to achieve it. First of all, you have to redefine Hibernate PersistenceProvider.

	public class ConfigurableHibernatePersistence extends HibernatePersistence {
		private Interceptor interceptor;
		public Interceptor getInterceptor() {
			return interceptor;
		}
		w we define HibernateInterceptor:

			public void setInterceptor(Interceptor interceptor) {
				this.interceptor = interceptor;
			}

		@SuppressWarnings("unchecked")
			@Override
			public EntityManagerFactory createContainerEntityManagerFactory(PersistenceUnitInfo info, Map map) {
				Ejb3Configuration cfg = new Ejb3Configuration();
				Ejb3Configuration configured = cfg.configure( info, map );
				postprocessConfiguration(info, map, configured);
				return configured != null ? configured.buildEntityManagerFactory() : null;
			}

		@SuppressWarnings("unchecked")
			protected void postprocessConfiguration(PersistenceUnitInfo info, Map map, Ejb3Configuration configured) {
				if (this.interceptor != null)
				{
					if (configured.getInterceptor()==null || EmptyInterceptor.class.equals(configured.getInterceptor().getClass()))
					{
						configured.setInterceptor(this.interceptor);
					}
					else
					{
						throw new IllegalStateException("Hibernate interceptor already set in persistence.xml ("+configured.getInterceptor()+")");
					}
				}
			}
	}

## Here we override method createContainerEntityManagerFactory in order to add postprocessConfigurationmethod call. In this method, it is possible to change Hibernate configuration as needed. Now the only thing to be done is configuring Spring to use our new PersistenceProvider. It is quite simple.

	<bean id="auditEntityManagerFactory"
		class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
		<property name="dataSource" ref="auditDataSource"/>
		<property name="packagesToScan" value="mtx.audit.model"/>
		<property name="persistenceUnitName" value="audit"/>
		<property name="jpaVendorAdapter">
			<bean class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter">
				<property name="databasePlatform" value="org.hibernate.dialect.PostgreSQLDialect"/>
			</bean>
		</property>
		<property name="persistenceProvider">
			<bean class="mtx.core.utils.ConfigurableHibernatePersistence">
				<property name="interceptor">
					<bean class="mtx.core.utils.HibernateInterceptor"/>
				</property>
			</bean>
		</property>
	</bean>

## How we define HibernateInterceptor:

	public class HibernateInterceptor extends EmptyInterceptor {
		private static final long serialVersionUID = -6142366297876169168L;
		private static final Logger logger = LoggerFactory.getLogger(HibernateInterceptor.class);
		private static final String LAST_UPDATED = "lastUpdated";

	// This method is called when entity gets updated.
	public boolean onFlushDirty(Object entity, Serializable id, Object[] currentState, Object[] previousState,
			String[] propertyNames, Type[] types) {
		int timeStampIndex = -1;
		for (int i = 0; i < propertyNames.length; i++) {
			if (LAST_UPDATED.equals(propertyNames[i])) {
				timeStampIndex = i;
				break;
			}
		}

		if (timeStampIndex != -1 && timeStampIndex < currentState.length && timeStampIndex < previousState.length
				&& currentState[timeStampIndex] != null
				&& ((Timestamp)previousState[timeStampIndex]).after(((Timestamp)currentState[timeStampIndex]))) {
			throw new CallbackException("Concurrency Lock!");
		}
		return false;
	}
}

## At last, there is still one tricky issue, in a transaction when we update an entity and reference it below, by default hibernate flush occur at query execution,this means the entity's timestamp in db is updated when query occurs but current timestamp in persistence context is still the old one, so it is likely concurrency exception willbe thrown on normal save. The solution is to make flushing to occur at end of transaction.To do this, we must extends org.springframework.orm.jpa.vendor.HibernateJpaDialect to enable flushMode COMMIT in EntityManagerFactory:

	<bean id="contentEntityManagerFactory"
		class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
		<property name="jpaDialect">
			<bean class="mtx.core.utils.HibernateJpaDialect">
				<property name="flushMode" value="COMMIT"/>
			</bean>
		</property>
		<property name="dataSource" ref="contentDataSourceSpied"/>
		<property name="packagesToScan" value="mtx.authoring.model"/>
		<property name="persistenceUnitName" value="content"/>
		<property name="jpaVendorAdapter">
			<bean class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter">
				<property name="databasePlatform" value="org.hibernate.dialect.PostgreSQLDialect"/>
			</bean>
		</property>

		<property name="jpaProperties">
			<value>
			hibernate.show_sql=false
			hibernate.format_sql=true
			</value>
		</property>
		<property name="persistenceProvider">
			<bean class="mtx.core.utils.ConfigurableHibernatePersistence">
				<property name="interceptor">
					<bean class="mtx.core.utils.HibernateInterceptor"/>
				</property>
			</bean>
		</property>
	</bean>

## Override Hibernate JPA Dialect:

	public class HibernateJpaDialect extends org.springframework.orm.jpa.vendor.HibernateJpaDialect {
		private FlushMode flushMode;
		public String getFlushMode() {
			return flushMode!=null ? flushMode.toString() : null;
		}


		public void setFlushMode(String aFlushMode) {
			flushMode = FlushMode.parse(aFlushMode);
			if (aFlushMode != null && flushMode == null) {
				throw new IllegalArgumentException (aFlushMode+" value invalid. See class org.hibernate.FlushMode for valid values");
			}
		}


		public Object prepareTransaction(EntityManager entityManager, boolean readOnly, String name)
			throws PersistenceException {
				Session session = getSession(entityManager);
				FlushMode currentFlushMode = session.getFlushMode();
				FlushMode previousFlushMode = null;
				if (getFlushMode() != null) {
					session.setFlushMode(flushMode);
					previousFlushMode = currentFlushMode;
				} else if (readOnly) {
					// We should suppress flushing for a read-only transaction.
					session.setFlushMode(FlushMode.MANUAL);
					previousFlushMode = currentFlushMode;
				}
				else {
					// We need AUTO or COMMIT for a non-read-only transaction.
					if (currentFlushMode.lessThan(FlushMode.COMMIT)) {
						session.setFlushMode(FlushMode.AUTO);
						previousFlushMode = currentFlushMode;
					}
				}
				return new SessionTransactionData(session, previousFlushMode);
			}


		public void cleanupTransaction(Object transactionData) {
			((SessionTransactionData) transactionData).resetFlushMode();
		}

		private static class SessionTransactionData {
			private final Session session;
			private final FlushMode previousFlushMode;

			public SessionTransactionData(Session session, FlushMode previousFlushMode) {
				this.session = session;
				this.previousFlushMode = previousFlushMode;
			}

			public void resetFlushMode() {
				if (this.previousFlushMode != null) {
					this.session.setFlushMode(this.previousFlushMode);
				}
			}
		}
	}

> Cheers!
