$(function() {

  var app = {

    initialize: function() {
      this.listeners();
      this.plugins();
      hideText();
    },

    listeners: function() {
      $('.expand-text').click(expandText);
      $('.head-notifs').click(this.notifs);
      $('.head-user').click(this.profile);
      $('.head-cats__item_more').click(this.more);
    },

    plugins: function() {
      $('.select').selectric({
        onChange: this.selectricDarken,
        onInit: this.selectricDarken
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
    },
    
    selectricDarken: function(select) {
      var $select = $(select);
      var disabled = $select.find('option[data-disabled]').text();
      var selectric = $select.parents('.selectric-select');
      var label = selectric.find('.selectric .label');
      label.removeClass('disabled');
      if(label.text() === disabled) label.addClass('disabled');
    },

    notifs: function() {
      var time = 100;
      var hidden = $(this).find('.head-notifs__popup');
      if (hidden.is('.active')) {
        hidden.animate({'opacity': '0'}, time);
        setTimeout(function() {hidden.removeClass('active');}, time * 5);
        return;
      }
      hidden.addClass('active').animate({'opacity': '1'}, time);
    },

    profile: function() {
      var time = 100;
      var hidden = $(this).find('.head-user__profile');
      if (hidden.is('.active')) {
        hidden.animate({'opacity': '0'}, time);
        setTimeout(function() {hidden.removeClass('active');}, time * 5);
        return;
      }
      hidden.addClass('active').animate({'opacity': '1'}, time);
    },

    more: function() {
      var time = 100;
      var hidden = $(this).find('ul');
      if (hidden.is('.active')) {
        hidden.animate({'opacity': '0'}, time);
        setTimeout(function() {hidden.removeClass('active');}, time * 5);
        return;
      }
      hidden.addClass('active').animate({'opacity': '1'}, time);
    }

  };

  app.initialize();
});