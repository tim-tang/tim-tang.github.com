---
layout: post
title: "JBoss AS7 cluster with mod_cluster setup howto"
description: "How to setup JBoss AS7 in domain mode and enable clustering so we could get HA and session replication among the nodes."
category: Cluster
keywords: jbossas7 mod_cluster HA
tags: [Cluster]
location: Suzhou, China
alias: [/Cluster/2012/11/01/jbossas7-cluster-setup-with-modcluster]
---
In this article, I would like to show you how to setup JBoss AS7 in domain mode and enable clustering so we could get HA and session replication among the nodes.

### Preparation
---
**We need to prepare three hosts (or virtual hosts) to do the experiment. We will use these three hosts as following:**

* Install Ubuntu 12.04 LTS on them(Other linux version may also fine)

* Make sure that they are in same local network

* Make sure that they can access each other via different TCP/UDP ports(better turn off firewall and disable SELinux during the experiment or they will cause network problems).

### Scenario
---
**Here are some details on what we are going to do:**

* Let us call one host as 'master'(ip:10.0.0.51), the other one as 'slave'(ip:10.0.1.50), and the third one as 'httpd server'(ip:10.0.1.63).

* Both master and slave will run AS7, and master will run as domain controller, slave will under the domain management of master.

* Apache httpd will be run on httpd server, and in httpd we will enable the mod_cluster module. The as7 on master and slave will form a cluster and discovered by httpd.

* We will deploy a cluster-demo project into domain, and verify that the project is deployed into both master and slave by domain controller. Thus we could see that domain management provide us a single point to manage the deployments across multiple hosts in a single domain.

* We will access the cluster URL and verify that httpd has distributed the request to one of the as7 host. So we could see the cluster is working properly.

* We will try to make a request on cluster, and if the request is forwarded to master as7, we then kill the as7 process on master. After that we will go on requesting cluster and we should see the request is forwarded to slave, but the session is not lost. Our goal is to verify the HA is working and sessions are replicated.

* After previous step finished, we reconnect the master as7 by restarting it. We should see the master as7 is registered back into cluster, also we should see slave as7 sees master as7 as domain controller again and connect to it.

