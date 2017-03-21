function hideText() {
  $('.text').each(function() {
    var text = $(this);
    var expand = {};
    if (!text.is('[data-expand-strings], [data-expand-words]')) return false;
    expand.type = text.is('[data-expand-strings]') ? 'strings' : 'words';
    expand.number = expand.type === 'strings' ?
      text.attr('data-expand-strings') :
      text.attr('data-expand-words');

    if (expand.type === 'strings') {
      var oneString = parseInt(text.css('line-height'));
      var resultHeight = expand.number * oneString;
      text.attr('data-height', text.height());
      text.css('height', resultHeight + 'px');
    }

    if (expand.type === 'words') {
      var ref = text.find('.expand-text');
      var find = new RegExp('([а-яА-Яa-zA-Z,]+\\s){'+(expand.number-1)+'}[а-яА-Яa-zA-Z]+', 'mi');
      var removedText = text.text().trim().replace(find, '');
      text.attr('data-text', removedText);
      text.text(text.text().trim().match(find) + ' ... ');
      text.append(ref);
    }
  });
}

function expandText() {
  var btn = $(this);
  var text = btn.parents('.text').length ?
    btn.parents('.text') :
    btn.siblings('.text');
  if (text.attr('data-height')) {
    text.css('height', text.attr('data-height'))
    btn.remove();
  }

  if (text.attr('data-text')) {
    btn.remove();
    text.text(text.text().trim().replace(/\.{3}$/mi, '') + text.attr('data-text'));
  }
}