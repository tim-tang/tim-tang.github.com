"""
Tech Talk Jekyll blog auto deployment tool.
"""
from fabric.api import *
from fabric.contrib.files import exists
from fabric.colors import green, red

####################################################################
# 			     Tech Talk  Auto Deployment                       #
####################################################################

# Internal variables
JEKYLL_HOME = "/srv/jekyll"
DEPLOY_USER = "root"
DEPLOY_HOST = "173.255.253.43"
TRAVIS_SSH_KEY = "~/.ssh/id_rsa"

def setup():
    """Prepare to login to Linode server."""
    env.host_string = DEPLOY_HOST
    env.user = DEPLOY_USER
    env.key_filename = TRAVIS_SSH_KEY
    env.port = 22
    print(green("=>> Login Linode production server succeed!!!"))

def deploy():
    """ Ready to deploy Jekyll blog """
    if not exists(JEKYLL_HOME):
        run("mkdir -p %s" % JEKYLL_HOME)
    #put('nginx.conf', '%s/default.conf' %(JEKYLL_HOME))
    else:
       run('sudo rm -rf %s/_site' % JEKYLL_HOME)
    put('_site', JEKYLL_HOME)
    run('systemctl restart nginx')
    print(green("!!! Deploy Linode Production Server Succeed !!!"))
