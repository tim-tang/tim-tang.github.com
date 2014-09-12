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
JEKYLL_HOME = "/srv/www/tim-tang.github.com/public_html/jekyll"
DEPLOY_USER = "hash"
DEPLOY_HOST = "173.255.253.43"
TRAVIS_SSH_KEY = "~/.ssh/id_rsa"

def setup():
    """Prepare to login to Linode server."""
    env.host_string = DEPLOY_HOST
    env.user = DEPLOY_USER
    env.key_filename = TRAVIS_SSH_KEY
    env.port = 22
    print(red("Login Linode production server succeed!"))

def deploy():
    """ Ready to deploy Jekyll blog """
    if exists(JEKYLL_HOME):
        run("mkdir -p %s" % JEKYLL_HOME)
    else:
       run('rm -rf %s/_site' % JEKYLL_HOME)
    put("_site", JEKYLL_HOME)
    print(red("Deploy Linode production server succeed!"))
