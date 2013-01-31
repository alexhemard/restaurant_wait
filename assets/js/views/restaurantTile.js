(function(App) {

  App.Views.RestaurantTile = App.Views.Base.extend({

    template: 'restaurants/listItem',

    events: {
      'click .choices a[data-option]': 'onClickWaitTimeButton'
    },

    initialize: function() {
      this.model.on('change:waitTimes change:vendorWaitTime', _.bind(this.updateWaitTimeDisplay, this));
    },

    render: function() {
      var retVal = App.Views.Base.prototype.render.apply(this, arguments);

      // Load place holder if image does not load
      // (cannot use jquery events because error events do not bubble)
      this.$('.resto-image img').error(function() {
        $(this).remove();
      });

      return retVal;
    },

    updateWaitTimeDisplay: function() {
      var percents = this.model.getWaitTimePercents()
      , vendorWaitTime = this.model.get('vendorWaitTime')
      , $waitTimeBar
      , $waitTimeText = this.$el.find('.time-text')
      , info = this.model.getWaitTimeText()
      ;
      
      if (vendorWaitTime){
        this.$el.addClass('verified');
      }

      _.each(percents, _.bind(function(percent, option) {
        //console.log('Setting resto ' + model.id + ' option ' + option + ' bar to ' + percent + '%');
        $waitTimeBar = this.$el.find('.graph [data-option="' + option + '"]');
        $waitTimeBar.height(percent + '%');
      }, this));

      $waitTimeText.html(info.name);
      this.$el.find("[data-behavior='wait-color']").attr("class", "wait-color " + info.color);

    },

    onClickWaitTimeButton: function(e) {
      var $button = $(e.currentTarget)
        , optionId = $button.attr('data-option')
      ;

      e.preventDefault();

      this.$('.choices a[data-option]').removeClass('down');
      $button.addClass('down');

      this.model.declareWaitTime(optionId);
    },

  });

})(window.App);
