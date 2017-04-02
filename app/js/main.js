$(function() {

  var app = {

    initialize: function() {
      this.listeners();
      this.plugins();
      hideText();
    },

    startValues: {
      // sideOffset: $('aside').offset().top
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
    },

    plugins: function() {
      $('.select').selectric({
        onChange: this.selectricOnChange,
        onInit: this.selectricOnChange,
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

      $('.photogallery__body').mCustomScrollbar({
        scrollInertia: 0
      });
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
        console.log('-')
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
      // var sidebar = $('aside');
      // var windowHeight = +window.innerHeight;
      // var windowPosition = +window.pageYOffset;
      // var sideStartOffset = this.startValues.sideOffset;
      // var sideHeight = +$('aside').height();
      // var sideOffset = +$('aside').offset().top;
      // var footerOffset = $('.footer').offset().top;
      // var footerHeight = $('.footer').outerHeight();
      // if (sideHeight >= windowHeight) {
      // }

      // if (sideHeight < windowHeight) {
      //   if (windowPosition > sideOffset) {
      //     sidebar.addClass('fixed');
      //     sidebar.removeClass('absolute');
      //   }
      //   if (windowPosition <= sideStartOffset) {
      //     sidebar.removeClass('fixed');
      //     sidebar.removeClass('absolute');
      //   }
      //   if (sideOffset + sideHeight >= footerOffset) {
      //     sidebar.removeClass('fixed');
      //     sidebar.addClass('absolute');
      //     sidebar.css({
      //       'bottom': footerHeight
      //     });
      //   }
      //   if (windowPosition + sideHeight < footerOffset &&
      //     windowPosition > sideStartOffset) {
      //     sidebar.removeClass('absolute');
      //     sidebar.addClass('fixed');
      //     sidebar.css({
      //       'bottom': 'initial'
      //     });
      //   }
      // }

      // console.log(windowHeight, windowPosition);
      // console.log(sideStartOffset, sideHeight, sideOffset);
      // console.log(footerHeight, footerOffset);
    }

  };

  app.initialize();
});