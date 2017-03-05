$(function() {

  var app = {

    initialize: function() {
      this.listeners();
      this.plugins();
      hideText();
    },

    listeners: function() {
      $('.expand-text').click(expandText);
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
    }

  };

  app.initialize();
});