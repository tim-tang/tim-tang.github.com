---
layout: post
title: "Vim 实用命令"
description: "经过实际开发总结了一些有用的VIM命令。"
category: Vim
keywords: vim command trick
tags: [Vim]
location: Suzhou, China
alias: [/Vim/2012/05/18/vim-usefulcommands]
---

Introduce to Vim commands. It is useful for your development.

## 光标移动

	H：移动光标到屏幕上面

	M：移动光标到屏幕中间

	L：移动光标到屏幕下面

	fx：移动光标到当前行的下一个x处。很明显，x可以是任意一个字母，而且你可以使用;来重复你的上一个f命令。

	tx：和上面的命令类似，但是是移动到x的左边一个位置。（这真的很有用）

	Fx：和fx类似，不过是往回找。

	^ : 移到当前行的第一个非空字符。

	*：读取光标处的字符串，n 将光标移动到它再次出现的地方。

	0: 光标移动到行首

	V: 选中一行

    10+ENTER: 光标下移10行

## 视图模式下剪切和拷贝

	d：剪贴选择的内容到剪贴板。

	y：拷贝选择的内容到剪贴板。

	c：剪贴选择的内容到剪贴板并且进入插入模式。


## 代码处理

	%：匹配花括号，方括号，括号等。在一个括号的上面，然后按%，鼠标就会出现在匹配的另外一半括号处。

	gf: 打开引用的文件。

	ctrl+o: 返回到原来的文件。

	ctrl+w, f: 打开引用的文件, 并split窗口给新文件。

	ctrl+w, q: 关闭窗口。

	gg=G   格式化全文代码

## 多列注释

	ctrl+v  选择列模式 输入I（大写），输入#或//，ctrl+[ 多列注释。

## Nerdtree插件

	m: 提供文本文件系统菜单来创建/删除/移动/复制目录或文件

	r:  refreshing current directory

	R: refreshing root directory

	e: browser current directory

## 文件操作

	:e ~/Desktop/xxx   打开文件

	:b#       返回到原来编辑的文件

## 文件查找

	vimgrep /keywords/ **/*.rb

	:cw    打开查找结果

## 文件内容替换

	:%s/str1/str2/ #用字符串 str2 替换文件中首次出现的字符串 str1

	:%s/str1/str2/g #用字符串 str2 替换文件中所有出现的字符串 str1

	:[range]s/pattern/string/[c,e,g,i]

	range: 指的是範圍，1,7 指從第一行至第七行，1,$ 指從第一至最後一行，也就是整篇文章，也可以 % 代表。
	pattern: 就是要被替換掉的字串，可以用 regexp 來表示。
	string: 將 pattern 由 string 所取代。
	c:  confirm，每次替換前會詢問。
	e:  不顯示 error。
	g:  globe，不詢問，整行替換。
	i:  ignore 不分大小寫。


## vim 多列注释：

	ctrl+v  选择列模式
	输入I（大写），输入#或//，ctrl+[ 多列注释。

## 有用的命令

	D: 删除光标后的内容
	/<c-r><c-w>: 将当前单词添加到搜索栏
	% :  跳到对应的括号(),[],{}
	dib: 删除内含 ‘(‘ ‘)’ 块
	diB: 删除内含 ‘{‘ ‘}’ 大块
    .: 重复上次操作
    ~: 将小写改成大写
    zc:  折叠
    zo:  展开折叠
    va{: 选中方法体
    vi{: 选中函数体     如果需要对齐直接 ＝
    vib  选中括号中内容，不包括括号
    vab  选中括号中内容，包括括号
    bcw: 修改单词
    byw: 复制单词
    bvw: 选中单词


## 命令补充

    Select Text
    V stands for v$ (select whole line)

    Changing Text
    cw (Change Word Ex cw,c2w)
    C stands for c$ (change to end of the line)
    s stands for cl (change one character)
    S stands for cc (change a whole line)

    Joining Lines
    J (Join Lines to One. Ex J,3J)
    gJ (Join Lines without Spaces)

    Replacing Charcter
    r<Charcter> (Replace Charater Under Cursour. Ex. ru,5ra,3r<Enter> )
    R<Charcter>

    Changing Case
    ~ (Change Case of Character Ex. ~,12~,~fq)
    U (Make the text Uppercase)
    u (Make the text Lowercase)
    g~motion (It does not depend on tildeop)
    g~~ or g~g~ (Changes case of whole line)
    gUmotion (All uppercase)
    gUU (Changes to uppercase for whole line)
    gUw  (Changes to uppercase for word)
    guw  (Changes to lowercase for word)

> vim的实用中还需要一些插件，具体的配置可以看我们的[**vim环境**](https://github.com/tim-tang/vim).
