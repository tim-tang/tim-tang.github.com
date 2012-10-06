---
layout: post
title: "Git diff,vimdiff 集成"
description: "使用vimdiff作为Git合并工具"
category: Git
tags: [Git]
---

###Creating the git_diff_wrapper shell script:
<pre>
#!/bin/sh
vimdiff "$5" "$2"
</pre>

###Edit ~/.bash_profile add following lines:
<pre>
function git_diff() {
	git diff --no-ext-diff -w "$@" | vim -R -
}
</pre>

###Using the command tell git alway use vimdiff:
<pre>
git config --global diff.tool vimdiff
git config --global merge.tool vimdiff
</pre>

###For the Github detailed refer my configuration file of ~/.gitconfig file:
<pre>
[diff]
prompt = true
tool = vimdiff
external = git_diff_wrapper
[difftool]
prompt = true
[merge]
tool = vimdiff
[pager]
diff =
[alias]
lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative
st = status
ci = commit
co = checkout
di = diff
dc = diff --cached
amend = commit --amend
aa = add --all
ff = merge --ff-only
pullff = pull --ff-only
noff = merge --no-ff
fa = fetch --all
pom = push origin master
b = branch
ds = diff --stat=160,120
dh1 = diff HEAD~1
[mergetool]
keepBackup = false
</pre>

###If you guys want to tell git to auto completion,following steps:
 - You need to install bash_completion.
<pre>
brew install bash_completion
</pre>
 - Config ~/.bash_profile
<pre>
if [ -f $(brew --prefix)/etc/bash_completion ]; then
. $(brew --prefix)/etc/bash_completion
fi
</pre>

###Now you can use vimdiff to instead of git diff.

