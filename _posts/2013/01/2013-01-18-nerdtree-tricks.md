---
layout: post
title: "NerdTree Tricks"
description: "Vim 插件nerdtree的一些使用技巧"
category: Vim
keywords: vim nerdtree tricks
tags: [Vim]
location: Suzhou, China
---

介绍一些NerdTree的使用技巧，方便快速开发。

## .vimrc的配置：

    " 让树更好看,我是没看出来
    let NERDChristmasTree=1
    " 让文件排列更有序
    let NERDTreeCaseSensitiveSort=1
    " 改变tree目录的同时改变工程的目录
    let NERDTreeChDirMode=1
    " 当输入 [:e filename]不再显示netrw,而是显示nerdtree
    let NERDTreeHijackNetrw=1
    " 将NerdTree的窗口设置在左侧
    let NERDTreeWinPos="left"

## 帮助文档中的使用介绍:

    o.......Open files, directories and bookmarks....................|NERDTree-o|.......打开文件
    go......Open selected file, but leave cursor in the NERDTree.....|NERDTree-go|.......打开文件,光标  不变位置
    t.......Open selected node/bookmark in a new tab.................|NERDTree-t|.......新标签打开
    T.......Same as 't' but keep the focus on the current tab........|NERDTree-T|.......同上但留在当前
    i.......Open selected file in a split window.....................|NERDTree-i|.......分裂窗口打开文件
    gi......Same as i, but leave the cursor on the NERDTree..........|NERDTree-gi|.......同上留在当前
    s.......Open selected file in a new vsplit.......................|NERDTree-s|.......垂直分裂窗口
    gs......Same as s, but leave the cursor on the NERDTree..........|NERDTree-gs|.......
    O.......Recursively open the selected directory..................|NERDTree-O|.......
    x.......Close the current nodes parent...........................|NERDTree-x|.......收起目录
    X.......Recursively close all children of the current node.......|NERDTree-X|.......收起所有
    e.......Edit the current dif.....................................|NERDTree-e|
    D.......Delete the current bookmark .............................|NERDTree-D|.......上出标签
    P.......Jump to the root node....................................|NERDTree-P|.......跳到目录顶端
    p.......Jump to current nodes parent.............................|NERDTree-p|.......跳到父目录
    K.......Jump up inside directories at the current tree depth.....|NERDTree-K|.......跳到第一个目录
    J.......Jump down inside directories at the current tree depth...|NERDTree-J|.......跳到最后一个文件
    <C-J>...Jump down to the next sibling of the current directory...|NERDTree-C-J|
    <C-K>...Jump up to the previous sibling of the current directory.|NERDTree-C-K|
    C.......Change the tree root to the selected dir.................|NERDTree-C|.......改变当前目录
    u.......Move the tree root up one directory......................|NERDTree-u|.......回上一级目录
    U.......Same as 'u' except the old root node is left open........|NERDTree-U|.......同上并保留显示文件结构
    r.......Recursively refresh the current directory................|NERDTree-r|.......刷新目录
    R.......Recursively refresh the current root.....................|NERDTree-R|.......刷新当前根目录
    m.......Display the NERD tree menu...............................|NERDTree-m|.......显示树菜单
    cd......Change the CWD to the dir of the selected node...........|NERDTree-cd|
    I.......Toggle whether hidden files displayed....................|NERDTree-I|
    f.......Toggle whether the file filters are used.................|NERDTree-f|
    F.......Toggle whether files are displayed.......................|NERDTree-F|
    B.......Toggle whether the bookmark table is displayed...........|NERDTree-B|

    q.......Close the NERDTree window................................|NERDTree-q|
    A.......Zoom (maximize/minimize) the NERDTree window.............|NERDTree-A|
    ?.......Toggle the display of the quick help.....................|NERDTree-?

> Cheers!
