---
layout: post
title: "How to use spring security tags in free marker pages."
description: "Introduce to use spring security tags in free marker."
category: Msic
keywords: spring security tags freemarker
tags: [spring]
location: Suzhou, China
alias: [/Msic/2012/11/16/use-spring-security-tags-in-freemaker]
---

If we need to use spring security tags in free marker, do as following:

## Put code into \*.ftl

	<#assign security=JspTaglibs["/WEB-INF/security.tld"]/>

## Copy security.tld from spring security source into WEB-INF/ folder.

## You can add code to testing:

	<#if Session["SPRING_SECURITY_CONTEXT"]?exists>
		<ul>
			<li>${Session["SPRING_SECURITY_CONTEXT"].authentication.name}</li>
			<li>
			<#assign authorities = Session["SPRING_SECURITY_CONTEXT"].authentication.authorities />
				<#list authorities as authority>
					${authority}
				</#list>
			</li>
		</ul>
	<@security.authentication property="name" ></@security.authentication>
	<@security.authorize ifAnyGranted="MTXTU-TestPerm,MTXTU-TestPerm2"> Welcome to Runtime.</@security.authorize>
	</#if>

> Cheers!
