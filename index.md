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
/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
var disqus_shortname = 'timstecktalk'; // required: replace example with your forum shortname

/* * * DON'T EDIT BELOW THIS LINE * * */
(function () {
 var s = document.createElement('script'); s.async = true;
 s.type = 'text/javascript';
 s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
 (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
 }());
</script>
