$(function() {
  $('.select').selectric({
    onChange: selectricDarken,
    onInit: selectricDarken
  });

  $('.rating').rateit({
    min: 0,
    max: 5,
    resetable: false,
    starwidth: 18,
    starheight: 18
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