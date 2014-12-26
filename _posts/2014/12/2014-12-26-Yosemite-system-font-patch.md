---
layout: post
title: "Mac OSX Yosemite系统字体修改"
description: "Max OSX Yosemite 使用Avenir Next作为系统字体"
category: misc
keywords: Yosemite system font patch
tags: [Misc]
location: Suzhou, China
---

Mac OSX Yosemite系统字体修改找了很多但是都不完美，终于在逛GitHub的时候找到了一个个人感觉比较干净的修改方法，分享一下！

## Prerequistion
---

- [HomeBrew](http://brew.sh/index.html) installed
- [XQuartz](https://xquartz.macosforge.org/landing/) installed

## Installation Steps
---

    $ brew install -vd fontforge --enable-pyextension --with-python
    $ brew doctor 

> Check and modify environment PATH /usr/local/bin before /usr/bin

    $ python -c 'import fontforge; print "FontForge works in Python"' # Check fontforge can be imported in python
    $ brew linkapps fontforge   # This step is optional, if you want to open fontforge in as application, then you can do it!
    $ git clone https://github.com/tim-tang/YosemiteSystemFontPatcher.git 

> 这里我已经创建了一个patch_avenir.sh的脚本,直接使用即可,代码清单如下:

    #!/bin/bash -e
    bin/patch 'System Font Regular'            'Avenir Next.ttc(Avenir Next Medium)'
    bin/patch 'System Font Bold'               'Avenir Next.ttc(Avenir Next Bold)'
    bin/patch 'System Font Italic'             'Avenir Next.ttc(Avenir Next Medium Italic)'
    bin/patch 'System Font Bold Italic'        'Avenir Next.ttc(Avenir Next Bold Italic)'
    bin/patch 'System Font Medium P4'          'Avenir Next.ttc(Avenir Next Demi Bold)'
    bin/patch 'System Font Medium Italic P4'   'Avenir Next.ttc(Avenir Next Demi Bold Italic)'

下面继续：

    $ cp /System/Library/Fonts/Avenir Next.ttc  ./  # Copy Avenir font source to current repo root
    $ cp /System/Library/Fonts/HelveticaNeueDeskInterface.ttc ./ # use HelveticaNeue font as template
    $ ./patch_avenir.sh

> 鉴于这个问题 https://github.com/dtinth/YosemiteSystemFontPatcher/issues/16 我们需要做如下操作！

 $ cp *.ttf /Library/Fonts/
 $ cd /Library/Fonts/ && sudo chown root:wheel System\ Avenir\ Next\ *
 $ diskutil repairPermissions /

> 将用户登出以后重新登录, 就可以大功告成了!

![mac-sys-font-patch](/images/post/mac-sys-font-patch.png)

## Reference
---

- [Font location & Purpose](http://support.apple.com/en-us/HT201722)
- [FontForge installation](http://www.davidlanier.com/blog/2012/1/how-to-install-fontforge-mac-os-x-lion-homebrew)
- [Change The Font Yosemit](https://medium.com/@dtinth/changing-the-system-font-on-yosemite-5870887e7b45)
- [Step by step guide](https://github.com/dtinth/YosemiteSystemFontPatcher/wiki/Step-by-Step-Guide)

> 当然如果你想直接使用Avenir Next字体，直接将我repo中fonts目录下的字体复制到/Library/Fonts目录下就可以，要想用其他的字体就要自己生成了，Cheers!
