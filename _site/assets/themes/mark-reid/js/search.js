var data = false;
(function ($) {
    $(document).ready(function () {
        var reg = new RegExp("[\\?&]([^=]*)=([^&#]*)");
        var q = null;
        var type = null;
        if (reg.test(window.location.search)) {
            var tab = reg.exec(window.location.search);
            type = tab[1];
            q = $.trim(tab[2]);
        }

        if (q != null) {
            q = decodeURIComponent(q).replace(new RegExp('\\+', 'gi'), ' ');
            search(q, type);
            if (type == 'q') {
                $('#search_form input').val(q);
            } else if (type == 'tag') {
                $('.search-title').html('Tag : ' + q);
            } else if (type == 'cat') {
                $('.search-title').html('Catégorie : ' + q);
            }
        }
    });

    var spanize = function (q, txt)
    {
        return txt.replace(new RegExp(q, 'gi'), '<span class="match">$&</span>');
    }

    var search = function (q, type)
    {
        var posts = new Array();
        var tags = new Array();
        var cats = new Array();

        var r = new RegExp(q, 'gi');

        $.get('/search.json?' + parseInt(Math.random() * 10000000), function (resp) {
            // parse data
            for (i in resp.posts) {
                for (inf in resp.posts[i]) {
                    var post = resp.posts[i];
                    switch (inf) {
                        case 'title':
                        case 'subtitle':
                        case 'description':
                        //case 'keywords':
                        console.log(post[inf].match(r));
                            if (post[inf].match(r) != null) {
                                post[inf] = spanize(q, post[inf]);
                                posts[post.url] = post;
                            }
                            break;
                        case 'tags':
                        case 'categories':
                            for (elmt in post[inf]) {
                                if (post[inf][elmt].match(r) != null) {
                                    post[inf][elmt] = spanize(q, post[inf][elmt]);
                                    posts[post.url] = post;
                                    if (type == 'tag' && inf == 'tags') {
                                        tags[post.url] = true;
                                    } else if (type == 'cat' && inf == 'categories') {
                                        cats[post.url] = true;
                                    }
                                }
                            }
                            break;
                    }
                }
            }

            var outputs = [];

            for (url in posts) {
                var post = posts[url];
                post.tags = post.tags.join(", ");
                post.categories = post.categories.join(", ");

                if (type == 'tag' && !(url in tags)) {
                    continue;
                } else if (type == 'cat' && !(url in cats)) {
                    continue;
                }

                var tpl = '<li class="post">'
                        + '<p class="title"><a href="{{url}}">{{&title}}</a></p>'
                        + '<small class="date"> — Article</small>';

                if (post.date) {
                    var tpl = tpl
                            + '<small class="date"> — {{&date}}</small>';
                }

                if (post.categories.length) {
                    var tpl = tpl
                            + '<small class="categories"> — {{&categories}}</small>';
                }

                if (post.tags.length) {
                    var tpl = tpl
                            + '<small class="tags"> — {{&tags}}</small>';
                }

                //if (post.keywords) {
                //    var tpl = tpl
                //            + '<small class="keywords"> — {{&keywords}}</small>';
                //}

                if (post.description) {
                    var tpl = tpl
                            + '<p class="description">{{&description}}</p>';
                }

                var tpl = tpl
                        + '</li>';

                outputs.push(Mustache.render(tpl, post));
            }

            $('#loader').hide();
            $('#results').show();
            if (outputs.length) {
                $('#results').html('<ul>' + outputs.join("\n") + '</ul>');
            }
        }, 'json');
    }

})(jQuery);

