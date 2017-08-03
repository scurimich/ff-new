(function($) {
  $.fn.multiselect = function(settings) {

  	var $this = $(this);
  	var $options = $this.find('option');

  	var firstLabelText = $($options[0]).val();

    var wrapper = $('<div/>', {'class': 'selectric-wrapper selectric-select'});
    var selectric = $('<div/>', {'class': 'selectric'});
    var items = $('<div/>', {'class': 'selectric-items'});
    var hide = $('<div/>', {'class': 'selectric-hide-select'});
    var button = $('<b/>', {'class': 'button', 'text': '▾'});
    var label = $('<span/>', {'class': 'label', 'text': firstLabelText});
    var scroll = $('<div/>', {'class': 'selectric-scroll'});
    var ul = $('<ul/>');
    var listItems = [];

    $options.map(function(ndx, option) {
    	var option = $(option);
    	var selected = option.prop('selected') ? 'selected' : '';
    	var disabled = option.prop('disabled') ? ' disabled' : '';
    	var value = option.attr('value');
    	listItems.push($('<li/>', {
    		'class': selected + disabled,
    		'text': option.html(),
    		'value': value
    	}));
    });

    $this.hide();

    $this.wrap(wrapper).wrap(hide);
    var $wrapper = $this.parents('.selectric-wrapper');

    $wrapper.append(selectric.append(label, button));
    $wrapper.append(items.append(scroll.append(ul)));
    $wrapper.find('ul').append(listItems);

    var $selectric = $wrapper.find('.selectric');
    var $label = $wrapper.find('.label');
    var $items = $wrapper.find('.selectric-items');
    var li = $items.find('li')[0];
    var $li = $(li);

    var itemHeight =
      (parseInt($li.css('padding-top')) +
      parseInt($li.css('padding-bottom')) +
      parseInt($li.css('line-height'))) *
      parseInt(listItems.length < settings.scrollSize ? listItems.length : settings.scrollSize);

    var selectedItems = [];

    $(document).on('click', function(e) {
      var $el = $(e.target);

      if ($el.parents('.select-box_multiple').length) {

        if (($el.is('.selectric') || $el.parent().is('.selectric')) && !$el.is('.cancel')) {
          if ($wrapper.is('.selectric-open')) {
            $wrapper.removeClass('selectric-open');
            $items.hide();
          } else {
            $wrapper.addClass('selectric-open');
            $items.width($selectric.outerWidth()).height(itemHeight).show();
          }
        }

        if ($el.is('li')) {
          if ($el.is('.disabled') || $el.is('.off')) return false;

          if ($el.is('.selected')) {
            var findedIndex = selectedItems.findIndex(function(el, ndx) {
              return el.index === $el.index() && el.value === $el.val();
            });

            selectedItems.splice(findedIndex, 1);
            $el.removeClass('selected');
            $this.find('option:nth-child(' + ($el.index() + 1) + ')').prop('selected', false);
          } else {
            selectedItems.push({
              index: $el.index(),
              value: $el.val(),
              text: $el.html()
            });
            $el.addClass('selected');
            $this.find('option:nth-child(' + ($el.index() + 1) + ')').prop('selected', true);
          }
        }

        if ($el.is('.cancel') || $el.parent().is('.cancel')) {
          selectedItems = [];
          $options.each(function() {$(this).prop('selected', false);})
          $items.find('li').removeClass('selected');
          $items.find('li.off').each(function() {
            $(this).removeClass('off');
          });
        }

        if (selectedItems.length) {
          if (!$selectric.is('.active')) {
            $selectric.addClass('active');
            $selectric.append('<div class="cancel"><span></span></div>');
          }
          $label.html(selectedItems.map(function(el, ndx) {
            return ndx === 0 ? el.text : settings.separator + el.text;
          }));

          if (selectedItems.length === 3) {
            $items.find('li:not(.selected)').each(function() {
              $(this).addClass('off');
            });
          } else {
            $items.find('li.off').each(function() {
              $(this).removeClass('off');
            });
          }
        } else {
          $selectric.removeClass('active');
          $selectric.find('.cancel').remove();
          $label.html(firstLabelText);
        }

      } else {
        $wrapper.removeClass('selectric-open');
        $items.hide();
      }
      
    });

  }
})(jQuery);