---
layout: post
title: "Build Jekyll presentation with Jekyll and Hyde"
description: "Use jkeyll-and-hyde ruby gem to build on-line PPT"
category: Git
keywords: jekyll hyde presentation
tags: [Git]
location: Suzhou, China
---

Introduce to use Jekyll and Hyde ruby gem to create on-line ppt.

## Install Jekyll-and-hyde rubygem

    $ gem install jekyll_and_hyde

## Generate local git project

    $ jh new jekyll_presentation --github
    $ cd jekyll_presentation
    $ jh generate first_slide

> Go to _posts/fist_slide.markdown and edit it.(with markdown.)

## Create one repository on github

## Adding remote repostory

    $ git remote add origin git@github.com:tim-tang/jekyll_presentation.git
    $ git add .
    $ git commit -am 'initial commit.'
    $ git push origin gh-page   # push local project into github as git pages

## Testing it

_Go to <http://tim-tang.github.com/jekyll_presentation>, you will see the results._

> Git pages service is amazing! Cheer!


