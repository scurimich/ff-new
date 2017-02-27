$(function() {
  var prevActiveTab = $('.tabs__link_active');
  if (prevActiveTab.attr('href') === '#reviews') $('#rating').addClass('active');

  $('.tabs__link').click(function(e) {
    e.preventDefault();
    var link = $(this);
    var href = link.attr('href');
    var prevActiveHref = prevActiveTab.attr('href');
    if (prevActiveHref === '#reviews') $('#rating').removeClass('active');

    prevActiveTab.removeClass('tabs__link_active');
    $(prevActiveHref).removeClass('active');

    link.addClass('tabs__link_active');
    $(href).addClass('active');
    if (href === '#reviews') $('#rating').addClass('active');

    prevActiveTab = link;
  });
});