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
      dragUlPosition:  $('.cat-filter__list_all').length ? $('.cat-filter__list_all').position().left : 0
    },

    constants: {
      DAYS_MIN: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      DAYS: ['Воскресеньe', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      MONTHS_SHORT: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
      MONTHS: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    },

    listeners: function() {
      $('.expand-text').click(expandText);

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

      $(document).on('click', '[data-ref]', this.refCopy);

      $(document).on('mousedown', '.cat-filter__list_all', this.categoriesDrag.bind(this));

      $(document).on('click', '.cat-filter__filter', this.catFilterShow);
      $(document).on('click', '.filter-page__back', this.catFilterHide);
    },

    plugins: function() {
      $('.select:not([multiple])').selectric({
        onChange: this.selectricOnChange,
        onInit: this.selectricOnInit,
      });

      $('.select[multiple]').multiselect({
        scrollSize: 6,
        separator: ', '
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

      $('.rating_29').rateit({
        min: 0,
        max: 5,
        resetable: false,
        starwidth: 29,
        starheight: 27
      });

      $.mask.definitions['h'] = '[0-2]';
      $.mask.definitions['e'] = '[0-9]';
      $.mask.definitions['m'] = '[0-5]';
      $('[data-valid=time]').mask('he:m9');

      $('[data-toggle="datepicker"]').datepicker({
        autoPick: true,
        format: 'yyyy-MM-dd',
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        weekStart: 1,
        language: 'ru-RU',
        daysMin: this.constants.DAYS_MIN,
        days: this.constants.DAYS,
        monthsShort: this.constants.MONTHS_SHORT
      });

      $('.photogallery__body').mCustomScrollbar();
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
      var $this = $(this);
      if($this.is('.showed')) {
        $this.next().datepicker('hide');
        $this.removeClass('showed');
      } else {
        $this.next().datepicker('show');
        $this.addClass('showed');
      }
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
      $(this).siblings('#activity-socials').fadeToggle('fast').toggleClass('active');
    },

    hideShare: function(e) {
      if (!$(e.target).is('#activity-share') && !$(e.target).is('#activity-socials') && !$(e.target).is('[data-ref]'))
        $('[id=activity-socials]').fadeOut('fast').removeClass('active');
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

    refCopy: function() {
      var el = $(this);
      var text = el.html();
      var ref = el.attr('data-ref');
      var tempInput = document.createElement('input');
      var focus = document.activeElement;

      tempInput.value = ref;

      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      focus.focus();

      el.html('Ссылка скопирована');

      var textTimeout = setTimeout(resetText, 3000, text);

      el.on('mouseleave', function() {
        clearTimeout(textTimeout);
        textTimeout = setTimeout(resetText, 500, text);
      });

      function resetText(text) {
        el.html(text);
      }
    },

    categoriesDrag: function(e) {
      e.preventDefault();
      var ul = $(e.currentTarget);
      var parent = ul.parents('.cat-filter');
      var ulWidth = ul.width();
      var containerWidth = parent.innerWidth() - (parseInt(parent.css('padding-left')) + parseInt(parent.css('padding-right')));
      var startUlPosition = this.startValues.dragUlPosition;
      var prevUlPosition = ul.position().left;
      var prevCursorPosition = e.pageX;

      ul.on('dragstart', function(e) {
        e.preventDefault();
      });

      $(document).on('mousemove', function(e) {
        e.preventDefault();
        var cursorPosition = e.pageX;
        var difference = cursorPosition - prevCursorPosition;
        var ulPosition = prevUlPosition + difference;
        if (ulPosition >= startUlPosition) {
          ulPosition = startUlPosition;
        }
        if (ulPosition + ulWidth <= startUlPosition + containerWidth) {
          ulPosition = startUlPosition + containerWidth - ulWidth;
        }
        ul.css('left', ulPosition);
        prevUlPosition = ulPosition;
        prevCursorPosition = cursorPosition;
      });

      $(document).on('mouseup', function() {
        $(document).off('mousemove');
        ul.off('mouseup');
      });
    },

    catFilterShow: function() {
      if (!$('.filter-page').length) return;
      $('.content').addClass('filter');
      $('body').css('overflow', 'hidden');
    },

    catFilterHide: function() {
      $('.content').removeClass('filter');
      $('body').css('overflow', 'auto');
    },

    addNull: function(minutes) {
      return minutes.length === 0 ? '00': minutes.length > 1 ? '0' + minutes: minutes;
    }

  };

  app.initialize();
});