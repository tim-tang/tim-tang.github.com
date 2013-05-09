---
layout: post
title: "自动生成changelog使用Git log/tag"
description: "使用shell脚本和git log/tag生成changelog.md"
category: Git 
keywords: git tag, shell, changelog
tags: [Git, Shell] 
location: Suzhou, China
---

经常在项目中每当版本发布都要生成changelog来追溯版本的变迁和改动，如果每次发布都需要手动的修改就很麻烦，而且不是很准确，容易遗漏一些改动。为了避免这些问题，想到了用git提供的commit log/tag来作为改动，而且容易追溯，直接可以根据每次commit看到具体的代码修改，下面看下实现。


## 1- 创建changelog.sh脚本：

    #!/bin/bash
	# Author: tim.tang
	rm -f changelog.md

	git for-each-ref --sort='*authordate' --format='%(tag)' refs/tags | grep -v '^$' | tail -r | while read TAG ; do
	    echo
	    if [ $NEXT ];then
	        echo '       ' >> changelog.md
	        echo *$NEXT* >> changelog.md
	        echo '---' >> changelog.md
	    else
	        echo '       ' >> changelog.md
	        echo *CURRENT* >> changelog.md
	        echo '---' >> changelog.md
	    fi

	    echo '    ' >> changelog.md
	    GIT_PAGER=cat git log --no-merges --date=short  --pretty=format:'- %ad (%an) %s -> [view commit](https://github.com/xplusz/smartbus-nodejs/commit/%H)' $TAG..$NEXT >> changelog.md
	    echo '    ' >> changelog.md
	    NEXT=$TAG
	done
	echo "DONE."

## 2- 生成的changelog.md文件

![changelog.md](/images/post/git-changelog.png)

> 以上脚本会自动生成markdown的文本，点击view commit 连接就可看到每次提交的具体修改，这样清晰了很多。Cheers! 
