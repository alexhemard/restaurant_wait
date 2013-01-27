(function(App) {

  App.Views.RestaurantTile = App.Views.Base.extend({

    template: 'restaurants/listItem',

    events: {
      'click .choices a[data-option]': 'onClickWaitTimeButton'
    },

    initialize: function() {
      this.model.on('change:waitTimes', _.bind(this.updateWaitTimeDisplay, this))
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
        , $waitTimeBar
      ;

      _.each(percents, _.bind(function(percent, option) {
        //console.log('Setting resto ' + model.id + ' option ' + option + ' bar to ' + percent + '%');
        $waitTimeBar = this.$('.graph [data-option="' + option + '"]');
        $waitTimeBar.height(percent + '%');
        $waitTimeText = this.$('.time-text');

        var info = this.model.getWaitTimeText();
        $waitTimeText.html(info.name);
        this.$("[data-behavior='wait-color']").attr("class", "wait-color " + info.color);

      }, this));
    },

    onClickWaitTimeButton: function(e) {
      var $button = $(e.currentTarget)
        , optionId = $button.attr('data-option')
      ;

      e.preventDefault();

      this.$('.choices a[data-option]').removeClass('down');
      $button.addClass('down');

      this.model.collection.declareWaitTime(this.model.id, optionId);
    },

  });

})(window.App);
