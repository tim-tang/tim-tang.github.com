---
layout: page
title: Welcome to Tech Talk &rarr; {Ruby|ROR|Vim|Mac|Ubuntu}
tagline: Supporting tagline
feed: atom.xml
---
{% include JB/setup %}

[![Feed icon](/files/css/feed-icon-14x14.png){:title="Atom feed of recent posts" .right}][feed]

[feed]: /atom.xml

Recent Posts

{% for post in site.posts limit:12%}
<div class="section list">
<h1>{{ post.date | date_to_string }}</h1>
<p class="line">
<a class="title" href="{{ post.url }}">{{ post.title }}</a>
<a class="comments" href="{{ post.url }}#disqus_thread">View Comments</a>
</p>
<p class="excerpt">{{ post.description}}</p>
</div>
{% endfor %}

<p>
<a href="archive.html">Older Posts &rarr;</a>
</p>

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
	 }());
  //]]>
</script>
