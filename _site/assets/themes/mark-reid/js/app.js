(function() {

  $(document).ready(function() {
    $("a.go_top").click(function() {
      $('html, body').animate({
        scrollTop: 0
      }, 300);
      return false;
    });
    return $(window).bind('scroll resize', function() {
      var scroll_from_top;
      scroll_from_top = $(window).scrollTop();
      if (scroll_from_top >= 1) {
        return $("a.go_top").show();
      } else {
        return $("a.go_top").hide();
      }
    });
  });

}).call(this);
