$(document).ready(function() {
  $('.select').selectric({
    onChange: selectricDarken,
    onInit: selectricDarken
  });
});

function selectricDarken(select) {
  var $select = $(select);
  var disabled = $select.find('option[data-disabled]').text();
  var selectric = $select.parents('.selectric-select');
  var label = selectric.find('.selectric .label');
  label.removeClass('disabled');
  console.log(label.text(), disabled);
  if(label.text() === disabled) label.addClass('disabled');
}