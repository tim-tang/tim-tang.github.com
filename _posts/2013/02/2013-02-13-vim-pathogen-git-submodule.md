---
layout: post
title: "Vim-Pathogen and Git submodule mange Vim"
description: "使用 Git Submodule 和 Vim-pathogen同步 Vim 插件及配置"
category: Git
keywords: git submodule pathogen vim
tags: [Git,Vim]
location: Suzhou, China
---

在多台机器Mac 和Linux多台服务器、开发机上使用 Vim 经常需要同步配置文件,，再给 plugin 升级就比较麻烦而且难以管理。同步使用的是 Github + Git submodule，插件管理使用 vim-pathogen(其实 vim-pathogen 也是 Vim 的一个插件，只不过这是一个管理插件的插件) 就可以解决这个问题。


## Pathogen 做了什么?

- 在 Pathogen 之前，安装插件就是把文件都丢到 .vim 目录下，文件都混在一起，非常不好管理

- Pathogen 可以理解成一个插件的加载器，通过 Pathogen，可以将不同的插件放到不同的目录里

- 这样各个插件之间的文件都独立于自己的目录，删除一个插件，只要直接删除这个插件的目录就行了

## Git submodule 优点

- 只依赖于 Git（Pathogen 通过 Git 下载）
- Github 上几乎有全部的 vim 插件库
- 插件更新直接使用Git

## 具体的安装和插件的使用请参考我的[_Vimfiles_](https://github.com/tim-tang/vimfiles), 里面有详细的使用方法快捷键说明等，这里就不再多说。Cheers!
