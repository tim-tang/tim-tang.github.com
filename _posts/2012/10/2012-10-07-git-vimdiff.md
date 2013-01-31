---
layout: post
title: "Git diff,vimdiff Integration"
description: "Use vimdiff as Git merge tool."
category: Git
keywords: git vimdiff merge tool
tags: [Git]
location: Suzhou, China
alias: [/Git/2012/10/07/git-vimdiff]
---
This post introduction Integration vimdiff with git merge tool, for vim liked users.

##Creating the git_diff_wrapper shell script:

     #!/bin/sh
     vimdiff "$5" "$2"

##Edit `~/.bash_profile` add following lines:

     function git_diff() {
	   git diff --no-ext-diff -w "$@" | vim -R -
     }

##Using the command tell git alway use vimdiff:

     git config --global diff.tool vimdiff
     git config --global merge.tool vimdiff

##For the Github detailed refer my configuration file of `~/.gitconfig` file:

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

##If you guys want to tell git to auto completion,following steps:

     brew install bash_completion

##Config `~/.bash_profile`

     if [ -f $(brew --prefix)/etc/bash_completion ]; then
     . $(brew --prefix)/etc/bash_completion
     fi

> Now you can use vimdiff to instead of git diff.

