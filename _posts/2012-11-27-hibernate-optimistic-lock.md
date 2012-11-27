---
layout: post
title: "Handle optimistic lock for JPA and Hibernate integrated architecture"
description: "Introduce to handle optimistic lock for JPA and Hibernate integration."
category: J2EE
tags: [optimistic-lock]
location: Suzhou, China
---

In this article i will introduce how to handle optimistic lock. For the common usage of hibernate optimistic lock is easy, just add the **version** field with annotation in entity.
The above usage just fit for the DAO entity used from end to end. If we have to convert the model, the common usage will be invalide.

## Here we will discuss the more complicated senario,and how to handle the entity not used end to end.

## First we need to wrapper the hibernate **persistenceProvider** to inject to hibernate interface.

	public class ConfigurableHibernatePersistence extends HibernatePersistence {
	   private Interceptor interceptor;
	   public Interceptor getInterceptor() {
	   		return interceptor;
		}

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
			if (this.interceptor != null){
				if (configured.getInterceptor()==null || EmptyInterceptor.class.equals(configured.getInterceptor().getClass())){
				    configured.setInterceptor(this.interceptor);
				}else{
					throw new IllegalStateException("Hibernate interceptor already set in persistence.xml ("+configured.getInterceptor()+")");
				}
			}
		}
	}

## Extend hibernate empty interceptor:

	public class HibernateInterceptor extends EmptyInterceptor{

	  private static final long serialVersionUID = -6142366297876169168L;

	  private static final String LAST_UPDATED = "lastUpdated";

	  // This method is called when entity gets updated.
	  public boolean onFlushDirty(Object entity, Serializable id, Object[] currentState, Object[] previousState,
	        String[] propertyNames, Type[] types) {
	        int timeStampIndex = 0;
	        for (String property : propertyNames) {
	            if (LAST_UPDATED.equals(property)) {
		           break;
	            }
			   timeStampIndex++;
	         }
			if (currentState[timeStampIndex] != null && !currentState[timeStampIndex].equals(previousState[timeStampIndex])) {
				throw new CallbackException("Concurrency Lock!");
			}
			return false;
		}
	}

> Hibernate will auto invoke the onFlushDirty method.

## Alter the configuration file:

	 <bean id="testEntityManagerFactory"
	           class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
		...
		<property name="persistenceProvider">
			<bean class="test.core.utils.ConfigurableHibernatePersistence">
			<property name="interceptor">
				<bean class="test.core.utils.HibernateInterceptor"/>
			</property>
			</bean>
		</property>
		...
	</bean>

> Cheers!