![jboss-cluster](https://docs.jboss.org/author/download/attachments/21626956/test_scenario.jpg?version=1&modificationDate=1330278039000)

## Download JBoss AS7

* First we should download the JBoss AS7.1.1-FINAL from website:

		http://www.jboss.org/jbossas/downloads/

* Then unzipped the package to master and try to make a test run:

		tar -xvf jboss-as-7.1.1.FINAL.tar.gz
		cd jboss-as-7.1.1.Final/bin
		./domain.sh

If everything ok we should see AS7 successfully startup in domain mode.

> Now exit as7 and let us repeat the same steps on slave host. Finally we get AS7 run on both master and slave, then we could move on to next step.

## Domain Configuration

### Interface config on master
---
In this section we will setup both master and slave for them to run in domain mode. And we will configure master to be the domain controller.

* First open the host.xml in master as7 for editing:

		vi domain/configuration/host.xml

* The default settings for interface in this file is like:

		<interfaces>
		  <interface name="management">
			  <inet-address value="${jboss.bind.address.management:127.0.0.1}"/>
		  </interface>
		  <interface name="public">
			   <inet-address value="${jboss.bind.address:127.0.0.1}"/>
		  </interface>
		  <interface name="unsecured">
			   <inet-address value="127.0.0.1" />
		  </interface>
		</interfaces>

* We need to change the address to the management interface so slave could connect to master. The public interface allows the application to be accessed by non-local HTTP, and the unsecured interface allows remote RMI access. My master ip address is 10.0.1.51, so I change the config to:

		<interfaces>
		  <interface name="management">
			  <inet-address value="${jboss.bind.address.management:10.0.1.51}"/>
		  </interface>
		  <interface name="public">
			   <inet-address value="${jboss.bind.address:10.0.1.51}"/>
		  </interface>
		  <interface name="unsecured">
			   <inet-address value="10.0.1.51" />
		  </interface>
		</interfaces>

### Interface config on slave
---

* First edit host.xml

		vi domain/configuration/host.xml

* The configuration we will use on slave is a little bit different, because we need to let slave as7 connect to master as7. First we need to set the hostname. We change the name property from:

		<host name="master" xmlns="urn:jboss:domain:1.1">
		to
		<host name="slave" xmlns="urn:jboss:domain:1.1">

* Then we need to modify domain-controller section so slave as7 can connect to master management port:

		<domain-controller>
		  <!-- As we know, 10.0.1.51 is the ip address of master -->
		  <remote host="10.0.1.51" port="9999"/>
		</domain-controller>

* Finally, we also need to configure interfaces section and expose the management ports to public address:

		<interfaces>
		  <!-- As we know, 10.0.1.50 is the ip address of slave -->
		  <interface name="management">
			  <inet-address value="${jboss.bind.address.management:10.0.1.50}"/>
		  </interface>
		  <interface name="public">
			  <inet-address value="${jboss.bind.address:10.0.1.50}"/>
		  </interface>
		  <interface name="unsecured">
			  <inet-address value="10.0.1.50" />
		  </interface>
		</interfaces>

## Security Configuration
If you start as7 on both master and slave now, you will see the slave as7 cannot be started with following error:

	[Host Controller] 20:31:24,575 ERROR [org.jboss.remoting.remote] (Remoting "endpoint" read-1) JBREM000200: Remote connection failed: javax.security.sasl.SaslException: Authentication failed: all available authentication mechanisms failed
	[Host Controller] 20:31:24,579 WARN  [org.jboss.as.host.controller] (Controller Boot Thread) JBAS010900: Could not connect to remote domain controller 10.211.55.7:9999
	[Host Controller] 20:31:24,582 ERROR [org.jboss.as.host.controller] (Controller Boot Thread) JBAS010901: Could not connect to master. Aborting. Error was: java.lang.IllegalStateException: JBAS010942: Unable to connect due to authentication failure.

Because we have not properly set up the authentication between master and slave. Now let us work on it:

### Master
---

* In bin directory there is a script called add-user.sh, we will use it to add new users to the properties file used for domain management authentication:

		./add-user.sh
		What type of user do you wish to add?
		a) Management User (mgmt-users.properties)
		b) Application User (application-users.properties)
		(a): a

		Enter the details of the new user to add.
		Realm (ManagementRealm) :
		Username : master
		Password : 123
		Re-enter Password : 123
		About to add user 'master' for realm 'ManagementRealm'
		Is this correct yes/no? yes
		Added user 'master' to file '/Users/tim/Applications/jboss-as-7.1.1.Final/standalone/configuration/mgmt-users.properties'
		Added user 'master' to file '/Users/tim/Applications/jboss-as-7.1.1.Final/domain/configuration/mgmt-users.properties'

* As shown above, we have created a user named 'admin' and its password is '123'. Then we add another user called 'slave':

		./add-user.sh
		What type of user do you wish to add?
		 a) Management User (mgmt-users.properties)
		 b) Application User (application-users.properties)
		(a): a

		Enter the details of the new user to add.
		Realm (ManagementRealm) :
		Username : slave
		Password : 123
		Re-enter Password : 123
		About to add user 'slave' for realm 'ManagementRealm'
		Is this correct yes/no? yes
		Added user 'slave' to file '/Users/tim/Applications/jboss-as-7.1.1.Final/standalone/configuration/mgmt-users.properties'
		Added user 'slave' to file '/Users/tim/Applications/jboss-as-7.1.1.Final/domain/configuration/mgmt-users.properties'

> We will use this user for slave as7 host to connect to master. Notice that the username must be equal to the name given in the slaves host element. That mean for each additional host you need a user.

