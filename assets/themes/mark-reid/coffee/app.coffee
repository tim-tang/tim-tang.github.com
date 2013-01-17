$(document).ready ->
  # Go Top
  $("a.go_top").click () ->
    $('html, body').animate({ scrollTop: 0 },300);
    return false

  $(window).bind 'scroll resize', ->
    scroll_from_top = $(window).scrollTop()
    if scroll_from_top >= 1
      $("a.go_top").show()
    else
      $("a.go_top").hide()
