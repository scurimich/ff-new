var rateitOptions = {
  min: 0,
  max: 5,
  resetable: false,
  starwidth: 18,
  starheight: 18
};

$(function() {

  $('.select').selectric({
    onChange: selectricDarken,
    onInit: selectricDarken
  });

  $('.rating').rateit(rateitOptions);

  $('.text').each(function() {
    var text = $(this);
    var strings = text.attr('data-expand');
    var oneString = parseInt(text.css('line-height'));
    var resultHeight = strings * oneString;

    text.css('height', resultHeight + 'px');
  });

  $('.expand-text').click(function() {
    var parent = $(this).parent();
    var text;
    if (parent.is('.text')) text = parent;
    else text = parent.find('.text');

    if(!text) return false;

  });


});

function selectricDarken(select) {
  var $select = $(select);
  var disabled = $select.find('option[data-disabled]').text();
  var selectric = $select.parents('.selectric-select');
  var label = selectric.find('.selectric .label');
  label.removeClass('disabled');
  if(label.text() === disabled) label.addClass('disabled');
}