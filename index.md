---
layout: page
title: Welcome to Tech Talkin~ &rarr; {Ruby|ROR|Vim|Mac|Linux}
tagline: Supporting tagline
feed: atom.xml
---
{% include JB/setup %}

<form action="/search.html" method="get" id="search_form">
<div align='right'>
<input type="text" name="q" placeholder="Keywords..." />
</div>
</form>

[![Feed icon](/files/css/feed-icon-14x14.png){:title="Atom feed of recent posts" .right}][feed]
[feed]: /atom.xml


## **RECENT POSTS**

{% for post in site.posts limit:18%}
<div class="section list">
<h1>{{ post.date | date_to_string }}</h1>
<p class="line">
<a class="title" href="{{ post.url }}">{{ post.title }}</a>
<a class="comments" href="{{ post.url }}/#disqus_thread">View Comments</a>
</p>
<p class="excerpt">{{ post.description}}</p>
</div>
{% endfor %}

## [**Older posts &rarr;**](/archive.html)

<script type="text/javascript">
//<![CDATA[
(function() {
 var links = document.getElementsByTagName('a');
 var query = '?';
 for(var i = 0; i < links.length; i++) {
     if(links[i].href.indexOf('#disqus_thread') >= 0) {
         query += 'url' + i + '=' + encodeURIComponent(links[i].href) + '&';
     }
 }
 document.write('<script type="text/javascript" src="http://disqus.com/forums/timstechtalk/get_num_replies.js' + query + '"></' + 'script>');
 })();
//]]>
</script>