* Add hornetq server username/password node in domain.xml, find  full-ha profile under hornetq-server node add following:

		<cluster-user>admin</cluster-user>
		<cluster-password>1234565</cluster-password>

* Alter mod-config-cluster node in domain.xml under full-ha profile to:

		<!-- proxy-list is the target httpd server ip:port -->
		<mod-cluster-config advertise-socket="modcluster" proxy-list="10.0.1.63:10001">

* Find following node in domain.xml under full-ha profile:

		<subsystem xmlns="urn:jboss:domain:web:1.1" default-virtual-server="default-host" native="false">
* Update to:

	    <subsystem xmlns="urn:jboss:domain:web:1.1" default-virtual-server="default-host" instance-id="${jboss.node.name}" native="false">

* In the end of domain.xml change the server-groups node like following , we only need main server group:

		<server-groups>
		 <server-group name="main-server-group" profile="full-ha">
			<jvm name="default">
			   <heap size="64m" max-size="512m"/>
			</jvm>
			<socket-binding-group ref="ha-sockets"/>
		 </server-group>
		</server-groups>

* Update host.xml servers node:

		<servers>
	        <server name="server-one" group="main-server-group">
            <!-- Remote JPDA debugging for a specific server
            <jvm name="default">
            <jvm-options>
				<option value="-Xrunjdwp:transport=dt_socket,address=8787,server=y,suspend=n"/>
            </jvm-options>
			</jvm>
			 -->
			</server>
		</servers>

### Slave
---

* In slave we need to configure host.xml for authentication. We should change the security-realms section as following:

		<security-realms>
		   <security-realm name="ManagementRealm">
			   <server-identities>
				   <secret value="MTIz"/>
			   </server-identities>
			   <authentication>
				   <properties path="mgmt-users.properties" relative-to="jboss.domain.config.dir"/>
			   </authentication>
		   </security-realm>
		</security-realms>

* In secret value property we have 'MTIz', which is the base64 code for '123'. You can generate this value by using a base64 calculator such as the one at http://www.webutils.pl/index.php?idx=base64.

* Then in domain controller section we also need to add security-realm property:

		<domain-controller>
		 <remote host="10.0.1.51" port="9999" security-realm="ManagementRealm"/>
		</domain-controller>

* In the end of domain.xml change the server-groups node to following , we only need main server group:

		<server-groups>
		 <server-group name="main-server-group" profile="full-ha">
			<jvm name="default">
			   <heap size="64m" max-size="512m"/>
			</jvm>
			<socket-binding-group ref="ha-sockets"/>
		 </server-group>
		</server-groups>

* Update host.xml servers node:

		<servers>
	        <server name="server-two" group="main-server-group">
            <!-- Remote JPDA debugging for a specific server
            <jvm name="default">
            <jvm-options>
				<option value="-Xrunjdwp:transport=dt_socket,address=8787,server=y,suspend=n"/>
            </jvm-options>
			</jvm>
			 -->
			</server>
		</servers>

* In the end of domain.xml change the server-groups node like following , we only need main server group:

		<server-groups>
		 <server-group name="main-server-group" profile="full-ha">
			<jvm name="default">
			   <heap size="64m" max-size="512m"/>
			</jvm>
			<socket-binding-group ref="ha-sockets"/>
		 </server-group>
		</server-groups>

### Dry Run
---

* Now everything is set for the two hosts to run in domain mode. Let us start them by running domain.sh on both hosts. If everything goes fine, we could see from the log on master:

		[Host Controller] 21:30:52,042 INFO  [org.jboss.as.domain] (management-handler-threads - 1) JBAS010918: Registered remote slave host slave

## Cluster Configuration

* Download mod_cluster binary package from:

> <http://www.jboss.org/mod_cluster/downloads>

* The version We downloaded is:

