$(function() {

  var app = {

    initialize: function() {
      this.initializeInfo();
      this.listeners();
      this.plugins();
      hideText();
    },

    listeners: function() {
      $('.tabs__link').click(this.tabClick.bind(this));
      $('.expand-text').click(expandText);
    },

    initializeInfo: function() {
      this.activeTab = $('.tabs__link_active');
      if (this.activeTab.attr('href') === '#reviews') $('#rating').addClass('active');
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
    },

    tabClick: function(e) {
      e.preventDefault();
      var link = $(e.currentTarget);
      var href = link.attr('href');
      var prevActiveHref = this.activeTab.attr('href');
      if (prevActiveHref === '#reviews') $('#rating').removeClass('active');

      this.activeTab.removeClass('tabs__link_active');
      $(prevActiveHref).removeClass('active');

      link.addClass('tabs__link_active');
      $(href).addClass('active');
      if (href === '#reviews') $('#rating').addClass('active');

      this.activeTab = link;
    },


    selectricDarken: function(select) {
      var $select = $(select);
      var disabled = $select.find('option[data-disabled]').text();
      var selectric = $select.parents('.selectric-select');
      var label = selectric.find('.selectric .label');
      label.removeClass('disabled');
      if(label.text() === disabled) label.addClass('disabled');
    }

  };

  app.initialize();
});