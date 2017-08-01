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
$(function() {

  var app = {

    initialize: function() {
      this.plugins();
      this.listeners();
      hideText();
      this.sidebarBehavior();
      this.statusbars();
      this.aboutInterval = setInterval(this.aboutViewportChanging.bind(this), 5000);
    },

    startValues: {
      sideOffset: $('aside').length ? $('aside').offset().top : 0,
      sideParentHeight: $('aside').length ? $('aside').parent().height() : 0,
      windowPrevPosition: $(window).scrollTop(),
      multipleSelectricValues: [],
    },

    constants: {
      DAYS_MIN: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      DAYS: ['Воскресеньe', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      MONTHS_SHORT: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
      MONTHS: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    },

    listeners: function() {
      $('.expand-text').click(expandText);

      $('.select-box_multiple').on('click', '.cancel', this.clearMultiselect);

      $(document).click(this.popup);

      $('[id=commenting-input]').focus(this.npWrite);
      $('[id=commenting-input]').focusout(this.npClose);
      $('[id=commenting-input]').on('keydown keyup', this.npWriting);

      $('[data-modal*="modal"]').click(this.openModal);
      $(document).on('click', this.closeModal);

      $('[id=review-other]').click(this.showReviewTooltip);
      $(document).click(this.hideReviewTooltip);

      $('[id=add-review] textarea').focus(this.showAddReview);
      $('[id=add-review] textarea').focusout(this.hideAddReview);

      $('[id=activity-share]').click(this.showShare);
      $(document).click(this.hideShare);

      $('#catfilter-switcher').click(this.switchCats);

      $(window).scroll(this.sidebarBehavior.bind(this));

      $(document).on('click', '.viewport__nav', this.aboutViewportNavClick.bind(this))

      $(document).on('mouseover mouseout', '.viewport__slides', this.aboutViewportStop.bind(this));
      $(document).on('mouseout', '.viewport__slides', this.aboutViewportStart.bind(this));

      $(document).on('keyup', '[data-valid=time]', this.timeValidation);

      $(document).on('click', '[href="#time-remove"]', this.scheduleRemover);

      $(document).on('change focusout', 'input[data-mask]', this.socialsValidationShow);
      $(document).on('focus', 'input[data-mask]', this.socialsValidationHide);

      $('.head-user__menu-item_projects').hover(this.headerMenuHover.bind(this));

      $('[data-toggle=datepicker]').on('pick.datepicker', this.datepickerClose.bind(this));
      $(document).on('click', '[data-datepicker=trigger]', this.datepickerShow);
    },

    plugins: function() {
      $('.select').selectric({
        onChange: this.selectricOnChange,
        onInit: this.selectricOnInit,
        multiple: {
          separator: ', ',
          keepMenuOpen: true,
          maxLabelEntries: false
        }
      });

      $('.rating').rateit({
        min: 0,
        max: 5,
        resetable: false,
        starwidth: 20,
        starheight: 18
      });

      $('.rating_12').rateit({
        min: 0,
        max: 5,
        resetable: false,
        starwidth: 14,
        starheight: 12
      });

      $('.rating_13').rateit({
        min: 0,
        max: 5,
        resetable: false,
        starwidth: 15,
        starheight: 13
      });

      $('.rating_14').rateit({
        min: 0,
        max: 5,
        resetable: false,
        starwidth: 16,
        starheight: 14
      });

      $.mask.definitions['h'] = '[0-2]';
      $.mask.definitions['e'] = '[0-9]';
      $.mask.definitions['m'] = '[0-5]';
      $('[data-valid=time]').mask('he:m9');

      $('[data-toggle="datepicker"]').datepicker({
        autoPick: true,
        format: 'yyyy-MM-dd',
        date: new Date(),
        weekStart: 1,
        language: 'ru-RU',
        daysMin: this.constants.DAYS_MIN,
        days: this.constants.DAYS,
        monthsShort: this.constants.MONTHS_SHORT
      });
    },

    datepickerClose: function(e) {
      var that = this;
      $('[data-toggle="datepicker"]').datepicker('hide');
      setTimeout((function() {
        var date = $(e.target);
        var dateValues = date.val().split('-');
        var input = date.prev();
        input.val(dateValues[2] + ' ' + this.constants.MONTHS[parseInt(dateValues[1]) - 1] + ' ' + dateValues[0]);
      }).bind(that), 0);
    },

    datepickerShow: function() {
      $(this).next().datepicker('show');
    },

    timeValidation: function() {
      var input = $(this);
      var value = input.val();
      if (value[0] === '2' && value[1] > 3) {
        input.val(value[0]+'_:__');
        input[0].setSelectionRange(1,2);
      }
    },

    selectricOnInit: function(select) {
      var $select = $(select);
      var disabled = $select.find('option[data-disabled]').text();
      var selectric = $select.parents('.selectric-select');
      var labelParent = selectric.find('.selectric');
      var label = selectric.find('.selectric .label');
      label.removeClass('disabled');
      if(label.text() === disabled) label.addClass('disabled');
      if($select.attr('multiple') && $select.val().length) {
        labelParent.addClass('active');
        if (!labelParent.find('.cancel').length) {
          labelParent.append('<div class="cancel"><span></span></div>');
        }
      } else {
        labelParent.removeClass('active');
        labelParent.find('.cancel').remove();
      }
    },
    
    selectricOnChange: function(select) {
      var $select = $(select);
      var disabled = $select.find('option[data-disabled]').text();
      var selectric = $select.parents('.selectric-select');
      if ($select.parents('.owner-main__select')) {
        var options = $select.find('option');
        var items = selectric.find('.selectric-items .selected');
        if (items.length >= 3) {
          selectric.find('.selectric-items li:not(.selected)').each(function() {
            var li = $(this);
            var index = li.index();
            li.addClass('disabled');
            $select
              .find('option:nth-child('+ (index + 1) +')')
              .prop('disabled', true);
          });

        } else if (items.length == 2 && $select.find('option:disabled').length){
          // selectric.find('.selectric-items li')
          // options.attr('disabled', false);
          // $select.selectric('refresh').click();
        }
      }
      var labelParent = selectric.find('.selectric');
      var label = selectric.find('.selectric .label');
      label.removeClass('disabled');
      if(label.text() === disabled) label.addClass('disabled');
      if($select.attr('multiple') && $select.val().length) {
        labelParent.addClass('active');
        if (!labelParent.find('.cancel').length) {
          labelParent.append('<div class="cancel"><span></span></div>');
        }
      } else {
        labelParent.removeClass('active');
        labelParent.find('.cancel').remove();
      }
    },

    clearMultiselect: function(e) {
      e.preventDefault();
      var button = $(this);
      var select = button.parents('.selectric-select').find('.selectric-items li.selected');
      select.each(function() {
        $(this).click();
      });
      $(this).remove();
    },

    popup: function(e) {
      var click = $(e.target);
      var time = 100;
      $('[data-popup=click]').removeClass('active');

      if (click.is('.head-user__menu-item_projects') || click.parent().is('.head-user__menu-item_projects')) {
        e.preventDefault();
        return;
      }

      if (click.is('[data-popup=click]') || click.parents('[data-popup=click]').length) {
        var href = click.attr('data-href') || click.parents('[data-popup=click]').attr('data-href');
        var clicked;
        if (click.is('[data-popup=click]')) clicked = click;
        else clicked = click.parents('[data-popup=click]');

        $('[data-popup=window].active:not(' + href + ')').css('opacity', 0).removeClass('active');

        var hidden = $(href);
        if (hidden.is('.active')) {
          clicked.removeClass('active');
          hidden.stop().animate({'opacity': '0'}, time, function() {
            hidden.removeClass('active');
          });
        } else {
          clicked.addClass('active');
          hidden.addClass('active').stop().animate({'opacity': '1'}, time);
        }

        return;
      }

      if (!click.is('[data-popup=window]') && !click.parents('[data-popup=window]').length) {

        var more = $('[data-popup=window]');
        var time = 100;
        more.stop().animate({'opacity': '0'}, time);
        setTimeout(function() {more.removeClass('active');}, time * 2);
      }
    },

    npWrite: function() {
      var input = $(this);
      var footer = input.parents('#commenting-parent').find('#commenting-foot');
      footer.slideDown(100, function() {
        footer.addClass('active');
      });
    },

    npClose: function() {
      var input = $(this);
      var footer = input.parents('#commenting-parent').find('#commenting-foot');
      footer.slideUp(200, function() {
        footer.removeClass('active');
      });
    },

    npWriting: function() {
      var input = $(this);
      var value = input.val().length;
      var span = input.parents('#commenting-parent').find('#commenting-count');
      span.text(span.text().trim().replace(/^\d+\s/i, value + ' '));
    },

    openModal: function(e) {
      e.preventDefault();
      var popup = $(this).attr('data-modal');
      $('[data-id=' + popup + ']').addClass('active');
    },

    closeModal: function(e) {
      if(($(e.target).is('#modal-close') || $(e.target).is('#modal-sub')) ||
        ($(e.target).is('#modal')) && !$(e.target).find('#modal-sub').length)
        $('[id=modal]').removeClass('active');
    },

    showReviewTooltip: function() {
      $(this).find('#review-tooltip').toggleClass('active');
    },

    hideReviewTooltip: function(e) {
      if (!$(e.target).is('[id=review-tooltip]') && !$(e.target).is('[id=review-other]'))
        $('[id=review-tooltip]').removeClass('active');
    },

    showAddReview: function() {
      var ta = $(this);
      ta.addClass('active');
      ta.prev().addClass('active');
      ta.next().addClass('active');
    },

    hideAddReview: function() {
      var ta = $(this);
      if (!ta.val().length) {
        ta.removeClass('active');
        ta.prev().removeClass('active');
        ta.next().removeClass('active');
      }
    },

    showShare: function() {
      $(this).siblings('#activity-socials').toggleClass('active');
    },

    hideShare: function(e) {
      if (!$(e.target).is('#activity-share') && !$(e.target).is('#activity-socials'))
        $('[id=activity-socials]').removeClass('active');
    },

    switchCats: function() {
      var button = $(this);
      var text = button.text();
      var filter = button.parents('#cat-filter');
      filter.find('ul.active').removeClass('active').siblings('ul').addClass('active');
      button.text(button.attr('data-alt')).attr('data-alt', text);
    },

    sidebarBehavior: function(e) {
      var sidebar = $('aside');
      if (!sidebar.length) return;
      var next = sidebar.next();
      var footer = $('.footer');
      var windowHeight = $(window).height();
      var windowPrevPosition = this.startValues.windowPrevPosition;
      var windowPosition = $(window).scrollTop();
      var windowDiffPositions = windowPosition - windowPrevPosition;
      var sideStartOffset = this.startValues.sideOffset;
      var sideHeight = sidebar.height();
      var sideWidth = sidebar.outerWidth() + parseInt(sidebar.css('margin-right'));
      var sideOffset = sidebar.offset().top;
      var sidePaddingTop = sidebar.css('padding-top');
      var sidePaddingBottom = sidebar.css('padding-bottom');
      var footerOffset = footer.offset().top;
      var footerHeight = footer.outerHeight();
      var parentHeight = this.startValues.sideParentHeight;
      var padding = 40;
      if (parentHeight <= sideHeight) return false;

      if (sideHeight + padding * 2 < windowHeight) {
        if (windowPosition > (sideStartOffset - padding / 2) &&
          windowPosition + (sideHeight + padding * 1.5) < footerOffset) {
          if (next.length) next.css('margin-left', sideWidth);
          sidebar.addClass('fixed');
          sidebar.removeClass('absolute');
        }
        if (windowPosition <= (sideStartOffset - padding / 2)) {
          sidebar.removeClass('fixed');
          sidebar.removeClass('absolute');
          next.attr('style', '');
        }
        if (windowPosition > (sideStartOffset - padding / 2) &&
          windowPosition + (sideHeight + padding * 1.5) >= footerOffset) {
          if (next.length) next.css('margin-left', sideWidth);
          sidebar.removeClass('fixed');
          sidebar.addClass('absolute');
          sidebar.css('bottom', footerHeight + padding);
        }
      } else {
        if (windowDiffPositions > 0) {
          if ((windowPosition + windowHeight) >= footerOffset) {
            sidebar.removeClass('fixed fixed_tall');
            sidebar.addClass('absolute');
            sidebar.css('bottom', footerHeight + padding);
          } else if (windowPosition + windowHeight >= sideOffset + sideHeight + padding) {
            if (next.length) next.css('margin-left', sideWidth);
            sidebar.addClass('fixed fixed_tall');
            sidebar.removeClass('absolute');
            sidebar.css('top', '');
            sidebar.css('bottom', padding);
          } else if ((windowPosition + windowHeight) > sideOffset) {
            if (next.length) next.css('margin-left', sideWidth);
            sidebar.removeClass('fixed');
            sidebar.addClass('absolute');
            sidebar.css('bottom', '');
            sidebar.css('top', sideOffset);
          }
        }
        if (windowDiffPositions < 0) {
          if (windowPosition <= sideStartOffset - padding / 2) {
            sidebar.removeClass('fixed fixed_tall');
            sidebar.removeClass('absolute');
            next.attr('style', '');
            sidebar.attr('style', '');
          } else if (windowPosition <= sideOffset - padding / 2) {
            if (next.length) next.css('margin-left', sideWidth);
            sidebar.addClass('fixed fixed_tall');
            sidebar.removeClass('absolute');
            sidebar.css('bottom', '');
            sidebar.css('top', padding / 2);
          } else if (windowPosition < sideOffset + sideHeight) {
            if (next.length) next.css('margin-left', sideWidth);
            sidebar.removeClass('fixed fixed_tall');
            sidebar.addClass('absolute');
            sidebar.css('bottom', '');
            sidebar.css('top', sideOffset);
          }
        }
      }
      this.startValues.windowPrevPosition = windowPosition;
    },

    statusbars: function() {
      $('[data-statusbar]').each(function() {
        var statusbar = $(this);
        var require = statusbar.attr('data-statusbar');
        var complete = statusbar.attr('data-complete');
        statusbar.find('[class*=complete]').css('width', (complete / require) * 100 + '%');
      });
    },

    aboutViewportChanging: function() {
      var viewport = $('.viewport');
      var activeSlide = viewport.find('.viewport__slide.active');
      var activeNav = viewport.find('.viewport__nav.active');
      var nextNav, nextSlide;

      if (activeSlide.next().length === 0) {
        nextNav = activeNav.siblings('.viewport__nav:first-child');
        nextSlide = activeSlide.siblings('.viewport__slide:first-child')
      } else {
        nextSlide = activeSlide.next();
        nextNav = activeNav.next();
      }

      this.aboutSlidesSwitching(activeSlide, activeNav, nextSlide, nextNav);
    },

    aboutViewportNavClick: function(e) {
      var $nav = $(e.currentTarget);
      var viewport = $nav.parents('.viewport');
      if (viewport.find('.showing').length || $nav.is('.active')) return false;

      clearInterval(this.aboutInterval)
      this.aboutInterval = setInterval(this.aboutViewportChanging.bind(this), 5000);

      var activeNav = $nav.siblings('.active');
      var index = $nav.index() + 1;
      var slide = viewport.find('.viewport__slide:nth-child(' + index + ')');
      var activeSlide = viewport.find('.viewport__slide.active');

      this.aboutSlidesSwitching(activeSlide, activeNav, slide, $nav);
    },

    aboutSlidesSwitching: function(prevSlide, prevNav, nextSlide, nextNav) {
      var prevImg = prevSlide.find('img');
      var prevText = prevSlide.find('h3, p');

      var nextImg = nextSlide.find('img');
      var nextText = nextSlide.find('h3, p');

      prevNav.removeClass('active');
      nextNav.addClass('active');

      prevSlide.addClass('hidding');
      nextSlide.addClass('showing active');
      nextImg.css('opacity', '1');

      prevText.removeClass('active');
      nextText.addClass('active');

      prevImg.animate({'opacity': '0'}, 1000, function() {
        nextSlide.removeClass('showing');
        prevSlide.removeClass('hidding active');
      });
    },

    aboutViewportStop: function(e) {
      clearInterval(this.aboutInterval);
    },

    aboutViewportStart: function(e) {
      this.aboutInterval = setInterval(this.aboutViewportChanging.bind(this), 5000);
    },

    scheduleRemover: function(e) {
      e.preventDefault();
      var remove = $(this);
      var list = remove.parents('.owner-schedule__times');
      remove.parents('.schedule-time').remove();
      if (!list.find('.schedule-time').length) list.parent().remove();
    },

    socialsValidationShow: function() {
      var input = $(this);
      var value = input.val();
      var mask = input.attr('data-mask');
      
      if (!value) return;
      if (value.indexOf(mask) !== 0) {
        input.next().show();
        input.addClass('text-input_error');
      }
    },

    socialsValidationHide: function() {
      var input = $(this);
      input.next().hide();
      input.removeClass('text-input_error');
    },

    headerMenuHover: function(e) {
      var ref = $(e.currentTarget);
      var ul = ref.find('ul');
      var ulWidth = 220;
      var ulPosition = (ref.offset().left + ulWidth) + ulWidth;
      var windowWidth = $(window).innerWidth();
      if (windowWidth <= ulPosition) {
        ul.css({
          'right': '220px',
          'left': 'auto'
        });
      } else {
        ul.css({
          'left': '220px',
          'right': 'auto'
        });
      }
      if (e.type === 'mouseenter') {
        clearTimeout(this.hoverTimeout);
        ul.addClass('active');
      } else {
        this.hoverTimeout = setTimeout(function() {ul.removeClass('active')}, 400);
      }
    },

    addNull: function(minutes) {
      return minutes.length === 0 ? '00': minutes.length > 1 ? '0' + minutes: minutes;
    }

  };

  app.initialize();
});
$(function() {

  if (window.ymaps) {
    ymaps.ready(mapInit);
    var myMap;
  }

    if (window.google) {
      google.maps.event.addDomListener(window, "load", googleMapInit);
    }

});


function mapInit() {
  myMap = new ymaps.Map('map', {
    center: [48.70, 44.51],
    zoom: 9
  });
}

function googleMapInit() {
  var input = $('#owner-coords');
  var box = document.getElementById('address-map');
  var inputCoords = input.val() || '1 1';
  var marker;
  var coords = {
    lat: Number(inputCoords.substring(0, inputCoords.indexOf(','))),
    lng: Number(inputCoords.substring(inputCoords.indexOf(' ')))
  };

  if (!box) return;
  var googleMap = new google.maps.Map(box, {
    center: coords,
    zoom: coords.lat ? 8 : 2
  });
  
  if (coords.lat && coords.lng) {
    marker= new google.maps.Marker({
      position: coords,
      map: googleMap
    })
  }

  googleMap.addListener('click', function(e) {
    var coords = {lat: Number(e.latLng.lat().toFixed(6)), lng: Number(e.latLng.lng().toFixed(6))};
    var inputCoords = coords.lat + ', ' + coords.lng;
    input.val(inputCoords);
    marker.setPosition(coords);
  });
}