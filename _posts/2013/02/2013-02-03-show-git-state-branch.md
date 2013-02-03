---
layout: post
title: "Display Git dirty state and branch in terminal"
description: "在终端提示符中显示Git状态和分支情况"
category: Git
keywords: Git Terminal Prompt
tags: [Git]
location: Suzhou, China
---

每次在终端切换到项目目录，判断是否又文件修改&在哪个分支下面都要用git status来判断，为了避免这些麻烦做了个shell函数，可以直接在提示符中显示。

## 添加如下shell代码到~/.bash_profile

    # http://timtang.me/blog/2013/02/03/show-git-state-branch/
    function parse_git_dirty {
          [[ $(git status 2> /dev/null | tail -n1) != "nothing to commit (working directory clean)" ]] && echo "*"
    }

    function parse_git_branch {
          git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e "s/* \(.*\)/[\1$(parse_git_dirty)]/"
    }

    # 距离计算上一次提交的时间
    function git_since_last_commit {
        now=`date +%s`;
        last_commit=$(git log --pretty=format:%at -1 2> /dev/null) || return;
        seconds_since_last_commit=$((now-last_commit));
        minutes_since_last_commit=$((seconds_since_last_commit/60));
        hours_since_last_commit=$((minutes_since_last_commit/60));
        minutes_since_last_commit=$((minutes_since_last_commit%60));
        echo "${hours_since_last_commit}h${minutes_since_last_commit}m ";
    }

    # PS1 设置
    PS1="[\[\033[1;32m\]\u@\h:\w\[\033[0m] \[\033[0m\]\[\033[1;36m\]\$(parse_git_branch)\[\033[0;33m\]\$(git_since_last_commit)\[\033[0m\]$ "

> 别忘了source ~/.bash_profile, 这里是我使用的[**.bash_profile**](https://github.com/tim-tang/dotfiles/blob/master/bash_profile.symlink)


## 好了看下结果：

    [timtang@Tims-MacBook-Air:~/Documents/tim-tang.github.com] [master*]25h9m $

> 一点小技巧希望能帮你在开发的时候少敲几个命令，Cheers!

