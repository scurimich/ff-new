$(function() {

  var app = {

    initialize: function() {
      this.plugins();
      this.listeners();
      this.aboutInterval = setInterval(this.aboutViewportChanging.bind(this), 5000);
    },

    listeners: function() {

      $(document).click(this.popup);

      $('[data-modal*="modal"]').click(this.openModal);
      $(document).on('click', this.closeModal);

      $(document).on('click', '.viewport__nav', this.aboutViewportNavClick.bind(this))

      $(document).on('mouseover mouseout', '.viewport__slides', this.aboutViewportStop.bind(this));
      $(document).on('mouseout', '.viewport__slides', this.aboutViewportStart.bind(this));
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

    popup: function(e) {
      var click = $(e.target);
      var time = 100;
      if (click.is('[data-popup=click]') || click.parents('[data-popup=click]').length) {
        var href = click.attr('data-href') || click.parents('[data-popup=click]').attr('data-href');
        $('[data-popup=window].active:not(' + href + ')').css('opacity', 0).removeClass('active');
        var hidden = $(href);
        if (hidden.is('.active')) {
          hidden.stop().animate({'opacity': '0'}, time, function() {
            hidden.removeClass('active');
          });
        } else {
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
    }

  };

  app.initialize();
});