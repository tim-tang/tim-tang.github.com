---
layout: post
title: "Mac Tricks"
description: "Introduce to serveral mac tricks."
category: Mac
keywords: mac useful tricks
tags: [Mac]
location: Suzhou, China
---

Introduce to many useful mac tricks.

## Update mac software in terminal

    $ sudo softwareupdate -l
    #proposed update
    $ sudo softwareupdate -i -a
    #In case you want to set well-defined upgrade you have to enter this command:
    $ sudo softwareupdate -i AppName

## Resize images and use terminal

    $ sips -Z 100x100 image.jpg

## Terminal cursor movements

    ctrl+u => delete from the cursor to the beginning of the line
    ctrl+k => delete from the cursor to the end of the line

## Enable safari inspector

    # enable safari develop tool
    $ defaults write com.apple.Safari WebKitDeveloperExtras -bool true
    # disable safari develop tool
    $ defaults write com.apple.Safari WebKitDeveloperExtras -bool false

> check show develop menu bar in Preference.

## Kill dashboard

    # disable dashboard
    $ defaults write com.apple.dashboard mcx-disabled -boolean yes
    $ killall Dock
    # enable dashboard
    $ defaults write com.apple.dashboard mcx-disabled -boolean false
    $ killall Dock

## Show hidden files in finder

    $ defaults write com.apple.finder AppleShowAllFiles true

## Screen capture

    $ screen capture -S ~/Desktop/xxxx.jpg
    # only allow mouse selection mode
    $ screen capture -s ~/Desktop/xxxx.jpg

## Kill desktop
    
    # to hide the desktop icons
    $ defaults write com.apple.finder CreateDesktop -bool false
    # to show the desktop icons
    $ defaults write com.apple.finder CreateDesktop -bool true

## Bring up the Force Quit menu.

    ⌘+⌥+ESC (COMMAND + OPTION + ESCAPE)

> Cheers!