> <http://downloads.jboss.org/mod_cluster//1.2.0.Final/mod_cluster-1.2.0.Final-linux2-x64-ssl.tar.gz>

* Install the whole httpd, that will give you a full httpd install in your /opt/jboss directory.:

		cd /
	    tar xvf mod-cluster-1.2.0.Final-linux2-x64-ssl.tar.gz

* Edit httpd.conf:

	    sudo vi /opt/jboss/httpd/httpd/conf/httpd.conf

* Then we change the httpd.conf:

	    Listen 10.0.1.63:10001

* Alter default config at the bottom of httpd.conf:

		<Ifmodule manager_module>
		  #  Listen 10.0.1.63:10001
		  ManagerBalancerName my-cluster
		  <VirtualHost 10.0.1.63:10001>
			<Location />
			 Order deny,allow
			 Deny from all
			 Allow from 10.0.1
			</Location>

			KeepAliveTimeout 300
			MaxKeepAliveRequests 0
			#ServerAdvertise on http://@IP@:6666
			AdvertiseFrequency 5
			#AdvertiseSecurityKey secret
			#AdvertiseGroup @ADVIP@:23364
			EnableMCPMReceive

			<Location /mod_cluster-manager>
			 SetHandler mod_cluster-manager
			 Order deny,allow
			 Deny from all
			 Allow from 10.0.1
			</Location>

		 </VirtualHost>
		</IfModule>

* Start the httpd server:

		cd /opt/jboss/httpd/sbin/
	    sudo ./apachctl start

* Go to http://10.0.1.63:10001 to verfiy apache httpd server works.

## Deployment

* Now we can deploy a demo project into the domain. I have created a simple project located at:

		<https://github.com/liweinan/cluster-demo>

* We can use git command to fetch a copy of the demo:

		git clone git://github.com/liweinan/cluster-demo.git

* In this demo project we have a very simple web application. In web.xml we have enabled session replication by adding following entry:

		<distributable/>

* Now we need to create a war from it. In the project directory, run the following command to get the war:

		mvn clean compile install

* Then we need to deploy the cluster-demo.war into domain. First we should access the http management console on master(Because master is acting as domain controller):

		http://10.0.1.51:9990

* It will popup a windows ask you to input account name and password, we can use the 'master' account we have added just now. After logging in we could see the 'Server Instances' window. By default there server-one listed  in running status.

* Select 'runtime' and the server 'slave' in the upper corners.you will see the server-two listed in running status.

* Entering 'Manage Deployments' page, click 'Add Content' at top right corner. Then we should choose our cluster-demo.war, and follow the instruction to add it into our content repository.

* Now we can see cluster-demo.war is added. Next we click 'Add to Groups' button and add the war to 'main-server-group' and then click 'save'.Wait a few seconds, management console will tell you that the project is deployed into 'main-server-group'.：

* If everything go well, you can visist URL, you will see two nodes are added and active:

		http://10.0.1.63:10001/mod_cluster-manager

## Testing

* access the cluster

		http://10.0.1.63/cluster-demo/put.jsp

* We should see the request is distributed to one of the hosts(master or slave) from the as7 log

		[Server:server-three] 16:06:22,256 INFO  [stdout] (http-10.211.55.7-10.211.55.7-8330-4) Putting date now

* Killing the server by using system commands will have the effect that the Host-Controller restart the instance imediately!

* Then wait for a few seconds and access cluster:

		http://10.0.1.63/cluster-demo/get.jsp

* Now the request should be served by slave and we should see the log from slave as7:

		[Server:server-three-slave] 16:08:29,860 INFO  [stdout] (http-10.211.55.2-10.211.55.2-8330-1) Getting date now

## Refence docs

* AS7 Cluster Howto: <https://docs.jboss.org/author/display/AS71/AS7+Cluster+Howto>
* JBoss mod_cluster: <http://www.jboss.org/mod_cluster>

> Cheers!
