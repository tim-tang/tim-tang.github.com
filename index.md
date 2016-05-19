---
layout: page
title: 𝕎𝕖𝕝𝕔𝕠𝕞𝕖 𝕥𝕠 𝕋𝕖𝕔𝕙 𝕋𝕒𝕝𝕜
tagline: Supporting tagline
feed: atom.xml
---
{% include JB/setup %}

<form action="/search.html" method="get" id="search_form">
<div align='right'>
<input type="text" name="q" placeholder="Keywords..." />
</div>
</form>

[![Feed icon](/images/feed-icon-14x14.png){:title="Atom feed of recent posts" .right}](/atom.xml)


## **RECENT POSTS**

{% for post in site.posts limit:18%}
<div class="section list">
<h1>{{ post.date | date_to_string }}</h1>
<p class="line">
<a class="title" href="{{ post.url }}">{{ post.title }}</a>
<a class="comments" href="{{ post.url }}#disqus_thread">View Comments</a>
</p>
<p class="excerpt">{{ post.description}}</p>
</div>
{% endfor %}

## [**Older posts &rarr;**](/categories.html)

<script id="dsq-count-scr" src="//timstechtalk.disqus.com/count.js" async></script>
