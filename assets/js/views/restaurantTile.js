(function(App) {
  
  App.Views.RestaurantTile = App.Views.Base.extend({

    template: 'restaurants/listItem',

    events: {
      'error .resto-image img': 'onImageError',
      'click .choices a[data-option]': 'onClickWaitTimeButton',
      'click .toggle-graph-btn' : 'onClickToggleGraphBtn'
    },

    initialize: function() {
      this.model.on('change:waitTimes', _.bind(this.updateWaitTimeDisplay, this));
    },

    updateWaitTimeDisplay: function() {
      var percents = this.model.getWaitTimePercents()
        , $waitTimeBar
      ;

      _.each(percents, _.bind(function(percent, option) {
        //console.log('Setting resto ' + model.id + ' option ' + option + ' bar to ' + percent + '%');
        $waitTimeBar = this.$('.rating-bar [data-option="' + option + '"]');
        $waitTimeBar.width(percent + '%');
        $waitTimeText = this.$('.time-text');

        var info = this.model.getWaitTimeText();
        $waitTimeText.html(info.name);
        this.$("[data-behavior='wait-color']").attr("class", "wait-color " + info.color);

      }, this));
    },

    onImageError: function(e) {
      $(e.currentTarget).attr('src', '/img/large-placeholder.gif');
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
    
    onClickToggleGraphBtn : function(e) {
      
      e.preventDefault();
      
      $(e.target).parent('.contents').find('.graph-wrapper').toggle();  
      
    }
    
  });

})(window.App);
